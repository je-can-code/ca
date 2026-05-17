//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 PIXEL] Enables sub-tile (pixel-accurate) movement on the map.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is J-Pixelistics: pixel-accurate movement for RPG Maker MZ.
 *
 * It replaces the default tile-locked movement with a fractional-coordinate
 * system, allowing characters to occupy any point within the map rather than
 * only the center of a tile. Sub-tile collision is handled via a subcell
 * table built from the engine's own tile passability data.
 *
 * All J-plugins that provide optional integration with this plugin (such as
 * J-ABS-Pixelistics for JABS combat support) load after this plugin.
 *
 * ----------------------------------------------------------------------------
 * DETAILS
 * Characters move in fractional tile units each frame (e.g. 0.15 tiles). A
 * subcell collision table (PIXEL_CollisionManager) is built on each map load,
 * dividing every tile into a configurable number of subcells (default 4x4).
 *
 * Collision is resolved by checking subcell edge crossings in the direction
 * of travel, using directional passability codes derived from the tileset.
 *
 * JABS integration (ally AI formation, smart battler movement, action
 * distance scaling, etc.) is handled by the separate J-ABS-Pixelistics
 * extension, which must be loaded after this plugin.
 *
 * ----------------------------------------------------------------------------
 * LAYERING
 * The source for this plugin is organized as follows:
 *   src/plugins/pixel/core  — this plugin (engine-facing movement)
 *   src/plugins/pixel/ext/abs  — JABS bridge (loads after J-ABS + this)
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Optional foot-touch trigger delay after map setup (plugin parameter).
 * - 1.0.0
 *    Initial release as standalone J-Pixelistics.
 *    Sub-tile fractional-coordinate movement with AABB subcell collision grid.
 *    Wall-sliding on cardinal and diagonal movement.
 *    Visual depth pivot (characters rendered with feet at the tile center).
 *    Vector (360-degree) movement via raw analog gamepad axes; falls back to
 *    8-direction for keyboard and d-pad input.
 *    Subcell collision debug overlay (toggle with backslash key).
 * ============================================================================
 *
 *
 * @param collisionConfigs
 * @text COLLISION SETUP
 *
 * @param collisionStepCount
 * @parent collisionConfigs
 * @type select
 * @option 1 (coarse)
 * @value 1
 * @option 2 (medium)
 * @value 2
 * @option 4 (fine, default)
 * @value 4
 * @text Subcells Per Tile
 * @desc The number of subcells to divide each tile into along each axis. Higher = more precise edges but more memory.
 * @default 4
 *
 * @param collisionRadius
 * @parent collisionConfigs
 * @type number
 * @decimals 2
 * @min 0.05
 * @max 0.49
 * @text Collision Radius
 * @desc Half-size of the character's square hitbox in tile units. 0.3 is a reasonable default.
 * @default 0.30
 *
 *
 * @param movementConfigs
 * @text MOVEMENT
 *
 * @param vectorMovementEnabled
 * @parent movementConfigs
 * @type boolean
 * @text Enable Vector (360°) Movement
 * @desc When true, the player can move at any angle via analog stick or mouse direction. Falls back to 8-dir if no analog input.
 * @default false
 *
 * @param footTouchEventDelayFrames
 * @parent movementConfigs
 * @type number
 * @min 0
 * @max 120
 * @text Foot Touch Trigger Delay (frames)
 * @desc After a map loads, suppress Player Touch / Event Touch on the tile under the player for this many frames (0 = off). Reduces spurious saves after load.
 * @default 15
 *
 *
 * @param debugConfigs
 * @text DEBUG
 *
 * @param overlayInitiallyVisible
 * @parent debugConfigs
 * @type boolean
 * @text Overlay Initially Visible
 * @desc Show the subcell collision overlay on map load. Toggle at runtime with the backslash key.
 * @default false
 *
 */
//endregion annotations

//region plugin metadata
/**
 * Plugin metadata class for J-Pixelistics.
 */
class JPixelistics_PluginMetadata
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
     * Whether or not 360-degree vector movement is enabled.
     * When false, movement snaps to the standard 8 directions.
     * @type {boolean}
     */
    this.VectorMovementEnabled = (this.parsedPluginParameters['vectorMovementEnabled'] === 'true');

    /**
     * Frames after map setup during which player/event touch triggers underfoot are ignored.
     * @type {number}
     */
    this.FootTouchEventDelayFrames = J.BASE.Helpers.parsePluginInt(
      this.parsedPluginParameters['footTouchEventDelayFrames'],
      15
    );

    /**
     * The number of subcells per tile axis to use for collision resolution.
     * Valid values: 1, 2, or 4.
     * @type {number}
     */
    this.CollisionStepCount = parseInt(this.parsedPluginParameters['collisionStepCount']) || 4;

    /**
     * The half-size of the character hitbox in tile units used for AABB collision.
     * @type {number}
     */
    this.CollisionRadius = parseFloat(this.parsedPluginParameters['collisionRadius']) || 0.30;

    /**
     * Whether or not the subcell collision overlay should be visible on map load.
     * @type {boolean}
     */
    this.OverlayInitiallyVisible = (this.parsedPluginParameters['overlayInitiallyVisible'] === 'true');
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
 */
J.PIXEL = {};

/**
 * The parent namespace for all J-Pixelistics extensions.
 */
J.PIXEL.EXT ||= {};

/**
 * The metadata associated with this plugin.
 */
J.PIXEL.Metadata = new JPixelistics_PluginMetadata('J-Pixelistics', '1.0.1');

/**
 * A collection of all aliased methods for this plugin.
 */
J.PIXEL.Aliased = {
  Game_Character: new Map(),
  Game_CharacterBase: new Map(),
  Game_Follower: new Map(),
  Game_Map: new Map(),
  Game_Player: new Map(),
  Spriteset_Map: new Map(),
};

/**
 * Directional constants matching RMMZ engine conventions.
 * Defined here so the pixel core does not depend on J-ABS for basic direction numerics.
 */
J.PIXEL.Directions = {
  DOWN: 2,
  LEFT: 4,
  RIGHT: 6,
  UP: 8,
  LOWERLEFT: 1,
  LOWERRIGHT: 3,
  UPPERLEFT: 7,
  UPPERRIGHT: 9,
};

/**
 * A small debug container for one-frame collision sampling traces.
 * Populated by the pixel passage helpers and consumed by Sprite_PixelCollisionOverlay.
 */
J.PIXEL.Debug = {
  /**
   * Controls whether subcell samples are collected.
   * Set to true only when the collision overlay is actively visible.
   * Leave false in production to avoid per-frame object allocations in the probe loops.
   * @type {boolean}
   */
  enabled: false,

  /**
   * @type {{x:number,y:number,color:string}[]}
   */
  samples: [],

  /**
   * Queues a subcell sample to be drawn this frame by the overlay.
   * @param {number} x Fractional tile x (seam-aligned).
   * @param {number} y Fractional tile y (seam-aligned).
   * @param {string} color A rgba color string.
   */
  push(x, y, color)
  {
    if (this.enabled === false) return;

    this.samples.push({ x, y, color });
  },

  /**
   * Clears all queued samples at the end of each frame.
   */
  clear()
  {
    this.samples.length = 0;
  },
};
//endregion metadata
//endregion initialization

//region PIXEL_CollisionManager
/**
 * A static manager that builds and serves a subcell collision table per map.
 * It derives all subcell data only from the engine's tile passability.
 * No external plugin references are used.
 */
class PIXEL_CollisionManager
{
  /**
   * Initializes configuration for collision table density and storage.
   * Reads the step count from J.PIXEL.Metadata if available, otherwise defaults to 4.
   */
  static initConfig()
  {
    // Read the step count from plugin metadata if already initialized.
    const metaCount = (J.PIXEL && J.PIXEL.Metadata)
      ? J.PIXEL.Metadata.CollisionStepCount
      : 4;

    // Define how many subcells per tile axis will be used (1, 2, or 4).
    this.collisionStepCount = metaCount;

    // Precompute the subcell size in tile units.
    this.collisionSize = 1 / this.collisionStepCount;

    // Initialize the subcell table storage.
    this._table = [];
  }

  /**
   * Builds the subcell collision table from the current map.
   * Call on map setup after the map is loaded.
   */
  static setupCollision()
  {
    // Ensure configuration exists before building.
    if (this.collisionStepCount === undefined)
    {
      // Initialize with defaults if not yet configured.
      this.initConfig();
    }

    // If the map or data does not exist, skip building.
    if (!$gameMap || !$dataMap)
    {
      // No data available to build a table.
      return;
    }

    // Compute the width of the subcell grid.
    const subW = $dataMap.width * this.collisionStepCount;

    // Compute the height of the subcell grid.
    const subH = $dataMap.height * this.collisionStepCount;

    // Allocate a new subcell collision table sized to the current map.
    this._table = new Array(subW * subH);

    // Load the default passability-derived collision into the subcell table.
    this._loadDefaultCollisionTable();
  }

  /**
   * Populates the subcell collision table using engine tile passability.
   */
  static _loadDefaultCollisionTable()
  {
    // Loop over all integer tiles vertically.
    for (let y = 0; y < $dataMap.height; y++)
    {
      // Loop over all integer tiles horizontally.
      for (let x = 0; x < $dataMap.width; x++)
      {
        // Check whether each adjacent tile can move INTO this tile.
        // A tile that cannot be entered from any direction (e.g. a deny-region tile)
        // must be treated as fully solid so that AABB overlap checks catch it.
        const canEnterFromBelow = $gameMap.isPassable(x, y + 1, J.PIXEL.Directions.UP);
        const canEnterFromAbove = $gameMap.isPassable(x, y - 1, J.PIXEL.Directions.DOWN);
        const canEnterFromLeft  = $gameMap.isPassable(x - 1, y, J.PIXEL.Directions.RIGHT);
        const canEnterFromRight = $gameMap.isPassable(x + 1, y, J.PIXEL.Directions.LEFT);

        const canBeEntered = canEnterFromBelow || canEnterFromAbove || canEnterFromLeft || canEnterFromRight;

        // If this tile is unreachable from every direction, mark it completely solid.
        if (canBeEntered === false)
        {
          this._fillTile(x, y, this.Codes.Solid);
          continue;
        }

        // Determine whether moving down is allowed from this tile.
        const passDown = $gameMap.isPassable(x, y, J.PIXEL.Directions.DOWN);

        // Determine whether moving left is allowed from this tile.
        const passLeft = $gameMap.isPassable(x, y, J.PIXEL.Directions.LEFT);

        // Determine whether moving right is allowed from this tile.
        const passRight = $gameMap.isPassable(x, y, J.PIXEL.Directions.RIGHT);

        // Determine whether moving up is allowed from this tile.
        const passUp = $gameMap.isPassable(x, y, J.PIXEL.Directions.UP);

        // Apply those passabilities to this tile's subcells.
        this._applyTileCollision(x, y, passDown, passLeft, passRight, passUp);
      }
    }
  }

  /**
   * Computes the flattened index into the subcell table for a fractional coordinate.
   * RAW indexer: no global shift applied here. Writers use this (build-time).
   * @param {number} px The fractional x (tile units).
   * @param {number} py The fractional y (tile units).
   * @returns {number} The subcell index.
   */
  static _index(px, py)
  {
    // Acquire the subcell density for this map.
    const step = this.collisionStepCount;

    // Acquire the full subcell dimensions.
    const widthInSub = $gameMap.width() * step;

    // Acquire the full subcell dimensions.
    const heightInSub = $gameMap.height() * step;

    // Convert the fractional tile coordinate into subcell integers (no shift).
    let ix = Math.floor(px * step);

    // Convert the fractional tile coordinate into subcell integers (no shift).
    let iy = Math.floor(py * step);

    // Wrap negative/overflow indices safely into the valid range.
    ix = ((ix % widthInSub) + widthInSub) % widthInSub;
    iy = ((iy % heightInSub) + heightInSub) % heightInSub;

    // Compute the flattened index from the wrapped subcell coordinates.
    return iy * widthInSub + ix;
  }

  /**
   * Writes a collision code into the table at a fractional coordinate.
   * @param {number} px The fractional x (tile units).
   * @param {number} py The fractional y (tile units).
   * @param {number} code The collision code to write.
   */
  static _set(px, py, code)
  {
    // Compute the index into the subcell table.
    const idx = this._index(px, py);

    // Set the code at that index.
    this._table[idx] = code;
  }

  /**
   * Fills an entire integer tile with a single collision code.
   * @param {number} x The integer tile x.
   * @param {number} y The integer tile y.
   * @param {number} code The collision code to fill with.
   */
  static _fillTile(x, y, code)
  {
    // Compute the subcell increment size.
    const step = this.collisionSize;

    // Iterate the tile's subcolumns.
    for (let subX = x; subX < x + 1; subX += step)
    {
      // Iterate the tile's subrows.
      for (let subY = y; subY < y + 1; subY += step)
      {
        // Assign the code for this subcell.
        this._set(subX, subY, code);
      }
    }
  }

  /**
   * Draws a one-subcell-thick edge line along a tile's boundary.
   * @param {number} x The tile x.
   * @param {number} y The tile y.
   * @param {2|4|6|8} d The boundary direction to draw along.
   * @param {number} code The collision code to write.
   */
  static _drawEdge(x, y, d, code)
  {
    // Capture the subcell size.
    const step = this.collisionSize;

    // If drawing a horizontal edge on top or bottom.
    if (d === J.PIXEL.Directions.DOWN || d === J.PIXEL.Directions.UP)
    {
      // Compute the subrow for bottom or top.
      const subY = (d === J.PIXEL.Directions.DOWN)
        ? (y + 1 - step)
        : y;

      // Iterate across all subcolumns along that row.
      for (let subX = x; subX < x + 1; subX += step)
      {
        // Assign the code for this subcell.
        this._set(subX, subY, code);
      }

      // Stop processing for horizontal edges.
      return;
    }

    // Compute the subcolumn for right or left.
    const subX = (d === J.PIXEL.Directions.RIGHT)
      ? (x + 1 - step)
      : x;

    // Iterate across all subrows along that column.
    for (let subY = y; subY < y + 1; subY += step)
    {
      // Assign the code for this subcell.
      this._set(subX, subY, code);
    }
  }

  /**
   * Places a single corner subcell blocker at the specified tile corner.
   * @param {number} x The tile x.
   * @param {number} y The tile y.
   * @param {4|6} horz The horizontal side (LEFT/RIGHT).
   * @param {2|8} vert The vertical side (DOWN/UP).
   * @param {number} code The collision code to write.
   */
  static _drawCorner(x, y, horz, vert, code)
  {
    // Capture the subcell size.
    const step = this.collisionSize;

    // Compute the subrow for top or bottom.
    const subY = (vert === J.PIXEL.Directions.DOWN)
      ? (y + 1 - step)
      : y;

    // Compute the subcolumn for left or right.
    const subX = (horz === J.PIXEL.Directions.RIGHT)
      ? (x + 1 - step)
      : x;

    // Assign the code for the corner subcell.
    this._set(subX, subY, code);
  }

  /**
   * Applies four direction passabilities to the tile's subcells using codes.
   * @param {number} x The tile x.
   * @param {number} y The tile y.
   * @param {boolean} passDown Whether moving DOWN is allowed from this tile.
   * @param {boolean} passLeft Whether moving LEFT is allowed from this tile.
   * @param {boolean} passRight Whether moving RIGHT is allowed from this tile.
   * @param {boolean} passUp Whether moving UP is allowed from this tile.
   */
  static _applyTileCollision(x, y, passDown, passLeft, passRight, passUp)
  {
    // If all directions are the same, the tile is uniformly open or solid.
    if (passDown === passLeft && passDown === passRight && passDown === passUp)
    {
      // Determine the uniform code for this tile.
      const code = (passDown === true)
        ? this.Codes.Open
        : this.Codes.Solid;

      // Fill the entire tile with that code.
      this._fillTile(x, y, code);

      // Stop processing for uniform tiles.
      return;
    }

    // If using one subcell per tile, merge to a single representative code.
    if (this.collisionStepCount === 1)
    {
      // Merge the edge-block flags into a single code.
      const merged = this._mergeSingleTile(!passUp, !passDown, !passLeft, !passRight);

      // Assign to this tile's single subcell.
      this._set(x, y, merged);

      // Stop processing for single-subcell tiles.
      return;
    }

    // Start by marking the tile as open everywhere.
    this._fillTile(x, y, this.Codes.Open);

    // If left is blocked, draw the left edge line.
    if (passLeft === false)
    {
      // Draw the left boundary as an edge blocker.
      this._drawEdge(x, y, J.PIXEL.Directions.LEFT, this.Codes.EdgeLeft);
    }

    // If right is blocked, draw the right edge line.
    if (passRight === false)
    {
      // Draw the right boundary as an edge blocker.
      this._drawEdge(x, y, J.PIXEL.Directions.RIGHT, this.Codes.EdgeRight);
    }

    // If down is blocked, draw bottom edge and corners as needed.
    if (passDown === false)
    {
      // Draw the bottom boundary as an edge blocker.
      this._drawEdge(x, y, J.PIXEL.Directions.DOWN, this.Codes.EdgeDown);

      // If left is also blocked, draw the bottom-left corner.
      if (passLeft === false)
      {
        // Place a single blocked subcell in the bottom-left corner.
        this._drawCorner(x, y, J.PIXEL.Directions.LEFT, J.PIXEL.Directions.DOWN, this.Codes.CornerBottomLeft);
      }

      // If right is also blocked, draw the bottom-right corner.
      if (passRight === false)
      {
        // Place a single blocked subcell in the bottom-right corner.
        this._drawCorner(x, y, J.PIXEL.Directions.RIGHT, J.PIXEL.Directions.DOWN, this.Codes.CornerBottomRight);
      }
    }

    // If up is blocked, draw top edge and corners as needed.
    if (passUp === false)
    {
      // Draw the top boundary as an edge blocker.
      this._drawEdge(x, y, J.PIXEL.Directions.UP, this.Codes.EdgeUp);

      // If left is also blocked, draw the top-left corner.
      if (passLeft === false)
      {
        // Place a single blocked subcell in the top-left corner.
        this._drawCorner(x, y, J.PIXEL.Directions.LEFT, J.PIXEL.Directions.UP, this.Codes.CornerTopLeft);
      }

      // If right is also blocked, draw the top-right corner.
      if (passRight === false)
      {
        // Place a single blocked subcell in the top-right corner.
        this._drawCorner(x, y, J.PIXEL.Directions.RIGHT, J.PIXEL.Directions.UP, this.Codes.CornerTopRight);
      }
    }
  }

  /**
   * Merges directional edge blocks into a single code when only one subcell is used.
   * @param {boolean} blockUp Whether the up edge is blocked.
   * @param {boolean} blockDown Whether the down edge is blocked.
   * @param {boolean} blockLeft Whether the left edge is blocked.
   * @param {boolean} blockRight Whether the right edge is blocked.
   * @returns {number} The representative collision code.
   */
  // eslint-disable-next-line complexity
  static _mergeSingleTile(blockUp, blockDown, blockLeft, blockRight)
  {
    // TODO: reduce complexity via UDLR bitmask -> code lookup table.
    // If all edges are blocked, the tile is fully solid.
    if (blockUp && blockDown && blockLeft && blockRight)
    {
      // Return the solid code.
      return this.Codes.Solid;
    }

    // If vertical edges are blocked but horizontal are open, return a vertical line.
    if (blockUp && blockDown && !blockLeft && !blockRight)
    {
      // Return the vertical line code.
      return this.Codes.VerticalLine;
    }

    // If horizontal edges are blocked but vertical are open, return a horizontal line.
    if (blockLeft && blockRight && !blockUp && !blockDown)
    {
      // Return the horizontal line code.
      return this.Codes.HorizontalLine;
    }

    // If only the up edge is blocked, encode a top edge.
    if (blockUp && !blockDown && !blockLeft && !blockRight)
    {
      // Return the top edge code.
      return this.Codes.EdgeUp;
    }

    // If only the down edge is blocked, encode a bottom edge.
    if (blockDown && !blockUp && !blockLeft && !blockRight)
    {
      // Return the bottom edge code.
      return this.Codes.EdgeDown;
    }

    // If only the left edge is blocked, encode a left edge.
    if (blockLeft && !blockRight && !blockUp && !blockDown)
    {
      // Return the left edge code.
      return this.Codes.EdgeLeft;
    }

    // If only the right edge is blocked, encode a right edge.
    if (blockRight && !blockLeft && !blockUp && !blockDown)
    {
      // Return the right edge code.
      return this.Codes.EdgeRight;
    }

    // If up and left are blocked, encode a top-left corner.
    if (blockUp && blockLeft && !blockRight && !blockDown)
    {
      // Return the top-left corner code.
      return this.Codes.CornerTopLeft;
    }

    // If up and right are blocked, encode a top-right corner.
    if (blockUp && blockRight && !blockLeft && !blockDown)
    {
      // Return the top-right corner code.
      return this.Codes.CornerTopRight;
    }

    // If down and left are blocked, encode a bottom-left corner.
    if (blockDown && blockLeft && !blockRight && !blockUp)
    {
      // Return the bottom-left corner code.
      return this.Codes.CornerBottomLeft;
    }

    // If down and right are blocked, encode a bottom-right corner.
    if (blockDown && blockRight && !blockLeft && !blockUp)
    {
      // Return the bottom-right corner code.
      return this.Codes.CornerBottomRight;
    }

    // Default to open when no specific merge rule applies.
    return this.Codes.Open;
  }

  /**
   * Determines if a fractional subcell allows movement in a given direction.
   * Applies the global half-tile grid shift on READS to align with visual seams.
   * @param {number} px The fractional x (tile units).
   * @param {number} py The fractional y (tile units).
   * @param {2|4|6|8} d The entering direction.
   * @returns {boolean} True if passable, false otherwise.
   */
  // eslint-disable-next-line complexity
  static isPositionPassable(px, py, d)
  {
    // TODO: reduce complexity via code->predicate table (and shared direction helpers).
    // Apply the global lattice shift only for reads.
    const sx = px + this.GridShiftX;
    const sy = py + this.GridShiftY;

    // Compute integer tile coordinates for bounds check in the shifted frame.
    const tx = Math.floor(sx);

    // Compute integer tile coordinates for bounds check in the shifted frame.
    const ty = Math.floor(sy);

    // If off-map, always block.
    if (tx < 0 || ty < 0 || tx >= $gameMap.width() || ty >= $gameMap.height())
    {
      // Outside the map bounds is impassable.
      return false;
    }

    // Acquire the stored code for this subcell (default to open if empty).
    const code = this._table[this._index(sx, sy)] || this.Codes.Open;

    // Open: always passable.
    if (code === this.Codes.Open)
    {
      // Passable subcell.
      return true;
    }

    // Solid: always blocked.
    if (code === this.Codes.Solid)
    {
      // Impassable subcell.
      return false;
    }

    // Vertical line blocks vertical motion (UP/DOWN), allows horizontal.
    if (code === this.Codes.VerticalLine)
    {
      // If moving vertically, then blocked.
      if (d === J.PIXEL.Directions.UP || d === J.PIXEL.Directions.DOWN)
      {
        // Vertical movement collides with vertical blocker.
        return false;
      }

      // Horizontal movement is allowed across the line.
      return true;
    }

    // Horizontal line blocks horizontal motion (LEFT/RIGHT), allows vertical.
    if (code === this.Codes.HorizontalLine)
    {
      // If moving horizontally, then blocked.
      if (d === J.PIXEL.Directions.LEFT || d === J.PIXEL.Directions.RIGHT)
      {
        // Horizontal movement collides with horizontal blocker.
        return false;
      }

      // Vertical movement is allowed across the line.
      return true;
    }

    // One-way edge blockers.
    if (code === this.Codes.EdgeLeft)
    {
      // Block entering from the LEFT.
      return d !== J.PIXEL.Directions.LEFT;
    }
    if (code === this.Codes.EdgeRight)
    {
      // Block entering from the RIGHT.
      return d !== J.PIXEL.Directions.RIGHT;
    }
    if (code === this.Codes.EdgeDown)
    {
      // Block entering from DOWN.
      return d !== J.PIXEL.Directions.DOWN;
    }
    if (code === this.Codes.EdgeUp)
    {
      // Block entering from UP.
      return d !== J.PIXEL.Directions.UP;
    }

    // Corner single-blockers: treat as fully blocked regardless of approach direction.
    if (
      code === this.Codes.CornerBottomLeft
      || code === this.Codes.CornerBottomRight
      || code === this.Codes.CornerTopLeft
      || code === this.Codes.CornerTopRight
    )
    {
      // Corners are fully blocked at that subcell.
      return false;
    }

    // Unknown code: default to passable to avoid over-blocking.
    return true;
  }
}

/**
 * Attach an enumeration of collision codes to the manager class.
 * These codes represent the logical shape located at a given subcell.
 */
PIXEL_CollisionManager.Codes =
  {
    // A fully open subcell; movement allowed from any direction.
    Open: 1,

    // A fully solid subcell; movement blocked from any direction.
    Solid: 2,

    // A vertical blocking line through the subcell; blocks Up/Down.
    VerticalLine: 4,

    // A horizontal blocking line through the subcell; blocks Left/Right.
    HorizontalLine: 5,

    // A left edge blocker at the leftmost subcolumn of a tile; blocks entering from the LEFT.
    EdgeLeft: 14,

    // A right edge blocker at the rightmost subcolumn of a tile; blocks entering from the RIGHT.
    EdgeRight: 16,

    // A bottom edge blocker at the bottom subrow of a tile; blocks entering from DOWN.
    EdgeDown: 12,

    // A top edge blocker at the top subrow of a tile; blocks entering from UP.
    EdgeUp: 18,

    // A bottom-left corner blocker; a single blocked subcell in that corner.
    CornerBottomLeft: 11,

    // A bottom-right corner blocker; a single blocked subcell in that corner.
    CornerBottomRight: 13,

    // A top-left corner blocker; a single blocked subcell in that corner.
    CornerTopLeft: 17,

    // A top-right corner blocker; a single blocked subcell in that corner.
    CornerTopRight: 19,
  };

/**
 * Global collision-lattice shift (in tiles) applied on the X axis inside the indexer.
 * Use +0.5 when character/world coords are edge-based but movement logic expects center alignment.
 * Flip to -0.5 if your incoming sample coords are already center-shifted elsewhere.
 * @type {number}
 */
PIXEL_CollisionManager.GridShiftX = 0;

/**
 * Global collision-lattice shift (in tiles) applied on the Y axis inside the indexer.
 * See GridShiftX for guidance on selecting the sign.
 * @type {number}
 */
PIXEL_CollisionManager.GridShiftY = 0;
//endregion PIXEL_CollisionManager

//region Game_Character
/**
 * The set of move route command codes that should be repeated per subcell when in pixel mode.
 * These correspond to the "Move X" commands in RPG Maker's event move route.
 * @type {number[]}
 */
Game_Character.pixelRepeatableMoveCommandCodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];

/**
 * Extends {@link processMoveCommand}.<br>
 * Ensures when move routes are being processed, that we adjust the x,y coordinates.
 * @param {RPG_EventListCommand} command The commands associated with this movement.
 */
J.PIXEL.Aliased.Game_Character.set('processMoveCommand', Game_Character.prototype.processMoveCommand);
Game_Character.prototype.processMoveCommand = function(command)
{
  // move route commands are never triggered by held player input.
  this.setMovePressed(false);

  // perform the original logic.
  J.PIXEL.Aliased.Game_Character.get('processMoveCommand')
    .call(this, command);
};

/**
 * Overwrites {@link #searchLimit}.<br/>
 * Uses a different value to have a broader search distance.
 * @returns {number}
 */
Game_Character.prototype.searchLimit = function()
{
  return 40;
};

/**
 * Extends {@link #updateRoutineMove}.<br/>
 * Repeats move-route movement commands by the collision step count so that
 * scripted movement (event pages, move routes) covers the intended full-tile distance.
 * JABS actions are excluded and use default logic unchanged.
 */
J.PIXEL.Aliased.Game_Character.set('updateRoutineMove', Game_Character.prototype.updateRoutineMove);
Game_Character.prototype.updateRoutineMove = function()
{
  // JABS actions are not events with move routes; use default behavior for them.
  if (J.ABS && this.isJabsAction())
  {
    // perform original logic for action entities.
    J.PIXEL.Aliased.Game_Character.get('updateRoutineMove')
      .call(this);

    // stop processing.
    return;
  }

  // perform the pixel-aware route movement update.
  this.handlePixelRoutineMove();
};

/**
 * Handles updating event move routes with pixel-aware repetition.
 * Repeats each movement command by the collision step count before advancing
 * to the next command in the route, so scripted movement covers the full tile.
 */
Game_Character.prototype.handlePixelRoutineMove = function()
{
  // check if we are waiting in the move route.
  if (this._waitCount > 0)
  {
    // decrement wait count and stop processing.
    this._waitCount--;

    // stop processing while waiting.
    return;
  }

  // movement is always considered successful under a commanded route.
  this.setMovementSuccess(true);

  // extract the current move route command.
  const command = this._moveRoute.list[this._moveRouteIndex];

  // nothing to do if no command is present at this index.
  if (command === undefined) return;

  // start a fresh repeat cycle if this command supports repetition.
  if (this.canStartPixelRepeatMove(command))
  {
    // begin the repeat cycle.
    this.beginRepeatMove();

    // initialize the repeat counter.
    this.setRepeatMoveCount(this.pixelRepeatCountForRoute());
  }

  // process the move command.
  this.processMoveCommand(command);

  // decrement the repeat count if a repeat is active.
  if (this.isRepeatMoveActive())
  {
    // count down one tick.
    this.decrementRepeatMoveCount();

    // if the repeat counter reached zero, end the repeat cycle.
    if (this.getRepeatMoveCount() === 0)
    {
      // stop repeating this command.
      this.stopRepeatMove();
    }
  }

  // advance to the next command only when the repeat cycle has ended.
  if (this.isRepeatMoveActive() === false)
  {
    // move to the next command in the route.
    this.advanceMoveRouteIndex();
  }
};

/**
 * Determines whether a repeat cycle should be started for the given command.
 * @param {RPG_EventListCommand} command The current move route command.
 * @returns {boolean} True if a new repeat cycle should begin.
 */
Game_Character.prototype.canStartPixelRepeatMove = function(command)
{
  // do not start a new repeat if one is already active.
  if (this.isRepeatMoveActive()) return false;

  // only repeat commands that are movement codes.
  if (Game_Character.pixelRepeatableMoveCommandCodes.includes(command.code) === false) return false;

  // all checks passed; start repeating.
  return true;
};
//endregion Game_Character

//region Game_CharacterBase
//region init
/**
 * Extends {@link Game_CharacterBase.initMembers}.<br>
 * Includes this plugin's extra properties as well.
 */
J.PIXEL.Aliased.Game_CharacterBase.set('initMembers', Game_CharacterBase.prototype.initMembers);
Game_CharacterBase.prototype.initMembers = function()
{
  // perform original logic.
  J.PIXEL.Aliased.Game_CharacterBase.get('initMembers')
    .call(this);

  // initialize the additional members.
  this.initPixelMovementMembers();
};

/**
 * Initializes the new members related to this plugin.
 * Uses ??= so that pre-existing values on a loaded save are never overwritten,
 * making this method safe to call defensively at any point.
 */
Game_CharacterBase.prototype.initPixelMovementMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * The pixel movement namespace, scoped under _j to avoid collisions
   * with properties introduced by other plugins.
   */
  this._j._pixel ||= {};

  /**
   * The collection for tracking the {@link Point} coordinates for all members.
   * This is managed in a first-in-first-out (FIFO) style.
   * @type {Point[]}
   */
  this._j._pixel._positionalRecords ??= [];

  /**
   * Whether or not one of the directional inputs are being held down.
   * @type {boolean} True if at least one direction is being held, false otherwise.
   */
  this._j._pixel._movePressing ??= false;

  /**
   * The move distance for tracking steps.
   * @type {number}
   */
  this._j._pixel._moveDistance ??= 0;

  /**
   * The number of steps this character has taken.
   * @type {number}
   */
  this._j._pixel._steps ??= 0;

  /**
   * Cooldown frames after a pixel move before another can be issued.
   * Prevents AllyAI from pushing every single frame.
   * @type {number}
   */
  this._j._pixel._moveCooldown ??= 0;

  /**
   * Whether a pixel-route repeat is currently active for this character.
   * Used to repeat a single move-route command multiple times to cover the intended distance.
   * @type {boolean}
   */
  this._j._pixel._repeatMoveActive ??= false;

  /**
   * How many remaining repeat-ticks are left for the current route command.
   * @type {number}
   */
  this._j._pixel._repeatMoveCount ??= 0;

  /**
   * Flag indicating whether a pixel step occurred this frame.
   * Used to preserve walk animation even when render coords snap each update.
   * @type {boolean}
   */
  this._j._pixel._movedThisFrame ??= false;

  /**
   * The cached direction for the micro-route (if any).
   * @type {number}
   */
  this._j._pixel._mrDir ??= 0;

  /**
   * The remaining frames to apply the cached micro-route direction.
   * @type {number}
   */
  this._j._pixel._mrFrames ??= 0;
};
//endregion init

/**
 * Returns the pixel movement state namespace for this character.
 * If the namespace is absent — for example when loading a save created before
 * this plugin was installed — it is initialized on demand so that no individual
 * getter or setter needs its own defensive guard.
 * @returns {object} The `this._j._pixel` state object.
 */
Game_CharacterBase.prototype._pixelState = function()
{
  if (!this._j || !this._j._pixel)
  {
    this.initPixelMovementMembers();
  }

  return this._j._pixel;
};

//region properties
/**
 * Gets the remaining cooldown frames before another pixel move can be issued.
 * @returns {number} The remaining cooldown frames.
 */
Game_CharacterBase.prototype.getPixelMoveCooldown = function()
{
  // Return the remaining cooldown frames for pixel movement.
  return this._pixelState()._moveCooldown;
};

/**
 * Sets the remaining cooldown frames for pixel movement.
 * @param {number} frames The number of frames to set for cooldown.
 */
Game_CharacterBase.prototype.setPixelMoveCooldown = function(frames)
{
  // Assign the new cooldown frame count for pixel movement.
  this._pixelState()._moveCooldown = frames;
};

/**
 * Gets whether or not a pixel-route command repeat is currently active.
 * @returns {boolean} True if a repeat is ongoing, false otherwise.
 */
Game_CharacterBase.prototype.isRepeatMoveActive = function()
{
  return this._pixelState()._repeatMoveActive === true;
};

/**
 * Begins a pixel-route command repeat cycle.
 */
Game_CharacterBase.prototype.beginRepeatMove = function()
{
  // activate the repeat flag.
  this._pixelState()._repeatMoveActive = true;
};

/**
 * Ends the current pixel-route command repeat cycle.
 */
Game_CharacterBase.prototype.stopRepeatMove = function()
{
  // deactivate the repeat flag.
  this._pixelState()._repeatMoveActive = false;
};

/**
 * Gets how many repeat-ticks remain for the current route command.
 * @returns {number} The remaining repeat count.
 */
Game_CharacterBase.prototype.getRepeatMoveCount = function()
{
  return this._pixelState()._repeatMoveCount;
};

/**
 * Sets the repeat-tick counter to a given number.
 * @param {number} count The number of ticks to hold the current command.
 */
Game_CharacterBase.prototype.setRepeatMoveCount = function(count)
{
  // assign the new repeat count.
  this._pixelState()._repeatMoveCount = count;
};

/**
 * Decrements the repeat-tick counter by one.
 */
Game_CharacterBase.prototype.decrementRepeatMoveCount = function()
{
  // only decrement if there is a remaining count.
  if (this.getRepeatMoveCount() > 0)
  {
    // reduce by one tick.
    this.setRepeatMoveCount(this.getRepeatMoveCount() - 1);
  }
};

/**
 * Gets the default repeat count for a single route command based on collision density.
 * This ensures that scripted movement commands cover the full intended tile distance.
 * @returns {number} The collision step count.
 */
Game_CharacterBase.prototype.pixelRepeatCountForRoute = function()
{
  // repeat enough frames to cover exactly one full tile at this character's speed.
  return Math.ceil(1.0 / this.distancePerFrame());
};

/**
 * Decrements the pixel-move cooldown by one frame if applicable.
 */
Game_CharacterBase.prototype.decrementPixelMoveCooldown = function()
{
  // Only decrement if we actually have a cooldown remaining.
  if (this.getPixelMoveCooldown() > 0)
  {
    // Reduce the cooldown by a single frame.
    this.setPixelMoveCooldown(this.getPixelMoveCooldown() - 1);
  }
};

/**
 * Determines whether or not we are currently on a cooldown for pixel movement.
 * @returns {boolean}
 */
Game_CharacterBase.prototype.isPixelOnCooldown = function()
{
  // if we have any current cooldown value, we are on cooldown.
  return this.getPixelMoveCooldown() > 0;
};

/**
 * Flags whether or not this character performed a pixel step this frame.
 * @param {boolean=} moved Whether or not we moved this frame; defaults to true.
 */
Game_CharacterBase.prototype.setMovedThisFrame = function(moved = true)
{
  // Flag whether or not we moved this frame.
  this._pixelState()._movedThisFrame = moved;
};

/**
 * Gets whether or not this character performed a pixel step this frame.
 * @returns {boolean} True if we moved this frame, false otherwise.
 */
Game_CharacterBase.prototype.didMoveThisFrame = function()
{
  // Return whether or not we moved this frame.
  return this._pixelState()._movedThisFrame === true;
};

/**
 * Clears the per-frame pixel movement flag.
 */
Game_CharacterBase.prototype.clearMovedThisFrame = function()
{
  // Reset the frame-based movement flag.
  this._pixelState()._movedThisFrame = false;
};

/**
 * Gets the cached micro-route direction.
 * @returns {number} The cached 8-dir code, or 0 if unset.
 */
Game_CharacterBase.prototype.getMicroRouteDirection = function()
{
  // Return the cached micro-route direction.
  return this._pixelState()._mrDir;
};

/**
 * Sets the cached micro-route direction.
 * @param {number} newDirection The 8-dir code to cache.
 */
Game_CharacterBase.prototype.setMicroRouteDirection = function(newDirection)
{
  // Assign the new cached micro-route direction.
  this._pixelState()._mrDir = newDirection;
};

/**
 * Gets the remaining micro-route frames.
 * @returns {number} The remaining frames for the cached direction.
 */
Game_CharacterBase.prototype.getMicroRouteFrames = function()
{
  // Return how many frames remain for the cached micro-route.
  return this._pixelState()._mrFrames;
};

/**
 * Sets the remaining micro-route frames to apply the cached direction.
 * @param {number} frames The number of frames to hold the cached direction.
 */
Game_CharacterBase.prototype.setMicroRouteFrames = function(frames)
{
  // Assign the remaining frames to apply the cached micro-route.
  this._pixelState()._mrFrames = frames;
};

/**
 * Decrements the remaining micro-route frames by one if applicable.
 */
Game_CharacterBase.prototype.decrementMicroRouteFrames = function()
{
  // Only decrement if there are frames remaining.
  if (this.getMicroRouteFrames() > 0)
  {
    // Reduce the frames by one.
    this.setMicroRouteFrames(this.getMicroRouteFrames() - 1);
  }
};

/**
 * Clears the cached micro-route direction and remaining frames.
 */
Game_CharacterBase.prototype.clearMicroRoute = function()
{
  // Reset the cached direction to none.
  this.setMicroRouteDirection(0);

  // Reset the remaining frames to zero.
  this.setMicroRouteFrames(0);
};

/**
 * Gets whether or not this character is currently following a cached micro-route.
 * @returns {boolean} True if there are frames remaining, false otherwise.
 */
Game_CharacterBase.prototype.isMicroRouting = function()
{
  // Determine if we are still following a micro-route.
  return this.getMicroRouteFrames() > 0;
};

/**
 * Gets the collection of positional records for this character.
 * @returns {Point[]}
 */
Game_CharacterBase.prototype.positionalRecords = function()
{
  return this._pixelState()._positionalRecords;
};

/**
 * Clears the positional cache for characters on the map.
 */
Game_CharacterBase.prototype.clearPositionalRecords = function()
{
  this._pixelState()._positionalRecords = [];
};

/**
 * Adds a positional record to the collection and maintains the max collection size.
 * @param {Point} positionalRecord A single positional record as a point.
 */
Game_CharacterBase.prototype.addPositionalRecord = function(positionalRecord)
{
  // grab the records.
  const records = this.positionalRecords();

  // add the new record to the collection.
  records.push(positionalRecord);

  // only keep the top ten tracking records for positioning.
  while (records.length > 10)
  {
    records.shift();
  }
};

/**
 * Gets the first-added record from the collection of coordinate tracking.
 * @returns {Point}
 */
Game_CharacterBase.prototype.oldestPositionalRecord = function()
{
  // grab the records.
  const records = this.positionalRecords();

  // make sure we have records.
  if (records.length > 0)
  {
    // return the first record, aka the first one added in there.
    return records.at(0);
  }

  // there are no records to retrieve.
  return null;
};

/**
 * Gets the last-added record from the collection of coordinate tracking.
 * @returns {Point}
 */
Game_CharacterBase.prototype.mostRecentPositionalRecord = function()
{
  // grab the records.
  const records = this.positionalRecords();

  // make sure we have records.
  if (records.length > 0)
  {
    // return the last record, aka the most recent one added in there.
    return records.at(-1);
  }

  // there are no records to retrieve.
  return null;
};
//endregion properties

/**
 * Extends {@link Game_CharacterBase.update}.<br>
 * Ensures render coordinates match logical coordinates and clears per-frame flags.
 */
J.PIXEL.Aliased.Game_CharacterBase.set("update", Game_CharacterBase.prototype.update);
Game_CharacterBase.prototype.update = function()
{
  // Perform original logic.
  J.PIXEL.Aliased.Game_CharacterBase.get("update")
    .call(this);

  // Always synchronize render/smoothing coordinates to the logical coordinates.
  if (this._realX !== this._x || this._realY !== this._y)
  {
    // Snap the render coordinates to the logical coordinates.
    this._realX = this._x;
    this._realY = this._y;
  }

  // Tick down the pixel-move cooldown, if any.
  if (this.isPixelOnCooldown())
  {
    // Reduce the cooldown by one frame.
    this.decrementPixelMoveCooldown();
  }

  // Clear the "moved this frame" flag after all engine logic has run.
  if (this.didMoveThisFrame())
  {
    // Reset the frame-based movement flag.
    this.clearMovedThisFrame();
  }
};

/**
 * Gets the move distance this character has moved.
 * @returns {number}
 */
Game_CharacterBase.prototype.moveDistance = function()
{
  return this._pixelState()._moveDistance;
};

/**
 * Modifies the move distance by a given amount.
 * @param {number} distance The distance in pixels.
 */
Game_CharacterBase.prototype.modMoveDistance = function(distance)
{
  // modify the move distance by the given amount.
  this._pixelState()._moveDistance += distance;
};

/**
 * Gets how many pixel steps this character has taken.
 * @returns {number}
 */
Game_CharacterBase.prototype.pixelSteps = function()
{
  return this._pixelState()._steps;
};

/**
 * Modifies the pixel step counter.
 * @param {number=} steps The number of steps to take; defaults to 1.
 */
Game_CharacterBase.prototype.takePixelSteps = function(steps = 1)
{
  this._pixelState()._steps += steps;
};

/**
 * Clears the number of pixel steps taken by this character.
 */
Game_CharacterBase.prototype.clearPixelSteps = function()
{
  this._pixelState()._steps = 0;
};

/**
 * Checks if this character has moved far enough to be considered a "step".
 */
Game_CharacterBase.prototype.updatePixelStepping = function()
{
  // determine if we have crossed the threshold for moving one step.
  const tookStep = this.moveDistance() >= this.stepDistance();

  // check if we took a step.
  if (tookStep)
  {
    // take a step.
    this.onStep();

    // reset the move distance.
    this.clearMoveDistance();
  }
};

/**
 * Resets the move distance for this character.
 */
Game_CharacterBase.prototype.clearMoveDistance = function()
{
  this._pixelState()._moveDistance = 0;
};

/**
 * Extends {@link Game_CharacterBase.isMoving}.<br/>
 * Includes whether or not a pixel movement occurred this frame.
 * @returns {boolean}
 */
J.PIXEL.Aliased.Game_CharacterBase.set("isMoving", Game_CharacterBase.prototype.isMoving);
Game_CharacterBase.prototype.isMoving = function()
{
  // Determine movement per the original engine behavior.
  const original = J.PIXEL.Aliased.Game_CharacterBase.get("isMoving")
    .call(this);

  // Include pixel-step movement that occurred this frame.
  const movedThisFrame = this.didMoveThisFrame();

  // Return whether we are moving per engine or because of a pixel step.
  return original || movedThisFrame;
};

/**
 * Gets whether or not the move input is being pressed.
 * @returns {boolean}
 */
Game_CharacterBase.prototype.isMovePressed = function()
{
  return this._pixelState()._movePressing;
};

/**
 * Sets whether or not the move input is being held down.
 * @param {boolean} pressed The new value of whether or not the button is being pressed.
 */
Game_CharacterBase.prototype.setMovePressed = function(pressed)
{
  this._pixelState()._movePressing = pressed;
};

/**
 * Adds a hook for performing actions when this character takes a step.
 */
Game_CharacterBase.prototype.onStep = function()
{
  this.takePixelSteps(1);
};

/**
 * Gets the distance that it takes to travel to achieve one step.
 * @returns {number}
 */
Game_CharacterBase.prototype.stepDistance = function()
{
  // Consider one full tile of travel as a single step for step-based effects.
  return 1.0;
};

/**
 * Records this character's current fractional position into the breadcrumb trail.
 * Keeps a rolling window of the last 10 positions for follower-train chasing.
 * Flushes the cache when the player teleports (delta > 2 tiles).
 */
Game_CharacterBase.prototype.recordPixelPosition = function()
{
  // grab the most recently added point from the collection.
  const last = this.mostRecentPositionalRecord();

  // compute distance from the last recorded point to the current position.
  const deltaDistance = (last === null)
    ? 0
    : $gameMap.distance(last.x, last.y, this.x, this.y);

  // check if the character teleported; if so, flush the stale cache.
  if (deltaDistance > 2)
  {
    // clear the cache.
    this.clearPositionalRecords();
  }
  // check if we are missing any records, or have moved enough to warrant a new one.
  else if (last === null || deltaDistance > 0.1)
  {
    // record the current fractional position.
    const point = { x: this.x, y: this.y };

    // add the point to the tracking.
    this.addPositionalRecord(point);
  }
};

/**
 * Forcefully relocates this character to a different set of coordinates.
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 */
Game_CharacterBase.prototype.relocate = function(x, y)
{
  // Update the logical coordinates of this character.
  this._x = x;
  this._y = y;

  // Synchronize the render/smoothing coordinates to prevent post-teleport sliding.
  this._realX = x;
  this._realY = y;

  // Reset the stop counter so the engine considers us stationary immediately.
  this._stopCount = 0;
};

/**
 * Enables the "pixel moving" state and updates pixel position.
 */
Game_CharacterBase.prototype.startPixelMoving = function()
{
  // this character is moving.
  this.setMovePressed(true);

  // update the position for this character.
  this.recordPixelPosition();
};

/**
 * Disables the "pixel moving" state and updates pixel position.
 */
Game_CharacterBase.prototype.stopPixelMoving = function()
{
  // this character isn't moving.
  this.setMovePressed(false);

  // Synchronize the render/smoothing coordinates to the logical position.
  // This prevents any residual tween drift once we intentionally stop.
  this._realX = this._x;
  this._realY = this._y;

  // update the position for this character.
  this.recordPixelPosition();
};

/**
 * Determine the distance per frame when moving diagonally.
 * It is reduced thanks to the power of math.
 * @returns {number} The distance in pixels to move.
 */
Game_CharacterBase.prototype.diagonalDistancePerFrame = function()
{
  return this.distancePerFrame() * Math.SQRT1_2;
};

/**
 * Moves this character in the given direction a given distance in pixels.
 *
 * This is used in tandem with movement control and not intended to move characters otherwise.
 * @param {1|2|3|4|6|7|8|9} direction The direction to move.
 * @param {number} distance The number of pixels to move.
 */
Game_CharacterBase.prototype.movePixelDistance = function(direction, distance)
{
  // Cache previous logical coordinates before applying movement.
  const prevX = this._x;
  const prevY = this._y;

  // Determine whether the direction is straight or diagonal.
  const isStraight = this.isStraightDirection(direction);
  const isDiagonal = this.isDiagonalDirection(direction);

  // If straight, then move straight.
  if (isStraight)
  {
    // Move straight by the given distance.
    this.moveStraightDistance(direction, distance);
  }
  // If diagonal, then move diagonally.
  else if (isDiagonal)
  {
    // Move diagonally by the given distance.
    this.moveDiagonalDistance(direction, distance);
  }

  // Acquire the collision radius in tile units for AABB evaluation.
  const radius = this.getEffectiveRadius();

  // If we ended up overlapping solid tiles after this step, revert the move.
  // Through or playtest debug-through bypass this check entirely.
  if (this.isThrough() === false && this.isDebugThrough() === false && this.isOverlappingSolidTiles(
    this._x + this.getCollisionPivotX(),
    this._y + this.getCollisionPivotY(),
    radius))
  {
    // Restore the previous logical position.
    this._x = prevX;
    this._y = prevY;

    // Synchronize the display coordinates with the restored logical position.
    this._realX = this._x;
    this._realY = this._y;

    // Mark this movement as unsuccessful so upstream callers don’t keep pushing.
    this.setMovementSuccess(false);

    // Do not proceed with step bookkeeping after a failed move.
    return;
  }

  // Indicate we moved this frame to preserve walk animation.
  this.setMovedThisFrame(true);

  // Synchronize the display coordinates with the logical position to avoid engine tween drift.
  this._realX = this._x;
  this._realY = this._y;

  // Also modify the move distance by how far we've moved.
  this.modMoveDistance(distance);

  // Updates the pixel step counter if applicable.
  this.updatePixelStepping();
};

/**
 * Moves this character one of the four cardinal directions a given distance in pixels.
 * @param {2|4|6|8} direction The straight direction to move.
 * @param {number} pixelDistance The number of pixels to move in that direction.
 */
Game_CharacterBase.prototype.moveStraightDistance = function(direction, pixelDistance)
{
  switch (direction)
  {
    case J.PIXEL.Directions.DOWN:
      this.moveStraight2Down(pixelDistance);
      break;
    case J.PIXEL.Directions.LEFT:
      this.moveStraight4Left(pixelDistance);
      break;
    case J.PIXEL.Directions.RIGHT:
      this.moveStraight6Right(pixelDistance);
      break;
    case J.PIXEL.Directions.UP:
      this.moveStraight8Up(pixelDistance);
      break;
    default:
      console.warn("attempted to move an invalid straight direction: ", direction);
      break;
  }
};

/**
 * Moves this character one one of the four cardinal directions.
 * @param {1|3|7|9} direction The straight direction to move.
 * @param {number} pixelDistance The number of pixels to move in that direction.
 */
Game_CharacterBase.prototype.moveDiagonalDistance = function(direction, pixelDistance)
{
  switch (direction)
  {
    case J.PIXEL.Directions.LOWERLEFT:
      this.moveDiagonal1DownLeft(pixelDistance);
      break;
    case J.PIXEL.Directions.LOWERRIGHT:
      this.moveDiagonal3DownRight(pixelDistance);
      break;
    case J.PIXEL.Directions.UPPERLEFT:
      this.moveDiagonal7UpLeft(pixelDistance);
      break;
    case J.PIXEL.Directions.UPPERRIGHT:
      this.moveDiagonal9UpRight(pixelDistance);
      break;
    default:
      console.warn("attempted to move an invalid diagonal direction: ", direction);
      break;
  }
};

/**
 * Move straight down the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveStraight2Down = function(pixelDistance)
{
  this._y += pixelDistance;
};

/**
 * Move straight left the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveStraight4Left = function(pixelDistance)
{
  this._x -= pixelDistance;
};

/**
 * Move straight right the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveStraight6Right = function(pixelDistance)
{
  this._x += pixelDistance;
};

/**
 * Move straight up the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveStraight8Up = function(pixelDistance)
{
  this._y -= pixelDistance;
};

/**
 * Move diagonally down-left the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveDiagonal1DownLeft = function(pixelDistance)
{
  this._x -= pixelDistance;
  this._y += pixelDistance;
};

/**
 * Move diagonally down-right the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveDiagonal3DownRight = function(pixelDistance)
{
  this._x += pixelDistance;
  this._y += pixelDistance;
};

/**
 * Move diagonally up-left the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveDiagonal7UpLeft = function(pixelDistance)
{
  this._x -= pixelDistance;
  this._y -= pixelDistance;
};

/**
 * Move diagonally up-right the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveDiagonal9UpRight = function(pixelDistance)
{
  this._x += pixelDistance;
  this._y -= pixelDistance;
};

/**
 * Determines whether or not this character can pass in the given straight direction.
 * Substeps the probe at collision subgrid resolution to avoid skipping edges, then
 * uses your edge-subgrid checks per substep. Character AABB collisions are checked
 * only at the final landing point.
 *
 * @param {2|4|6|8} direction The cardinal direction being moved.
 * @param {number} distance The distance to move (in tiles, fractional).
 * @returns {boolean} True if movement is permitted this frame, false otherwise.
 */
// eslint-disable-next-line complexity
Game_CharacterBase.prototype.canPassStraight = function(direction, distance = this.distancePerFrame())
{
  // TODO: reduce complexity (collision kernel); extract pure helpers without changing semantics.
  // Acquire the current fractional center.
  const x0 = this._x;

  // Acquire the current fractional center.
  const y0 = this._y;

  // Approve immediately if we are pass-through (debug or through).
  if (this.isThrough() || this.isDebugThrough())
  {
    // Always allow movement when through.
    return true;
  }

  // Determine the collision subgrid resolution; avoid skipping edges at high speeds.
  const subCount = this._pixelCollisionSubCount();

  // Update cached radius-based hitbox.
  const radius = this.getEffectiveRadius();

  // Compute hitbox metrics relative to center.
  const hitbox = this._pixelHitbox(radius);

  // Compute the subcell size for substepping.
  const subStepSize = 1 / subCount;

  // Determine the signed unit direction components.
  let dx = 0;
  let dy = 0;
  if (direction === J.PIXEL.Directions.RIGHT)
  {
    // Moving to the right.
    dx = 1;
  }
  else if (direction === J.PIXEL.Directions.LEFT)
  {
    // Moving to the left.
    dx = -1;
  }
  else if (direction === J.PIXEL.Directions.DOWN)
  {
    // Moving downward.
    dy = 1;
  }
  else if (direction === J.PIXEL.Directions.UP)
  {
    // Moving upward.
    dy = -1;
  }
  else
  {
    // Unsupported direction; reject.
    return false;
  }

  // Compute the maximum substep size that won’t skip a subcell edge.
  const maxStep = subStepSize;

  // Compute how many substeps are required for this distance (at least one).
  const steps = Math.max(1, Math.ceil(distance / maxStep));

  // Compute the per-substep distance.
  const stepSize = distance / steps;

  // Initialize the rolling probe position.
  let probeX = x0;
  let probeY = y0;

  // Process each substep sequentially.
  for (let i = 0; i < steps; i++)
  {
    // Compute the proposed landing center for this substep.
    const x1 = probeX + dx * stepSize;

    // Compute the proposed landing center for this substep.
    const y1 = probeY + dy * stepSize;

    // Horizontal movement edge checks.
    if (dx !== 0)
    {
      // If moving left, validate left edge; if moving right, validate right edge.
      if (dx < 0)
      {
        // Validate origin out-direction on the current left edge columns.
        if (this._pixelCheckLeftPassage(probeX, probeY, x1, hitbox, subCount) === false) return false;

        // Validate destination in-direction on the new left edge columns.
        if (this._pixelCheckRightPassage(x1, probeY, probeX, hitbox, subCount) === false) return false;

        // Validate vertical lanes at the new entered LEFT column.
        if (this._pixelCheckVerticalAtNewXColumn(probeX, x1, probeY, hitbox, subCount) === false) return false;
      }
      else
      {
        // Validate origin out-direction on the current right edge columns.
        if (this._pixelCheckRightPassage(probeX, probeY, x1, hitbox, subCount) === false) return false;

        // Validate destination in-direction on the new right edge columns.
        if (this._pixelCheckLeftPassage(x1, probeY, probeX, hitbox, subCount) === false) return false;

        // Validate vertical lanes at the new entered RIGHT column.
        if (this._pixelCheckVerticalAtNewXColumn(probeX, x1, probeY, hitbox, subCount) === false) return false;
      }
    }

    // Vertical movement edge checks.
    if (dy !== 0)
    {
      // If moving up, validate top edge; if moving down, validate bottom edge.
      if (dy < 0)
      {
        // Validate origin out-direction on the current top edge rows.
        if (this._pixelCheckUpPassage(probeX, probeY, y1, hitbox, subCount) === false) return false;

        // Validate destination in-direction on the new top edge rows.
        if (this._pixelCheckDownPassage(probeX, y1, probeY, hitbox, subCount) === false) return false;

        // Validate horizontal lanes at the new entered TOP row.
        if (this._pixelCheckHorizontalAtNewYRow(probeY, y1, probeX, hitbox, subCount) === false) return false;
      }
      else
      {
        // Validate origin out-direction on the current bottom edge rows.
        if (this._pixelCheckDownPassage(probeX, probeY, y1, hitbox, subCount) === false) return false;

        // Validate destination in-direction on the new bottom edge rows.
        if (this._pixelCheckUpPassage(probeX, y1, probeY, hitbox, subCount) === false) return false;

        // Validate horizontal lanes at the new entered BOTTOM row.
        if (this._pixelCheckHorizontalAtNewYRow(probeY, y1, probeX, hitbox, subCount) === false) return false;
      }
    }

    // Advance the probe to the approved substep landing.
    probeX = x1;
    probeY = y1;
  }

  // AABB consistency guard: even when no subcell seam was crossed (player is very close
  // to a wall), ensure the final probe AABB does not overlap a solid tile. This matches
  // the post-move check in movePixelDistance and prevents canPassStraight from returning
  // true when the step destination physically overlaps impassable terrain.
  if (this.isThrough() === false && this.isDebugThrough() === false && this.isOverlappingSolidTiles(
    probeX + this.getCollisionPivotX(),
    probeY + this.getCollisionPivotY(),
    radius))
  {
    return false;
  }

  // Finally, apply character-vs-character collision at the final landing point.
  const characterBlocked = this.isCharacterCollisionAt(probeX, probeY, radius);

  // Approve only if no character collision would occur.
  return characterBlocked === false;
};

/**
 * Checks if the character's AABB at the given position would overlap any "solid wall" tiles.
 * A "solid wall" tile is defined here as out-of-bounds or a tile that is not passable in
 * any cardinal direction (2/4/6/8). This prevents slipping into impassable terrain corners
 * while allowing wall sliding that the edge-lane rule enables.
 * @param {number} px The proposed x center in tile units (fractional).
 * @param {number} py The proposed y center in tile units (fractional).
 * @param {number} radius The half-size of the square AABB in tiles.
 * @returns {boolean} True if any overlapped tile is solid, false otherwise.
 */
Game_CharacterBase.prototype.isOverlappingSolidTiles = function(px, py, radius)
{
  // Define tiny epsilon to bias away from seams when flooring.
  const eps = 1e-6;

  // Compute the inclusive bounds of tiles overlapped by the AABB at (px, py).
  const minCol = Math.floor(px - radius + eps);
  const maxCol = Math.floor(px + radius - eps);
  const minRow = Math.floor(py - radius + eps);
  const maxRow = Math.floor(py + radius - eps);

  // Iterate all overlapped tiles.
  for (let ty = minRow; ty <= maxRow; ty++)
  {
    for (let tx = minCol; tx <= maxCol; tx++)
    {
      // Treat out-of-bounds as solid.
      if ($gameMap.isValid(tx, ty) === false)
      {
        // Out-of-bounds overlaps are never allowed.
        return true;
      }

      // Determine if this tile has any passable cardinal direction at all.
      const anyPass =
        $gameMap.isPassable(tx, ty, J.PIXEL.Directions.DOWN) ||
        $gameMap.isPassable(tx, ty, J.PIXEL.Directions.LEFT) ||
        $gameMap.isPassable(tx, ty, J.PIXEL.Directions.RIGHT) ||
        $gameMap.isPassable(tx, ty, J.PIXEL.Directions.UP);

      // If a tile is not passable in any cardinal direction, it's a solid wall tile.
      if (anyPass === false)
      {
        // Overlapping a solid wall tile is not allowed.
        return true;
      }
    }
  }

  // No overlapped tiles were solid; overlap is acceptable.
  return false;
};

/**
 * Extends {@link Game_CharacterBase.canPass}.<br>
 * Rounds fractional pixel coordinates to the nearest tile integer before delegating
 * to the tile-based passability check. With pixel movement, `_x`/`_y` are fractional;
 * the base RMMZ method uses them as array indices, so non-integer inputs produce
 * incorrect results without this normalization.
 * @param {number} x The x tile coordinate (may be fractional with pixel movement).
 * @param {number} y The y tile coordinate (may be fractional with pixel movement).
 * @param {2|4|6|8} d The direction to check passage toward.
 * @returns {boolean} Whether passage is allowed from the nearest tile in direction d.
 */
J.PIXEL.Aliased.Game_CharacterBase.set('canPass', Game_CharacterBase.prototype.canPass);
Game_CharacterBase.prototype.canPass = function(x, y, d)
{
  return J.PIXEL.Aliased.Game_CharacterBase.get('canPass').call(this, Math.round(x), Math.round(y), d);
};

/**
 * Extends {@link Game_CharacterBase#regionId}.<br>
 * Samples the map region at the character's collision pivot tile. With pixel movement,
 * `_x`/`_y` are fractional; vanilla forwards them into {@link Game_Map#tileId}, which
 * indexes `$dataMap.data` and returns wrong regions when coordinates are not integers.
 * @returns {number} The region id at the pivot tile.
 */
J.PIXEL.Aliased.Game_CharacterBase.set('regionId', Game_CharacterBase.prototype.regionId);
Game_CharacterBase.prototype.regionId = function()
{
  // resolve the tile under the body, not the fractional anchor corner.
  const tileX = Math.floor(this._x + this.getCollisionPivotX());
  const tileY = Math.floor(this._y + this.getCollisionPivotY());

  return $gameMap.regionId(tileX, tileY);
};

/**
 * Moves straight in a given direction.
 * If there is an underlying diagonal direction, then move diagonally.
 * @param {number} direction The direction being moved.
 */
J.PIXEL.Aliased.Game_CharacterBase.set('moveStraight', Game_CharacterBase.prototype.moveStraight);
Game_CharacterBase.prototype.moveStraight = function(direction)
{
  // Evaluate pixel-aware straight passability including character collision.
  this.setMovementSuccess(this.canPassStraight(direction));

  // Always face the attempted direction, matching rmmz default behavior.
  // Enemies that are blocked must still update their facing so the projectile
  // direction baked at decision-time reflects where they were trying to go.
  this.setDirection(direction);

  // If passable, perform a pixel-distance straight move.
  if (this.isMovementSucceeded())
  {
    this.movePixelDistance(direction, this.distancePerFrame());
  }
  else
  {
    // notify any adjacent event triggers, matching rmmz default behavior.
    this.checkEventTriggerTouchFront(direction);
  }
};

/**
 * Extends {@link Game_CharacterBase.moveDiagonally}.<br>
 * Evaluates pixel-aware diagonal passability and executes pixel-distance movement.
 * Direction is updated unconditionally (matching rmmz default behavior) so that
 * a blocked diagonal step still rotates the character away from a wall.
 * @param {4|6} horz The horizontal component direction (4=left, 6=right).
 * @param {2|8} vert The vertical component direction (2=down, 8=up).
 */
J.PIXEL.Aliased.Game_CharacterBase.set('moveDiagonally', Game_CharacterBase.prototype.moveDiagonally);
Game_CharacterBase.prototype.moveDiagonally = function(horz, vert)
{
  this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));

  if (this.isMovementSucceeded())
  {
    const direction = this.directionFromHorzVert(horz, vert);
    this.movePixelDistance(direction, this.diagonalDistancePerFrame());
    this.setDirection(direction);
  }

  // rmmz updates direction unconditionally for diagonal moves: if the character
  // is facing the reverse of a component direction, rotate toward that component.
  if (this._direction === this.reverseDir(horz))
  {
    this.setDirection(horz);
  }
  if (this._direction === this.reverseDir(vert))
  {
    this.setDirection(vert);
  }
};

/**
 * Executes pixel movement in the given direction if possible.
 * This also returns the cardinal-normalized direction that should be faced.
 *
 * Notes:
 * - This version removes all “offset lane” probes. canPassStraight no longer
 *   accepts a perpendicular offset, so legacy offset-driven logic has been
 *   eliminated to prevent biased early/late decisions that felt like “+0.5”.
 * - Snapping is now epsilon-based around the orthogonal axis after a straight
 *   move to avoid jitter without over-snapping.
 * @param {2|4|6|8|1|3|7|9} direction The desired direction to be moved.
 * @returns {number} The cardinal-normalized direction to face while moving.
 */
Game_CharacterBase.prototype.pixelMoveByInput = function(direction)
{
  // Establish a local variable for the direction.
  let innerDirection = direction;

  // Calculate distance to move.
  const straightDistance = this.distancePerFrame();
  const diagonalDistance = this.diagonalDistancePerFrame();

  // Local probe helpers using the unified straight passability (no offset lanes).
  const canDown = () => this.canPassStraight(J.PIXEL.Directions.DOWN, straightDistance);
  const canUp = () => this.canPassStraight(J.PIXEL.Directions.UP, straightDistance);
  const canLeft = () => this.canPassStraight(J.PIXEL.Directions.LEFT, straightDistance);
  const canRight = () => this.canPassStraight(J.PIXEL.Directions.RIGHT, straightDistance);

  // Precompute rounded axes for light orthogonal re-centering after straight moves.
  const roundX = Math.round(this._x);
  const roundY = Math.round(this._y);

  // A small snap tolerance to gently re-center on the orthogonal axis after straight motion.
  const SNAP_EPSILON = 0.1;

  // Attempts a diagonal step if valid; returns a cardinal facing if moved, or 0 if not.
  const tryDiagonal = (diagDir) =>
  {
    // Validate diagonal acceptance including character collision.
    if (this.canPassDiagonalByDirection(diagDir) === false)
    {
      // Not a valid diagonal.
      return 0;
    }

    // Execute the movement.
    this.setMovementSuccess(true);
    this.movePixelDistance(diagDir, diagonalDistance);

    // When moving diagonally, face a cardinal; prefer vertical for down/up vs up/down.
    switch (diagDir)
    {
      case J.PIXEL.Directions.LOWERLEFT:
      case J.PIXEL.Directions.LOWERRIGHT:
      {
        // Face down when going to a lower row.
        this.setDirection(J.PIXEL.Directions.DOWN);
        return J.PIXEL.Directions.DOWN;
      }
      case J.PIXEL.Directions.UPPERLEFT:
      case J.PIXEL.Directions.UPPERRIGHT:
      {
        // Face up when going to an upper row.
        this.setDirection(J.PIXEL.Directions.UP);
        return J.PIXEL.Directions.UP;
      }
    }

    // Unknown diagonal; not handled.
    return 0;
  };

  // Chooses a fallback between two cardinals by comparing residuals to the rounded axes.
  const diagonalFallback = (preferHorzDir, preferVertDir, chooseHorizontalPredicate) =>
  {
    // If residual X is smaller than residual Y, prefer horizontal; else prefer vertical.
    if (chooseHorizontalPredicate())
    {
      // Prefer the horizontal.
      return this.pixelMoveByInput(preferHorzDir);
    }
    else
    {
      // Prefer the vertical.
      return this.pixelMoveByInput(preferVertDir);
    }
  };

  // Lightly re-center X after a vertical move.
  const recenterXAfterVertical = () =>
  {
    // If we are close enough to tile center, snap to eliminate drift.
    if (Math.abs(this._x - roundX) <= SNAP_EPSILON)
    {
      // Assign the rounded X.
      this._x = roundX;
    }
  };

  // Lightly re-center Y after a horizontal move.
  const recenterYAfterHorizontal = () =>
  {
    // If we are close enough to tile center, snap to eliminate drift.
    if (Math.abs(this._y - roundY) <= SNAP_EPSILON)
    {
      // Assign the rounded Y.
      this._y = roundY;
    }
  };

  // Performs the straight move and gently re-centers the orthogonal axis if close enough.
  const doStraightMove = (cardinalDir) =>
  {
    // Flag success and perform the movement.
    this.setMovementSuccess(true);
    this.movePixelDistance(cardinalDir, straightDistance);

    // Re-center the orthogonal axis with a small tolerance to avoid jitter.
    switch (cardinalDir)
    {
      case J.PIXEL.Directions.DOWN:
      case J.PIXEL.Directions.UP:
      {
        // Re-center X after vertical motion.
        recenterXAfterVertical();
        break;
      }
      case J.PIXEL.Directions.LEFT:
      case J.PIXEL.Directions.RIGHT:
      {
        // Re-center Y after horizontal motion.
        recenterYAfterHorizontal();
        break;
      }
    }

    // Face the direction of travel.
    this.setDirection(cardinalDir);

    // Return the cardinal direction we are facing.
    return cardinalDir;
  };

  // Handles diagonal inputs collectively with a single switch.
  // eslint-disable-next-line complexity
  const handleDiagonal = (diagDir) =>
  {
    // Handle each diagonal independently using a switch.
    switch (diagDir)
    {
      case J.PIXEL.Directions.LOWERLEFT:
      {
        // If both component legs are passable, try the diagonal.
        if (canLeft() && canDown())
        {
          // Attempt diagonal; return cardinal-facing or 0.
          const faced = tryDiagonal(J.PIXEL.Directions.LOWERLEFT);
          if (faced > 0) return faced;

          // If diagonal landing blocked, split by residuals.
          return diagonalFallback(
            J.PIXEL.Directions.LEFT,
            J.PIXEL.Directions.DOWN,
            () => (this.x - roundX) < (roundY - this.y));
        }

        // If only one leg is passable, recurse to that cardinal.
        if (canLeft()) return this.pixelMoveByInput(J.PIXEL.Directions.LEFT);
        if (canDown()) return this.pixelMoveByInput(J.PIXEL.Directions.DOWN);

        // Otherwise, bias facing to down for consistency.
        innerDirection = J.PIXEL.Directions.DOWN;
        return innerDirection;
      }
      case J.PIXEL.Directions.LOWERRIGHT:
      {
        // If both component legs are passable, try the diagonal.
        if (canRight() && canDown())
        {
          // Attempt diagonal; return cardinal-facing or 0.
          const faced = tryDiagonal(J.PIXEL.Directions.LOWERRIGHT);
          if (faced > 0) return faced;

          // If diagonal landing blocked, split by residuals.
          return diagonalFallback(
            J.PIXEL.Directions.RIGHT,
            J.PIXEL.Directions.DOWN,
            () => (roundX - this.x) < (roundY - this.y));
        }

        // If only one leg is passable, recurse to that cardinal.
        if (canRight()) return this.pixelMoveByInput(J.PIXEL.Directions.RIGHT);
        if (canDown()) return this.pixelMoveByInput(J.PIXEL.Directions.DOWN);

        // Otherwise, bias facing to down for consistency.
        innerDirection = J.PIXEL.Directions.DOWN;
        return innerDirection;
      }
      case J.PIXEL.Directions.UPPERLEFT:
      {
        // If both component legs are passable, try the diagonal.
        if (canLeft() && canUp())
        {
          // Attempt diagonal; return cardinal-facing or 0.
          const faced = tryDiagonal(J.PIXEL.Directions.UPPERLEFT);
          if (faced > 0) return faced;

          // If diagonal landing blocked, split by residuals.
          return diagonalFallback(
            J.PIXEL.Directions.LEFT,
            J.PIXEL.Directions.UP,
            () => (this.x - roundX) < (this.y - roundY));
        }

        // If only one leg is passable, recurse to that cardinal.
        if (canLeft()) return this.pixelMoveByInput(J.PIXEL.Directions.LEFT);
        if (canUp()) return this.pixelMoveByInput(J.PIXEL.Directions.UP);

        // Otherwise, bias facing to up for consistency.
        innerDirection = J.PIXEL.Directions.UP;
        return innerDirection;
      }
      case J.PIXEL.Directions.UPPERRIGHT:
      {
        // If both component legs are passable, try the diagonal.
        if (canRight() && canUp())
        {
          // Attempt diagonal; return cardinal-facing or 0.
          const faced = tryDiagonal(J.PIXEL.Directions.UPPERRIGHT);
          if (faced > 0) return faced;

          // If diagonal landing blocked, split by residuals.
          return diagonalFallback(
            J.PIXEL.Directions.RIGHT,
            J.PIXEL.Directions.UP,
            () => (roundX - this.x) < (this.y - roundY));
        }

        // If only one leg is passable, recurse to that cardinal.
        if (canRight()) return this.pixelMoveByInput(J.PIXEL.Directions.RIGHT);
        if (canUp()) return this.pixelMoveByInput(J.PIXEL.Directions.UP);

        // Otherwise, bias facing to up for consistency.
        innerDirection = J.PIXEL.Directions.UP;
        return innerDirection;
      }
      default:
      {
        // Unknown diagonal; return 0 to indicate not handled.
        return 0;
      }
    }
  };

  // When pressing a cardinal into a blocked wall while slightly off the tile grid,
  // nudge the perpendicular axis toward the nearest tile center by up to one frame's
  // distance and always commit the nudge. Over multiple frames the character drifts
  // into alignment with the nearest passable corridor ("wall-slide"). The horizontal
  // or vertical move in the blocked direction is only attempted once the nudged
  // position actually passes the straight-passability check.
  const tryWallSlide = (blockedDir) =>
  {
    const isHorizontal = (
      blockedDir === J.PIXEL.Directions.LEFT ||
      blockedDir === J.PIXEL.Directions.RIGHT
    );

    const radius = this.getEffectiveRadius();

    if (isHorizontal)
    {
      // Nudge Y toward the nearest tile-center row.
      const targetY = Math.round(this._y);
      const residual = targetY - this._y;

      // Already centered; nothing to nudge.
      if (Math.abs(residual) < 0.001) return 0;

      const nudge = Math.sign(residual) * Math.min(Math.abs(residual), straightDistance);
      const nudgedY = this._y + nudge;

      // Reject the nudge if the new Y position would overlap a solid tile.
      if (this.isOverlappingSolidTiles(
        this._x + this.getCollisionPivotX(),
        nudgedY + this.getCollisionPivotY(),
        radius))
      {
        return 0;
      }

      // Commit the nudge so it accumulates across frames.
      this._y = nudgedY;
      this._realY = this._y;

      // Re-check horizontal passability from the nudged position.
      if (this.canPassStraight(blockedDir, straightDistance))
      {
        // Nudge opened a corridor; execute the horizontal move.
        return doStraightMove(blockedDir);
      }

      // Corridor still blocked; nudge was kept for next frame's drift.
      // Signal that we moved (the Y drift) so the walk animation plays.
      this.setMovedThisFrame(true);
      return 0;
    }
    else
    {
      // Nudge X toward the nearest tile-center column.
      const targetX = Math.round(this._x);
      const residual = targetX - this._x;

      if (Math.abs(residual) < 0.001) return 0;

      const nudge = Math.sign(residual) * Math.min(Math.abs(residual), straightDistance);
      const nudgedX = this._x + nudge;

      // Reject the nudge if the new X position would overlap a solid tile.
      if (this.isOverlappingSolidTiles(
        nudgedX + this.getCollisionPivotX(),
        this._y + this.getCollisionPivotY(),
        radius))
      {
        return 0;
      }

      // Commit the nudge.
      this._x = nudgedX;
      this._realX = this._x;

      if (this.canPassStraight(blockedDir, straightDistance))
      {
        return doStraightMove(blockedDir);
      }

      this.setMovedThisFrame(true);
      return 0;
    }
  };

  // Handles straight inputs using a switch with shared execution and gentle re-centering.
  const handleStraight = (cardinalDir) =>
  {
    // Handle the straight direction selection with a switch.
    switch (cardinalDir)
    {
      case J.PIXEL.Directions.DOWN:
      {
        if (canDown()) return doStraightMove(J.PIXEL.Directions.DOWN);
        return tryWallSlide(J.PIXEL.Directions.DOWN);
      }
      case J.PIXEL.Directions.UP:
      {
        if (canUp()) return doStraightMove(J.PIXEL.Directions.UP);
        return tryWallSlide(J.PIXEL.Directions.UP);
      }
      case J.PIXEL.Directions.LEFT:
      {
        if (canLeft()) return doStraightMove(J.PIXEL.Directions.LEFT);
        return tryWallSlide(J.PIXEL.Directions.LEFT);
      }
      case J.PIXEL.Directions.RIGHT:
      {
        if (canRight()) return doStraightMove(J.PIXEL.Directions.RIGHT);
        return tryWallSlide(J.PIXEL.Directions.RIGHT);
      }
      default:
      {
        // Unknown straight direction; not handled.
        return 0;
      }
    }
  };

  // If diagonal, try the diagonal handler first.
  if (this.isDiagonalDirection(direction))
  {
    // Attempt a diagonal execution path.
    const faced = handleDiagonal(direction);
    if (faced > 0) return faced;
  }

  // If straight, try the straight handler.
  if (this.isStraightDirection(direction))
  {
    // Attempt a straight execution path.
    const faced = handleStraight(direction);
    if (faced > 0) return faced;
  }

  // Fall back to returning the inner direction unchanged.
  return innerDirection;
};

/**
 * Overwrites {@link Game_CharacterBase.canPassDiagonally} with Cyclone-like semantics.
 * Requires both legs at current, re-validates at new X and at new Y, validates reverse
 * at destination, and rejects if a character occupies the diagonal landing point.
 * @param {number} x The current x.
 * @param {number} y The current y.
 * @param {4|6} horz The horizontal leg.
 * @param {2|8} vert The vertical leg.
 * @returns {boolean} True if diagonal is permitted.
 */
// eslint-disable-next-line complexity
Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert)
{
  // TODO: reduce complexity (collision kernel); extract pure helpers without changing semantics.
  // Snapshot current to restore after checks.
  const oldX = this._x;

  // Snapshot current to restore after checks.
  const oldY = this._y;

  // Align to provided coordinates for symmetry.
  this._x = x;
  this._y = y;

  // If through/debug-through, approve.
  if (this.isThrough() || this.isDebugThrough())
  {
    // Restore and approve.
    this._x = oldX;
    this._y = oldY;
    return true;
  }

  // Compute step lengths.
  const straightStep = this.distancePerFrame();

  // Compute the diagonal step length.
  const diagStep = this.diagonalDistancePerFrame();

  // Update radius and hitbox metrics.
  const radius = this.getEffectiveRadius();

  // Build the hitbox for collision sampling.
  const hitbox = this._pixelHitbox(radius);

  // Determine the subgrid resolution.
  const subCount = this._pixelCollisionSubCount();

  // Initialize destination center X with current X.
  let nx = this._x;

  // Initialize destination center Y with current Y.
  let ny = this._y;

  // If the horizontal leg is right, add the diagonal step to X.
  if (horz === J.PIXEL.Directions.RIGHT)
  {
    nx = this._x + diagStep;
  }
  // Else if the horizontal leg is left, subtract the diagonal step from X.
  else if (horz === J.PIXEL.Directions.LEFT)
  {
    nx = this._x - diagStep;
  }

  // If the vertical leg is down, add the diagonal step to Y.
  if (vert === J.PIXEL.Directions.DOWN)
  {
    ny = this._y + diagStep;
  }
  // Else if the vertical leg is up, subtract the diagonal step from Y.
  else if (vert === J.PIXEL.Directions.UP)
  {
    ny = this._y - diagStep;
  }

  // Bounds check destination.
  if ($gameMap.isValid(nx, ny) === false)
  {
    // Restore original coordinates.
    this._x = oldX;
    this._y = oldY;

    // Destination is invalid.
    return false;
  }

  // Leg 1 at current center for horizontal movement.
  if (horz === J.PIXEL.Directions.LEFT)
  {
    // Validate leftward passage from the current center.
    if (this._pixelCheckLeftPassage(this._x, this._y, this._x - straightStep, hitbox, subCount) === false)
    {
      // Restore original coordinates and reject.
      this._x = oldX;
      this._y = oldY;
      return false;
    }
  }
  else
  {
    // Validate rightward passage from the current center.
    if (this._pixelCheckRightPassage(this._x, this._y, this._x + straightStep, hitbox, subCount) === false)
    {
      // Restore original coordinates and reject.
      this._x = oldX;
      this._y = oldY;
      return false;
    }
  }

  // Leg 2 at current center for vertical movement.
  if (vert === J.PIXEL.Directions.UP)
  {
    // Validate upward passage from the current center.
    if (this._pixelCheckUpPassage(this._x, this._y, this._y - straightStep, hitbox, subCount) === false)
    {
      // Restore original coordinates and reject.
      this._x = oldX;
      this._y = oldY;
      return false;
    }
  }
  else
  {
    // Validate downward passage from the current center.
    if (this._pixelCheckDownPassage(this._x, this._y, this._y + straightStep, hitbox, subCount) === false)
    {
      // Restore original coordinates and reject.
      this._x = oldX;
      this._y = oldY;
      return false;
    }
  }

  // Revalidate at new Y (horizontal at y2).
  let y2 = this._y;

  // If moving down on the vertical leg, add straight step to y2.
  if (vert === J.PIXEL.Directions.DOWN)
  {
    y2 = this._y + straightStep;
  }
  // Else if moving up, subtract straight step from y2.
  else if (vert === J.PIXEL.Directions.UP)
  {
    y2 = this._y - straightStep;
  }

  // Validate the horizontal leg at the displaced Y.
  if (horz === J.PIXEL.Directions.LEFT)
  {
    // Validate leftward passage at y2.
    if (this._pixelCheckLeftPassage(this._x, y2, this._x - straightStep, hitbox, subCount) === false)
    {
      // Restore original coordinates and reject.
      this._x = oldX;
      this._y = oldY;
      return false;
    }
  }
  else
  {
    // Validate rightward passage at y2.
    if (this._pixelCheckRightPassage(this._x, y2, this._x + straightStep, hitbox, subCount) === false)
    {
      // Restore original coordinates and reject.
      this._x = oldX;
      this._y = oldY;
      return false;
    }
  }

  // Revalidate at new X (vertical at x2).
  let x2 = this._x;

  // If moving right on the horizontal leg, add straight step to x2.
  if (horz === J.PIXEL.Directions.RIGHT)
  {
    x2 = this._x + straightStep;
  }
  // Else if moving left, subtract straight step from x2.
  else if (horz === J.PIXEL.Directions.LEFT)
  {
    x2 = this._x - straightStep;
  }

  // Validate the vertical leg at the displaced X.
  if (vert === J.PIXEL.Directions.UP)
  {
    // Validate upward passage at x2.
    if (this._pixelCheckUpPassage(x2, this._y, this._y - straightStep, hitbox, subCount) === false)
    {
      // Restore original coordinates and reject.
      this._x = oldX;
      this._y = oldY;
      return false;
    }
  }
  else
  {
    // Validate downward passage at x2.
    if (this._pixelCheckDownPassage(x2, this._y, this._y + straightStep, hitbox, subCount) === false)
    {
      // Restore original coordinates and reject.
      this._x = oldX;
      this._y = oldY;
      return false;
    }
  }

  // Validate horizontal reverse at destination center.
  if (horz === J.PIXEL.Directions.LEFT)
  {
    // Check the reverse (rightward) at the final destination.
    if (this._pixelCheckRightPassage(nx, ny, nx + straightStep, hitbox, subCount) === false)
    {
      // Restore original coordinates and reject.
      this._x = oldX;
      this._y = oldY;
      return false;
    }
  }
  else
  {
    // Check the reverse (leftward) at the final destination.
    if (this._pixelCheckLeftPassage(nx, ny, nx - straightStep, hitbox, subCount) === false)
    {
      // Restore original coordinates and reject.
      this._x = oldX;
      this._y = oldY;
      return false;
    }
  }

  // Validate vertical reverse at destination center.
  if (vert === J.PIXEL.Directions.UP)
  {
    // Check the reverse (downward) at the final destination.
    if (this._pixelCheckDownPassage(nx, ny, ny + straightStep, hitbox, subCount) === false)
    {
      // Restore original coordinates and reject.
      this._x = oldX;
      this._y = oldY;
      return false;
    }
  }
  else
  {
    // Check the reverse (upward) at the final destination.
    if (this._pixelCheckUpPassage(nx, ny, ny - straightStep, hitbox, subCount) === false)
    {
      // Restore original coordinates and reject.
      this._x = oldX;
      this._y = oldY;
      return false;
    }
  }

  // Character-vs-character check at diagonal landing.
  const blocked = this.isCharacterCollisionAt(nx, ny, radius);

  // Restore original coordinates.
  this._x = oldX;
  this._y = oldY;

  // Approve if no character is colliding at destination.
  return blocked === false;
};

/**
 * Determines whether or not a diagonal by its 8-dir code is passable for the next frame.
 * Requires both component straight legs to be passable using the tile-centered straight check,
 * then rejects if a character-vs-character AABB would collide at the diagonal landing point.
 * No lateral offset columns or lane sampling.
 * @param {1|3|7|9} diagonalDir The diagonal direction (1,3,7,9).
 * @param {number=} straightDistance Optional straight distance per frame to probe with.
 * @returns {boolean} True if the diagonal can be taken this frame, false otherwise.
 */
Game_CharacterBase.prototype.canPassDiagonalByDirection = function(
  diagonalDir,
  straightDistance = this.distancePerFrame())
{
  // Leg testers using the simplified, tile-centered straight acceptance.
  const canDown = () => this.canPassStraight(J.PIXEL.Directions.DOWN, straightDistance);
  const canUp = () => this.canPassStraight(J.PIXEL.Directions.UP, straightDistance);
  const canLeft = () => this.canPassStraight(J.PIXEL.Directions.LEFT, straightDistance);
  const canRight = () => this.canPassStraight(J.PIXEL.Directions.RIGHT, straightDistance);

  // Require both legs of the diagonal to be passable.
  let legsOk = false;
  if (diagonalDir === J.PIXEL.Directions.LOWERLEFT) legsOk = (canLeft() && canDown());
  if (diagonalDir === J.PIXEL.Directions.LOWERRIGHT) legsOk = (canRight() && canDown());
  if (diagonalDir === J.PIXEL.Directions.UPPERLEFT) legsOk = (canLeft() && canUp());
  if (diagonalDir === J.PIXEL.Directions.UPPERRIGHT) legsOk = (canRight() && canUp());
  if (legsOk === false) return false;

  // Simulate the diagonal landing point (same step length you execute with).
  const step = this.diagonalDistancePerFrame();
  let nx = this._x;
  let ny = this._y;
  if (diagonalDir === J.PIXEL.Directions.LOWERLEFT)
  {
    nx -= step;
    ny += step;
  }
  if (diagonalDir === J.PIXEL.Directions.LOWERRIGHT)
  {
    nx += step;
    ny += step;
  }
  if (diagonalDir === J.PIXEL.Directions.UPPERLEFT)
  {
    nx -= step;
    ny -= step;
  }
  if (diagonalDir === J.PIXEL.Directions.UPPERRIGHT)
  {
    nx += step;
    ny -= step;
  }

  // Reject if a character occupies the diagonal landing point.
  const radius = this.getEffectiveRadius();
  return this.isCharacterCollisionAt(nx, ny, radius) === false;
};

/**
 * Checks for a collision against other solid characters at a fractional point.
 * Uses simple AABB (square) overlap in tile space for stable, flat boundaries.
 * Party members (player and followers) never block each other.
 * Only events with normal priority ("Same as characters") are considered blockers.
 * @param {number} px Proposed x (fractional tiles).
 * @param {number} py Proposed y (fractional tiles).
 * @param {number=} radius Optional collision half-size in tiles (default 0.35).
 * @returns {boolean} True if any solid character would collide at (px, py).
 */
Game_CharacterBase.prototype.isCharacterCollisionAt = function(px, py, radius = 0.35)
{
  // Acquire the player reference.
  const player = $gamePlayer;

  // Acquire follower references.
  const followers = player._followers._data;

  // Build the party list (player + followers).
  const party = [ player ].concat(followers);

  // Determine if this character is part of the party.
  const selfIsParty = party.includes(this);

  // Gather all map events as initial candidates.
  const events = $gameMap.events();

  // Initialize candidate collection.
  const candidates = [];

  // Add events that can collide.
  events.forEach(ev =>
  {
    // Exclude self.
    if (ev === this) return;

    // Exclude erased events.
    if (ev.isErased()) return;

    // Exclude events flagged as through.
    if (ev.isThrough()) return;

    // Exclude events that are NOT normal priority (below/above characters don’t block movement).
    if (ev.isNormalPriority() === false) return;

    // Exclude JABS action sprites so they do not block physical movement.
    if (J.ABS && ev.isJabsAction()) return;

    // Include this event as a candidate.
    candidates.push(ev);
  });

  // Only add the player/followers if self is NOT a party member.
  if (selfIsParty === false)
  {
    // Add the player as a candidate when not through.
    if (player !== this && player.isThrough() === false)
    {
      // Include the player as a candidate.
      candidates.push(player);
    }

    // Add followers that can collide.
    followers.forEach(f =>
    {
      // Exclude self.
      if (f === this) return;

      // Exclude through followers.
      if (f.isThrough()) return;

      // Include this follower as a candidate.
      candidates.push(f);
    });
  }

  // Define a small helper for AABB overlap test in tile-space.
  const aabbOverlap = function(ax, ay, ahw, ahh, bx, by, bhw, bhh)
  {
    // Compute deltas along each axis.
    const dx = Math.abs(ax - bx);

    // Compute deltas along each axis.
    const dy = Math.abs(ay - by);

    // Overlap if deltas are within summed half-extents along both axes.
    return dx < (ahw + bhw) && dy < (ahh + bhh);
  };

  // Probe the AABB for each candidate.
  for (let i = 0; i < candidates.length; i++)
  {
    // Grab the candidate.
    const ch = candidates[i];

    // Extra defense: skip JABS action sprites even if accidentally included above.
    if (J.ABS && ch.isJabsAction())
    {
      // Do not collide with JABS actions here.
      continue;
    }

    // Acquire candidate center in true fractional tile space.
    const cx = ch.x;

    // Acquire candidate center in true fractional tile space.
    const cy = ch.y;

    // Candidate half-extents in tiles; use the character's effective (clamped) radius.
    const cr = ch.getEffectiveRadius();

    // Test AABB overlap.
    if (aabbOverlap(px, py, radius, radius, cx, cy, cr, cr))
    {
      // Overlap found; movement would collide.
      return true;
    }
  }

  // No overlaps found; movement is clear.
  return false;
};

/**
 * Gets the collision radius for this character in tile units.
 * This radius is used for pixel-accurate character-vs-character collision checks.
 * @returns {number} The collision radius in tiles.
 */
Game_CharacterBase.prototype.getCollisionRadius = function()
{
  // Return a sensible default radius in tile units for this character.
  return 0.3;
};

/**
 * Gets the effective collision radius, clamped so the hitbox never extends past the
 * tile boundary below the character. Enforces the invariant:
 *   pivotY + effectiveRadius < 1.0
 * This prevents the hitbox from bleeding into the tile below, which would cause false
 * solid-overlap detections against deny-region tiles and similar boundary conditions.
 * @returns {number} The clamped collision radius in tile units.
 */
Game_CharacterBase.prototype.getEffectiveRadius = function()
{
  // The maximum downward extent before bleeding into the tile below.
  const maxRadius = 1.0 - this.getCollisionPivotY() - 1e-6;

  // Return the smaller of the configured radius and the safe maximum.
  return Math.min(this.getCollisionRadius(), maxRadius);
};

/**
 * Gets the collision pivot X in tile units for this character.
 * The pivot offsets the hitbox center from the character's logical `_x` coordinate.
 * A value of 0.5 places the hitbox at the horizontal center of the sprite tile.
 * @returns {number} The X pivot offset in tile units.
 */
Game_CharacterBase.prototype.getCollisionPivotX = function()
{
  // Place the hitbox at the horizontal center of the character sprite tile.
  return 0.5;
};

/**
 * Gets the collision pivot Y in tile units for this character.
 * The pivot offsets the hitbox center from the character's logical `_y` coordinate.
 * A value of 0.5 centers the hitbox on the character's tile, giving symmetric collision
 * margins on all four sides and eliminating the half-tile early-block from below/right.
 * @returns {number} The Y pivot offset in tile units.
 */
Game_CharacterBase.prototype.getCollisionPivotY = function()
{
  // Center the hitbox on the tile vertically, matching the horizontal pivot.
  return 0.5;
};

//region pixel helpers
/**
 * Computes a square hitbox derived from the configured collision radius.
 * The hitbox is centered on the collision pivot on both axes, matching the player’s
 * visual center to eliminate perceived half-tile skew.
 * @param {number} radius The collision half-size in tiles.
 * @returns {{w:number,h:number,hx:number,hy:number}}
 */
Game_CharacterBase.prototype._pixelHitbox = function(radius)
{
  // Half-width equals the radius.
  const half = radius;

  // Compute full width/height of the hitbox.
  const width = half * 2;
  const height = half * 2;

  // Place the box centered on the pivot in both axes.
  return {
    // Hitbox width.
    w: width,
    // Hitbox height.
    h: height,
    // Hitbox left offset from pivot X (centered on X pivot).
    hx: -half,
    // Hitbox top offset from pivot Y (centered on Y pivot).
    hy: -half,
  };
};

/**
 * Returns the collision subgrid resolution from the plugin metadata.
 * @returns {number} The collision subgrid count.
 */
Game_CharacterBase.prototype._pixelCollisionSubCount = function()
{
  if (PIXEL_CollisionManager.collisionStepCount === undefined)
  {
    // Initialize defaults if the manager has not been configured yet.
    PIXEL_CollisionManager.initConfig();
  }

  return PIXEL_CollisionManager.collisionStepCount;
};

/**
 * Determines passability at a fractional subcell against the PIXEL collision table.
 * Expects coordinates already in the collision-table’s integer-aligned space
 * (seam-aligned), which are produced by the first/last collision helpers.
 * @param {number} px The fractional x at the sampled subcell (tile units).
 * @param {number} py The fractional y at the sampled subcell (tile units).
 * @param {2|4|6|8} d The direction to test (entering direction).
 * @returns {boolean} True if passable, false otherwise.
 */
Game_CharacterBase.prototype._pixelIsPositionPassable = function(px, py, d)
{
  // Coordinates are already seam-aligned; delegate directly.
  return PIXEL_CollisionManager.isPositionPassable(px, py, d);
};

/**
 * Returns 180-degree reverse of a 4-dir direction.
 * @param {2|4|6|8} d The direction.
 * @returns {2|4|6|8} The reverse direction.
 */
Game_CharacterBase.prototype._pixelReverseDir = function(d)
{
  if (d === 2) return 8;
  if (d === 8) return 2;
  if (d === 4) return 6;
  if (d === 6) return 4;
  return d;
};

/**
 * First collision X for hitbox at center x with subgrid count.
 * Uses an inward-biased floor to pick the first overlapped subcolumn.
 * Applies the per-character pivot for alignment.
 * @param {number} x The character’s tile x.
 * @param {{hx:number,w:number}} hb Hitbox.
 * @param {number} count Subgrid count.
 * @returns {number} First subcell x.
 */
Game_CharacterBase.prototype._pixelFirstCollisionXAt = function(x, hb, count)
{
  // Translate into pivot-space for X.
  const px = x + this.getCollisionPivotX();

  // Compute the left edge of the hitbox in subgrid units.
  const raw = (px + hb.hx) * count;

  // Define a tiny inward epsilon to resolve exact-seam ties into the current subcell.
  const eps = 1e-7;

  // Compute the first overlapped subcolumn using inward-biased floor.
  return Math.floor(raw + eps) / count;
};

/**
 * Last collision X for hitbox at center x with subgrid count.
 * Uses an inward-biased floor on the right edge minus epsilon to include the last overlapped subcolumn.
 * Applies the per-character pivot for alignment.
 * @param {number} x The character’s tile x.
 * @param {{hx:number,w:number}} hb Hitbox.
 * @param {number} count Subgrid count.
 * @returns {number} Last subcell x.
 */
Game_CharacterBase.prototype._pixelLastCollisionXAt = function(x, hb, count)
{
  // Translate into pivot-space for X.
  const px = x + this.getCollisionPivotX();

  // Compute the right edge of the hitbox in subgrid units.
  const raw = (px + hb.hx + hb.w) * count;

  // Define a tiny inward epsilon to resolve exact-seam ties into the current subcell.
  const eps = 1e-7;

  // Compute the last overlapped subcolumn using inward-biased floor of (edge - eps).
  return Math.floor(raw - eps) / count;
};

/**
 * First collision Y for hitbox at center y with subgrid count.
 * Uses an inward-biased floor to pick the first overlapped subrow.
 * Applies the per-character pivot for alignment.
 * @param {number} y The character’s tile y.
 * @param {{hy:number,h:number}} hb Hitbox.
 * @param {number} count Subgrid count.
 * @returns {number} First subcell y.
 */
Game_CharacterBase.prototype._pixelFirstCollisionYAt = function(y, hb, count)
{
  // Translate into pivot-space for Y.
  const py = y + this.getCollisionPivotY();

  // Compute the top edge of the hitbox in subgrid units.
  const raw = (py + hb.hy) * count;

  // Define a tiny inward epsilon to resolve exact-seam ties into the current subcell.
  const eps = 1e-7;

  // Compute the first overlapped subrow using inward-biased floor.
  return Math.floor(raw + eps) / count;
};

/**
 * Last collision Y for hitbox at center y with subgrid count.
 * Uses an inward-biased floor on the bottom edge minus epsilon to include the last overlapped subrow.
 * Applies the per-character pivot for alignment.
 * @param {number} y The character’s tile y.
 * @param {{hy:number,h:number}} hb Hitbox.
 * @param {number} count Subgrid count.
 * @returns {number} Last subcell y.
 */
Game_CharacterBase.prototype._pixelLastCollisionYAt = function(y, hb, count)
{
  // Translate into pivot-space for Y.
  const py = y + this.getCollisionPivotY();

  // Compute the bottom edge of the hitbox in subgrid units.
  const raw = (py + hb.hy + hb.h) * count;

  // Define a tiny inward epsilon to resolve exact-seam ties into the current subcell.
  const eps = 1e-7;

  // Compute the last overlapped subrow using inward-biased floor of (edge - eps).
  return Math.floor(raw - eps) / count;
};

/**
 * Checks leftward passage from current center at y across edge subcells.
 * Uses integer subcell indices to detect true seam crossings and sample spans.
 * @param {number} x Current center x.
 * @param {number} y Current center y.
 * @param {number} xDest Destination center x.
 * @param {{hx:number,hy:number,w:number,h:number}} hb Hitbox.
 * @param {number} count Subgrid count.
 * @returns {boolean} True if passage allowed.
 */
Game_CharacterBase.prototype._pixelCheckLeftPassage = function(x, y, xDest, hb, count)
{
  // Acquire the feet-pivoted coordinates.
  const px0 = x + this.getCollisionPivotX();
  const px1 = xDest + this.getCollisionPivotX();
  const py = y + this.getCollisionPivotY();

  // Tiny epsilon for seam bias into box interior.
  const eps = 1e-7;

  // Current and destination left integer column indices (the leading edge when moving left).
  const curLeftIdx  = Math.floor((px0 + hb.hx) * count + eps);
  const destLeftIdx = Math.floor((px1 + hb.hx) * count + eps);

  // True leftward crossing: destination left edge exactly one column left of current left edge.
  const crossed = (destLeftIdx === curLeftIdx - 1);
  if (crossed === false)
  {
    // No seam entry; nothing to validate.
    return true;
  }

  // Compute vertical span in integer row indices at current y.
  const firstRowIdx = Math.floor((py + hb.hy) * count + eps);
  const lastRowIdx  = Math.floor((py + hb.hy + hb.h) * count - eps);

  // Convert seam columns back to fractional for sampling.
  const curColX  = curLeftIdx / count;
  const destColX = destLeftIdx / count;

  // Iterate all overlapped rows on that column transition.
  for (let row = firstRowIdx; row <= lastRowIdx; row++)
  {
    // Convert the current row index into a fractional y for sampling.
    const ny = row / count;

    // DEBUG markers.
    // yellow current.
    J.PIXEL.Debug.push(curColX,  ny, "rgba(255, 255, 0, 0.6)");
    // cyan dest.
    J.PIXEL.Debug.push(destColX, ny, "rgba(0, 255, 255, 0.6)");

    // Current left-most subcell must allow moving LEFT (exiting left).
    if (this._pixelIsPositionPassable(curColX, ny, J.PIXEL.Directions.LEFT) === false) return false;

    // Destination right-most subcell must allow moving RIGHT (entering from left).
    if (this._pixelIsPositionPassable(destColX, ny, J.PIXEL.Directions.RIGHT) === false) return false;
  }

  // All sampled rows permit left passage.
  return true;
};

/**
 * Checks rightward passage across edge subcells using integer indices.
 * Validates current-right vs destination-left along all overlapped rows.
 * @param {number} x Current center x.
 * @param {number} y Current center y.
 * @param {number} xDest Destination center x.
 * @param {{hx:number,hy:number,w:number,h:number}} hb Hitbox.
 * @param {number} count Subgrid count.
 * @returns {boolean} True if passage allowed.
 */
Game_CharacterBase.prototype._pixelCheckRightPassage = function(x, y, xDest, hb, count)
{
  // Pivoted positions.
  const px0 = x + this.getCollisionPivotX();
  const px1 = xDest + this.getCollisionPivotX();
  const py = y + this.getCollisionPivotY();

  // Epsilon for inward bias.
  const eps = 1e-7;

  // Current and destination right integer column indices (the leading edge when moving right).
  const curRightIdx  = Math.floor((px0 + hb.hx + hb.w) * count - eps);
  const destRightIdx = Math.floor((px1 + hb.hx + hb.w) * count + eps);

  // True rightward crossing: destination right edge exactly one column right of current right edge.
  const crossed = (destRightIdx === curRightIdx + 1);
  if (crossed === false)
  {
    // Did not enter a new subcolumn; nothing to validate.
    return true;
  }

  // Vertical span in integer rows.
  const firstRowIdx = Math.floor((py + hb.hy) * count + eps);
  const lastRowIdx  = Math.floor((py + hb.hy + hb.h) * count - eps);

  // Convert to fractional for sampling.
  const curColX  = curRightIdx / count;
  const destColX = destRightIdx / count;

  // Iterate all overlapped rows on that column transition.
  for (let row = firstRowIdx; row <= lastRowIdx; row++)
  {
    // Convert the row index into a fractional y for sampling.
    const ny = row / count;

    // DEBUG markers.
    // yellow current.
    J.PIXEL.Debug.push(curColX,  ny, "rgba(255, 255, 0, 0.6)");
    // cyan dest.
    J.PIXEL.Debug.push(destColX, ny, "rgba(0, 255, 255, 0.6)");

    // Current right-most must allow RIGHT (exiting right).
    if (this._pixelIsPositionPassable(curColX, ny, J.PIXEL.Directions.RIGHT) === false) return false;

    // Destination left-most must allow LEFT (entering from right).
    if (this._pixelIsPositionPassable(destColX, ny, J.PIXEL.Directions.LEFT) === false) return false;
  }

  // All sampled rows permit right passage.
  return true;
};

/**
 * Checks upward passage across edge subcells using integer indices.
 * Validates current-top vs destination-bottom along all overlapped columns.
 * @param {number} x Current center x.
 * @param {number} y Current center y.
 * @param {number} yDest Destination center y.
 * @param {{hx:number,hy:number,w:number,h:number}} hb Hitbox.
 * @param {number} count Subgrid count.
 * @returns {boolean} True if passage allowed.
 */
Game_CharacterBase.prototype._pixelCheckUpPassage = function(x, y, yDest, hb, count)
{
  // Pivoted positions.
  const py0 = y + this.getCollisionPivotY();
  const py1 = yDest + this.getCollisionPivotY();
  const px  = x + this.getCollisionPivotX();

  // Epsilon for inward bias.
  const eps = 1e-7;

  // Current and destination top integer row indices (the leading edge when moving up).
  const curTopIdx  = Math.floor((py0 + hb.hy) * count + eps);
  const destTopIdx = Math.floor((py1 + hb.hy) * count + eps);

  // True upward crossing: destination top edge exactly one row above current top edge.
  const crossed = (destTopIdx === curTopIdx - 1);
  if (crossed === false)
  {
    // No seam entry; nothing to validate.
    return true;
  }

  // Horizontal span in integer columns.
  const firstColIdx = Math.floor((px + hb.hx) * count + eps);
  const lastColIdx  = Math.floor((px + hb.hx + hb.w) * count - eps);

  // Convert seam rows to fractional for sampling.
  const curRowY  = curTopIdx / count;
  const destRowY = destTopIdx / count;

  // Iterate all overlapped columns on that row transition.
  for (let col = firstColIdx; col <= lastColIdx; col++)
  {
    // Convert the column index into a fractional x for sampling.
    const nx = col / count;

    // DEBUG markers.
    // yellow current.
    J.PIXEL.Debug.push(nx, curRowY,  "rgba(255, 255, 0, 0.6)");
    // cyan dest.
    J.PIXEL.Debug.push(nx, destRowY, "rgba(0, 255, 255, 0.6)");

    // Current top must allow UP (exiting upward).
    if (this._pixelIsPositionPassable(nx, curRowY,  J.PIXEL.Directions.UP)   === false) return false;

    // Destination bottom must allow DOWN (entering from below).
    if (this._pixelIsPositionPassable(nx, destRowY, J.PIXEL.Directions.DOWN) === false) return false;
  }

  // All sampled columns permit up passage.
  return true;
};

/**
 * Checks downward passage across edge subcells using integer indices.
 * Validates current-bottom vs destination-top along all overlapped columns.
 * @param {number} x Current center x.
 * @param {number} y Current center y.
 * @param {number} yDest Destination center y.
 * @param {{hx:number,hy:number,w:number,h:number}} hb Hitbox.
 * @param {number} count Subgrid count.
 * @returns {boolean} True if passage allowed.
 */
Game_CharacterBase.prototype._pixelCheckDownPassage = function(x, y, yDest, hb, count)
{
  // Pivoted positions.
  const py0 = y + this.getCollisionPivotY();
  const py1 = yDest + this.getCollisionPivotY();
  const px  = x + this.getCollisionPivotX();

  // Epsilon for inward bias.
  const eps = 1e-7;

  // Current and destination bottom integer row indices (the leading edge when moving down).
  const curBottomIdx  = Math.floor((py0 + hb.hy + hb.h) * count - eps);
  const destBottomIdx = Math.floor((py1 + hb.hy + hb.h) * count + eps);

  // True downward crossing: destination bottom edge exactly one row below current bottom edge.
  const crossed = (destBottomIdx === curBottomIdx + 1);
  if (crossed === false)
  {
    // No seam entry; nothing to validate.
    return true;
  }

  // Horizontal span in integer columns.
  const firstColIdx = Math.floor((px + hb.hx) * count + eps);
  const lastColIdx  = Math.floor((px + hb.hx + hb.w) * count - eps);

  // Convert seam rows to fractional for sampling.
  const curRowY  = curBottomIdx  / count;
  const destRowY = destBottomIdx / count;

  // Iterate all overlapped columns on that row transition.
  for (let col = firstColIdx; col <= lastColIdx; col++)
  {
    // Convert the column index into a fractional x for sampling.
    const nx = col / count;

    // DEBUG markers.
    // yellow current.
    J.PIXEL.Debug.push(nx, curRowY,  "rgba(255, 255, 0, 0.6)");
    // cyan dest.
    J.PIXEL.Debug.push(nx, destRowY, "rgba(0, 255, 255, 0.6)");

    // Current bottom must allow DOWN (exiting downward).
    if (this._pixelIsPositionPassable(nx, curRowY,  J.PIXEL.Directions.DOWN) === false) return false;

    // Destination top must allow UP (entering from above).
    if (this._pixelIsPositionPassable(nx, destRowY, J.PIXEL.Directions.UP)   === false) return false;
  }

  // All sampled columns permit down passage.
  return true;
};

/**
 * Validates vertical lanes (up/down) at the specific new X-edge column we are entering.
 * Now uses integer column indices and runs only when a seam was truly crossed.
 * @param {number} xCurrent The current center x before the step.
 * @param {number} xDest The destination center x after the step.
 * @param {number} y The current center y (for edge sampling across vertical lanes).
 * @param {{hx:number,hy:number,w:number,h:number}} hb The hitbox metrics.
 * @param {number} count The collision subgrid count.
 * @returns {boolean} True if lanes ok.
 */
Game_CharacterBase.prototype._pixelCheckVerticalAtNewXColumn = function(xCurrent, xDest, y, hb, count)
{
  // If no horizontal motion, nothing to do.
  if (xDest === xCurrent) return true;

  // Pivoted positions.
  const px0 = xCurrent + this.getCollisionPivotX();
  const px1 = xDest    + this.getCollisionPivotX();
  const py  = y        + this.getCollisionPivotY();

  // Epsilon for inward bias.
  const eps = 1e-7;

  // Current and destination seam columns as integer indices.
  const curRightIdx  = Math.floor((px0 + hb.hx + hb.w) * count - eps);
  const curLeftIdx   = Math.floor((px0 + hb.hx) * count + eps);
  const destLeftIdx  = Math.floor((px1 + hb.hx) * count + eps);
  const destRightIdx = Math.floor((px1 + hb.hx + hb.w) * count - eps);

  // Determine motion direction.
  const movingRight = xDest > xCurrent;

  // True seam entry test.
  const crossed = movingRight
    ? (destLeftIdx === curRightIdx + 1)
    : (destRightIdx === curLeftIdx - 1);

  // If no seam crossed, do not lane-check.
  if (crossed === false) return true;

  // Choose the destination seam column index.
  const columnIdx = movingRight ? destLeftIdx : destRightIdx;

  // Convert to fractional x for sampling.
  const columnX = columnIdx / count;

  // Vertical span.
  const firstRowIdx = Math.floor((py + hb.hy) * count + eps);
  const lastRowIdx  = Math.floor((py + hb.hy + hb.h) * count - eps);

  // Iterate the overlapped vertical subcells on that column.
  for (let row = firstRowIdx; row <= lastRowIdx; row++)
  {
    // Convert the row index into a fractional y for sampling.
    const ny = row / count;

    // DEBUG lane markers (blue).
    J.PIXEL.Debug.push(columnX, ny, "rgba(0, 128, 255, 0.6)");

    // Compute lane permissions.
    const upOk   = this._pixelIsPositionPassable(columnX, ny, J.PIXEL.Directions.UP);
    const downOk = this._pixelIsPositionPassable(columnX, ny, J.PIXEL.Directions.DOWN);

    // Require at least one lane open for sliding.
    if (upOk === false && downOk === false) return false;
  }

  // Lanes are open enough to permit passage.
  return true;
};

/**
 * Validates horizontal lanes (left/right) at the specific new Y-edge row we are entering.
 * Now uses integer row indices and runs only when a seam was truly crossed.
 * @param {number} yCurrent The current center y before the step.
 * @param {number} yDest The destination center y after the step.
 * @param {number} x The current center x (for edge sampling across horizontal lanes).
 * @param {{hx:number,hy:number,w:number,h:number}} hb The hitbox metrics.
 * @param {number} count The collision subgrid count.
 * @returns {boolean} True if lanes ok.
 */
Game_CharacterBase.prototype._pixelCheckHorizontalAtNewYRow = function(yCurrent, yDest, x, hb, count)
{
  // If no vertical motion, nothing to do.
  if (yDest === yCurrent) return true;

  // Pivoted positions.
  const py0 = yCurrent + this.getCollisionPivotY();
  const py1 = yDest    + this.getCollisionPivotY();
  const px  = x        + this.getCollisionPivotX();

  // Epsilon for inward bias.
  const eps = 1e-7;

  // Current and destination seam rows as integer indices.
  const curBottomIdx  = Math.floor((py0 + hb.hy + hb.h) * count - eps);
  const curTopIdx     = Math.floor((py0 + hb.hy) * count + eps);
  const destTopIdx    = Math.floor((py1 + hb.hy) * count + eps);
  const destBottomIdx = Math.floor((py1 + hb.hy + hb.h) * count - eps);

  // Determine motion direction.
  const movingDown = yDest > yCurrent;

  // True seam entry test.
  const crossed = movingDown
    ? (destTopIdx === curBottomIdx + 1)
    : (destBottomIdx === curTopIdx - 1);

  // If no seam crossed, do not lane-check.
  if (crossed === false) return true;

  // Choose the destination seam row index.
  const rowIdx = movingDown ? destTopIdx : destBottomIdx;

  // Convert to fractional y for sampling.
  const rowY = rowIdx / count;

  // Horizontal span.
  const firstColIdx = Math.floor((px + hb.hx) * count + eps);
  const lastColIdx  = Math.floor((px + hb.hx + hb.w) * count - eps);

  // Iterate the overlapped horizontal subcells on that row.
  for (let col = firstColIdx; col <= lastColIdx; col++)
  {
    // Convert the column index into a fractional x for sampling.
    const nx = col / count;

    // DEBUG lane markers (blue).
    J.PIXEL.Debug.push(nx, rowY, "rgba(0, 128, 255, 0.6)");

    // Compute lane permissions.
    const leftOk  = this._pixelIsPositionPassable(nx, rowY, J.PIXEL.Directions.LEFT);
    const rightOk = this._pixelIsPositionPassable(nx, rowY, J.PIXEL.Directions.RIGHT);

    // Require at least one lane open for sliding.
    if (leftOk === false && rightOk === false) return false;
  }

  // Lanes are open enough to permit passage.
  return true;
};
//endregion pixel helpers
//region vector movement
/**
 * Moves this character at an arbitrary angle in degrees.
 * The angle follows the RMMZ map convention: 0° = right, 90° = down, 180° = left, 270° = up.
 * Movement is blocked if pixel collision prevents passage in the chosen direction.
 * @param {number} angleDegrees The angle in degrees (0–360, clockwise from right).
 * @param {number=} speed The movement speed in tile units; defaults to distancePerFrame.
 * @returns {boolean} True if the character moved, false if blocked.
 */
Game_CharacterBase.prototype.vectorMoveByAngle = function(angleDegrees, speed = this.distancePerFrame())
{
  // convert angle from degrees to radians.
  const radians = (angleDegrees * Math.PI) / 180;

  // compute the signed unit vector components in tile space.
  const dx = Math.cos(radians) * speed;
  const dy = Math.sin(radians) * speed;

  // cache the pre-move position for rollback on collision.
  const prevX = this._x;
  const prevY = this._y;

  // acquire the collision radius for AABB evaluation.
  const radius = this.getEffectiveRadius();

  // determine the nearest 8-direction for per-axis collision probing.
  let horzDir = 0;
  if (dx > 0)
  {
    horzDir = J.PIXEL.Directions.RIGHT;
  }
  else if (dx < 0)
  {
    horzDir = J.PIXEL.Directions.LEFT;
  }
  let vertDir = 0;
  if (dy > 0)
  {
    vertDir = J.PIXEL.Directions.DOWN;
  }
  else if (dy < 0)
  {
    vertDir = J.PIXEL.Directions.UP;
  }

  // probe horizontal component if non-zero.
  let canMoveX = (dx === 0);
  if (dx !== 0)
  {
    // check straight horizontal passage at the proposed X offset.
    canMoveX = this.canPassStraight(horzDir, Math.abs(dx));
  }

  // probe vertical component if non-zero.
  let canMoveY = (dy === 0);
  if (dy !== 0)
  {
    // check straight vertical passage at the proposed Y offset.
    canMoveY = this.canPassStraight(vertDir, Math.abs(dy));
  }

  // determine final displacement with wall-sliding: if one axis is blocked, zero it.
  const finalDx = canMoveX ? dx : 0;
  const finalDy = canMoveY ? dy : 0;

  // if neither axis allows movement, the character is fully blocked.
  if (finalDx === 0 && finalDy === 0)
  {
    // no movement occurred.
    return false;
  }

  // apply displacement.
  this._x += finalDx;
  this._y += finalDy;

  // post-overlap guard: if we ended up inside a solid tile, roll back.
  if (this.isThrough() === false && this.isDebugThrough() === false && this.isOverlappingSolidTiles(
    this._x + this.getCollisionPivotX(),
    this._y + this.getCollisionPivotY(),
    radius))
  {
    // restore the previous position.
    this._x = prevX;
    this._y = prevY;

    // synchronize render coordinates.
    this._realX = this._x;
    this._realY = this._y;

    // no movement occurred.
    return false;
  }

  // flag that movement occurred this frame.
  this.setMovedThisFrame(true);

  // synchronize render/smoothing coordinates.
  this._realX = this._x;
  this._realY = this._y;

  // update move distance for step tracking.
  this.modMoveDistance(speed);

  // check for step threshold crossing.
  this.updatePixelStepping();

  // face the nearest 8-direction toward the angle for sprite orientation.
  const facingDirection = this.angleToNearestDirection(angleDegrees);
  if (facingDirection > 0)
  {
    // update the sprite facing direction.
    this.setDirection(facingDirection);
  }

  // movement succeeded.
  return true;
};

/**
 * Converts an angle in degrees to the nearest 4-direction code for sprite facing.
 * Uses cardinal-only snapping since RMMZ sprites only have 4 facing directions.
 * @param {number} angleDegrees The angle in degrees (0° = right, 90° = down).
 * @returns {2|4|6|8} The nearest cardinal direction code.
 */
Game_CharacterBase.prototype.angleToNearestDirection = function(angleDegrees)
{
  // normalize angle to 0–360 range.
  const normalized = ((angleDegrees % 360) + 360) % 360;

  // snap to the closest 90° quadrant.
  if (normalized >= 315 || normalized < 45)
  {
    // right: 315–360 and 0–45.
    return J.PIXEL.Directions.RIGHT;
  }

  if (normalized >= 45 && normalized < 135)
  {
    // down: 45–135.
    return J.PIXEL.Directions.DOWN;
  }

  if (normalized >= 135 && normalized < 225)
  {
    // left: 135–225.
    return J.PIXEL.Directions.LEFT;
  }

  // up: 225–315.
  return J.PIXEL.Directions.UP;
};
//endregion vector movement
//endregion Game_CharacterBase

//region Game_Event
/**
 * Determines whether or not one this event is collided with other events given the point.
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 * @returns {boolean}
 */
Game_Event.prototype.isCollidedWithEvents = function(x, y)
{
  // Gather events at the target tile without through consideration.
  const events = $gameMap.eventsXyNt(x, y);

  // Filter out this event, erased events, and those set to through.
  const colliders = events.filter(ev =>
  {
    // Exclude self.
    if (ev === this) return false;

    // Exclude erased events.
    if (ev.isErased()) return false;

    // Exclude through events.
    if (ev.isThrough()) return false;

    // Include otherwise.
    return true;
  });

  // Determine if any valid colliders remain.
  return colliders.length > 0;
};

/**
 * Overrides {@link Game_CharacterBase.getCollisionPivotY}.<br>
 * Anchors NPC and enemy event collision near their feet for natural depth feel.
 * JABS action events (projectiles) are flagged as through and bypass tile collision
 * entirely, so this override does not affect them.
 * @returns {number} The Y pivot offset in tile units.
 */
Game_Event.prototype.getCollisionPivotY = function()
{
  return 0.70;
};

//endregion Game_Event

//region Game_Follower
/**
 * Updates the direction and position based on the preceding character.
 * This forces followers to always face the character infront of them in the follower train.
 * @param {Game_Follower|Game_Player} otherCharacter The character in front of this character in order.
 */
Game_Follower.prototype.pixelFaceCharacter = function(otherCharacter = $gamePlayer)
{
  // grab the most recently added tracking for the previous character in the train.
  const otherPosition = otherCharacter.oldestPositionalRecord();

  // do not update direction if we don't know the preceding character's previous position.
  if (!otherPosition) return;

  // check if the follower is facing up/down.
  const isFacingVertically = Math.abs(otherPosition.y - this._y) > Math.abs(otherPosition.x - this._x);

  // determine which direction to face; only one of these can be true at any given time.
  const shouldFaceDown = isFacingVertically && otherPosition.y > this._y;
  const shouldFaceUp = isFacingVertically && otherPosition.y < this._y;
  const shouldFaceRight = !isFacingVertically && otherPosition.x > this._x;
  const shouldFaceLeft = !isFacingVertically && otherPosition.x < this._x;

  // face the follower the appropriate direction.
  switch (true)
  {
    case shouldFaceDown:
      this.setDirection(J.PIXEL.Directions.DOWN);
      break;
    case shouldFaceUp:
      this.setDirection(J.PIXEL.Directions.UP);
      break;
    case shouldFaceLeft:
      this.setDirection(J.PIXEL.Directions.LEFT);
      break;
    case shouldFaceRight:
      this.setDirection(J.PIXEL.Directions.RIGHT);
      break;
  }
};

/**
 * Extends {@link Game_Follower.chaseCharacter}.<br/>
 * Suppresses vanilla chasing when ALLYAI controls this follower, so formation owns movement.
 * @param {Game_Character} character The character to chase (usually the preceding character).
 */
J.PIXEL.Aliased.Game_Follower.set("chaseCharacter", Game_Follower.prototype.chaseCharacter);
Game_Follower.prototype.chaseCharacter = function(character)
{
  // If Ally AI exists and this follower is AI-controlled, defer to formation logic entirely.
  if (J.ABS.EXT.ALLYAI && this.getJabsBattler()) return;

  // Perform original vanilla chase behavior for non-AI followers.
  J.PIXEL.Aliased.Game_Follower.get("chaseCharacter")
    .call(this, character);
};

/**
 * Extends {@link Game_Follower.update}.<br/>
 * Ensures follower render coordinates always match logical coordinates.
 */
J.PIXEL.Aliased.Game_Follower.set("update", Game_Follower.prototype.update);
Game_Follower.prototype.update = function()
{
  // Perform original logic.
  J.PIXEL.Aliased.Game_Follower.get("update")
    .call(this);

  // Always synchronize render/smoothing coordinates to the logical coordinates.
  if (this._realX !== this._x || this._realY !== this._y)
  {
    // Snap the render coordinates to the logical coordinates.
    this._realX = this._x;
    this._realY = this._y;
  }

  // Defensive: if this follower is an AI-controlled ally and did not move via PIXEL this frame,
  // ensure no residual drift continues. This does not interfere with formation moves.
  if (J.ABS.EXT.ALLYAI && this.getJabsBattler())
  {
    // If there was no active pixel-move input this frame, clamp any lingering movement state.
    if (this.isMovePressed() === false)
    {
      // Reset stop count so the engine considers us stationary immediately.
      this._stopCount = 0;

      // Synchronize the render one more time (belt-and-suspenders).
      this._realX = this._x;
      this._realY = this._y;
    }
  }
};

/**
 * Extends {@link Game_Follower.moveStraight}.<br/>
 * When AllyAI controls this follower and it is idle (not alerted/engaged),
 * block generic straight movement unless PIXEL is actively driving movement.
 * @param {2|4|6|8} direction The cardinal direction to move.
 */
J.PIXEL.Aliased.Game_Follower.set("moveStraight", Game_Follower.prototype.moveStraight);
Game_Follower.prototype.moveStraight = function(direction)
{
  // If AllyAI exists and this follower is AI-controlled, enforce idle guard.
  if (J.ABS.EXT.ALLYAI && this.getJabsBattler())
  {
    // Acquire the JABS battler for engagement/alert state.
    const jabsBattler = this.getJabsBattler();

    // If not engaged and not alerted (formation/idle phase)...
    if (!jabsBattler.isEngaged() && !jabsBattler.isAlerted())
    {
      // Only allow movement if pixel movement is actively pressing (issued this frame).
      if (this.isMovePressed() === false)
      {
        // Block stray straight moves during idle formation.
        return;
      }
    }
  }

  // Perform original logic.
  J.PIXEL.Aliased.Game_Follower.get("moveStraight")
    .call(this, direction);
};

/**
 * Extends {@link Game_Follower.moveDiagonally}.<br/>
 * When AllyAI controls this follower and it is idle (not alerted/engaged),
 * block generic diagonal movement unless PIXEL is actively driving movement.
 * @param {4|6} horz The horizontal component direction (4=left, 6=right).
 * @param {2|8} vert The vertical component direction (2=down, 8=up).
 */
J.PIXEL.Aliased.Game_Follower.set("moveDiagonally", Game_Follower.prototype.moveDiagonally);
Game_Follower.prototype.moveDiagonally = function(horz, vert)
{
  // If AllyAI exists and this follower is AI-controlled, enforce idle guard.
  if (J.ABS.EXT.ALLYAI && this.getJabsBattler())
  {
    // Acquire the JABS battler for engagement/alert state.
    const jabsBattler = this.getJabsBattler();

    // If not engaged and not alerted (formation/idle phase)...
    if (!jabsBattler.isEngaged() && !jabsBattler.isAlerted())
    {
      // Only allow movement if pixel movement is actively pressing (issued this frame).
      if (this.isMovePressed() === false)
      {
        // Block stray diagonal moves during idle formation.
        return;
      }
    }
  }

  // Perform original logic.
  J.PIXEL.Aliased.Game_Follower.get("moveDiagonally")
    .call(this, horz, vert);
};

/**
 * Overrides {@link Game_CharacterBase.getCollisionPivotY}.<br>
 * Anchors the follower's collision center near their feet to match the player's
 * depth-biased collision feel. Keeps the follower train visually consistent.
 * @returns {number} The Y pivot offset in tile units.
 */
Game_Follower.prototype.getCollisionPivotY = function()
{
  return 0.70;
};
//endregion Game_Follower

//region Game_Map
/**
 * Extends {@link Game_Map.setup}.<br>
 * Builds the PIXEL subcell collision table when a new map loads.
 * @param {number} mapId The id of the map to setup.
 */
J.PIXEL.Aliased.Game_Map.set("setup", Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId)
{
  // Perform the original setup logic.
  J.PIXEL.Aliased.Game_Map.get("setup")
    .call(this, mapId);

  // Build the PIXEL subcell collision table for this map.
  PIXEL_CollisionManager.setupCollision();

  // suppress Player Touch / Event Touch underfoot briefly after load/transfer.
  this._pixelFootTouchTriggerCooldown = J.PIXEL.Metadata.FootTouchEventDelayFrames;
};
//endregion Game_Map

//region Game_Player
/**
 * Overrides {@link Game_Player.checkEventTriggerHere}.<br>
 * Includes the rounding of the x,y coordinates when checking event triggers for things beneath you.
 * @param {number[]} triggers The numeric triggers for this event.
 */
Game_Player.prototype.checkEventTriggerHere = function(triggers)
{
  // check if we can start an event at the current location.
  if (this.canStartLocalEvents())
  {
    let effectiveTriggers = triggers;
    if (($gameMap._pixelFootTouchTriggerCooldown || 0) > 0)
    {
      effectiveTriggers = triggers.filter(t => t !== 1 && t !== 2);
      if (effectiveTriggers.length === 0)
      {
        return;
      }
    }

    // round the x,y coordinates.
    const roundX = Math.round(this.x);
    const roundY = Math.round(this.y);

    // start the event with the rounded coordinates.
    this.startMapEvent(roundX, roundY, effectiveTriggers, false);
  }
};

/**
 * Extends {@link Game_Player.update}.<br>
 * Ticks down the foot-touch trigger cooldown after all movement and trigger logic for the frame.
 */
J.PIXEL.Aliased.Game_Player.set('update', Game_Player.prototype.update);
Game_Player.prototype.update = function(sceneActive)
{
  J.PIXEL.Aliased.Game_Player.get('update')
    .call(this, sceneActive);

  if ($gameMap._pixelFootTouchTriggerCooldown > 0)
  {
    $gameMap._pixelFootTouchTriggerCooldown--;
  }
};

/**
 * Overrides {@link Game_Player.checkEventTriggerThere}.<br/>
 * Computes the front tile from the current facing using rounded base coordinates,
 * then starts map events there; if that tile is a counter, also checks one tile beyond.
 * @param {number[]} triggers The triggers associated with checking the event at the location.
 */
Game_Player.prototype.checkEventTriggerThere = function(triggers)
{
  // Check if we can start an event at the target location.
  if (this.canStartLocalEvents() === false) return;

  // Round the base coordinates to the nearest tile for consistent tile addressing.
  const baseX = Math.round(this.x);
  const baseY = Math.round(this.y);

  // Acquire the current facing direction (expects cardinal).
  const dir = this.direction();

  // Compute the front tile from the rounded base coordinates and facing.
  const x1 = $gameMap.roundXWithDirection(baseX, dir);
  const y1 = $gameMap.roundYWithDirection(baseY, dir);

  // Start any qualifying events on the front tile; treat them as "there"/normal.
  this.startMapEvent(x1, y1, triggers, true);

  // Determine if the front tile is a counter.
  const isCounter = $gameMap.isCounter(x1, y1);

  // If the front tile is a counter, also check one tile beyond.
  if (isCounter)
  {
    // Compute the tile one more step beyond the counter tile.
    const x2 = $gameMap.roundXWithDirection(x1, dir);
    const y2 = $gameMap.roundYWithDirection(y1, dir);

    // Start any qualifying events on the tile beyond the counter.
    this.startMapEvent(x2, y2, triggers, true);
  }

};

/**
 * Extends {@link checkEventTriggerTouch}.<br>
 * Handles the triggering of events by using a threshold-type formula to determine if actually touched.
 */
J.PIXEL.Aliased.Game_Player.set('checkEventTriggerTouch', Game_Player.prototype.checkEventTriggerTouch);
Game_Player.prototype.checkEventTriggerTouch = function(x, y)
{
  // round the x,y coordinates.
  const roundX = Math.round(x);
  const roundY = Math.round(y);

  // rmmz touch events operate at integer tile coordinates, so rounding is required.
  // trigger only when within 0.3 tiles of the tile center to prevent early/spurious fires.
  const didTrigger = Math.abs(roundX - x) < 0.3 && Math.abs(roundY - y) < 0.3;

  // check if the event was triggered with the threshold coordinates.
  if (didTrigger)
  {
    // return the original logic's result.
    return J.PIXEL.Aliased.Game_Player.get('checkEventTriggerTouch')
      .call(this, roundX, roundY);
  }

  // no triggering the event.
  return false;
};

/**
 * Overrides {@link Game_Player.checkEventTriggerTouchFront}.<br/>
 * Computes the front tile from the current facing using rounded base coordinates,
 * checks for touch triggers there via PIXEL threshold logic, and if the front tile
 * is a counter, also checks the tile beyond.
 * @param {number} direction The attempted move direction (ignored; uses current facing).
 * @returns {boolean} True if a touch trigger fired, false otherwise.
 */
// eslint-disable-next-line no-unused-vars
Game_Player.prototype.checkEventTriggerTouchFront = function(direction)
{
  // Round the base coordinates to the nearest tile for consistent tile addressing.
  const baseX = Math.round(this.x);
  const baseY = Math.round(this.y);

  // Always use the player's current facing for front-touch checks.
  const dir = this.direction();

  // Compute the front tile from the rounded base coordinates and facing.
  const x1 = $gameMap.roundXWithDirection(baseX, dir);
  const y1 = $gameMap.roundYWithDirection(baseY, dir);

  // Attempt to touch-trigger events on the front tile using PIXEL's threshold logic.
  if (this.checkEventTriggerTouch(x1, y1))
  {
    // A front-touch trigger was fired.
    return true;
  }

  // Determine if the front tile is a counter.
  const isCounter = $gameMap.isCounter(x1, y1);

  // If the front tile is a counter, also check one tile beyond.
  if (isCounter)
  {
    // Compute the tile one more step beyond the counter tile.
    const x2 = $gameMap.roundXWithDirection(x1, dir);
    const y2 = $gameMap.roundYWithDirection(y1, dir);

    // Attempt to touch-trigger events on the beyond tile using PIXEL's threshold logic.
    if (this.checkEventTriggerTouch(x2, y2))
    {
      // A beyond-counter touch trigger was fired.
      return true;
    }
  }

  // No touch triggers fired for front or beyond.
  return false;
};

/**
 * Updates whether or not the player is dashing.
 */
Game_Player.prototype.updateDashing = function()
{
  // if we are moving by means other than pressing the button, don't process.
  if (this.isMoving() && !this.isMovePressed()) return;

  // check if we can move, are out of a vehicle, and dashing is enabled.
  if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled())
  {
    // we're dashing then if the we clicked to go somewhere, or we're holding dash.
    this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();

    // stop processing.
    return;
  }

  // we are not dashing.
  this._dashing = false;
};

/**
 * Gets the analog input angle for the player in degrees, if vector movement is active.
 * Reads raw gamepad axis data directly from the Gamepad API to preserve sub-45° precision.
 * Falls back to keyboard/d-pad dir8-to-angle conversion when no analog stick is active.
 * Returns null if vector movement is disabled or there is no directional input at all.
 * @returns {number|null} Angle in degrees (0=right, 90=down), or null if not applicable.
 */
Game_Player.prototype.getVectorInputAngle = function()
{
  // do not use vector movement if the parameter is disabled.
  if (J.PIXEL.Metadata.VectorMovementEnabled === false)
  {
    return null;
  }

  // try the raw analog stick first; it returns null when no gamepad is active or
  // the stick is inside the dead zone.
  const analogAngle = this._readGamepadAnalogAngle();

  if (analogAngle !== null)
  {
    return analogAngle;
  }

  // fall back to keyboard / d-pad: convert the 8-direction code to a fixed angle.
  const rawDir8 = Input.dir8;

  if (rawDir8 === 0)
  {
    return null;
  }

  return this.dir8ToAngle(rawDir8);
};

/**
 * Reads the left analog stick from the first connected gamepad and returns the angle
 * in degrees, or null if no gamepad is present or the stick is inside the dead zone.
 *
 * RMMZ's Input system discards raw axis floats before they reach Input.dir8, converting
 * them to digital button states with a 0.5 threshold. To get true arbitrary angles we
 * must bypass RMMZ and read navigator.getGamepads() directly.
 *
 * Dead zone of 0.15 (smaller than RMMZ's 0.5 threshold) filters joystick drift while
 * still detecting gentle pushes before RMMZ's digital conversion fires.
 *
 * @returns {number|null} Angle in degrees (0=right, 90=down in RMMZ Y-down space), or null.
 */
Game_Player.prototype._readGamepadAnalogAngle = function()
{
  // Gamepad API is not available in all environments.
  if (!navigator.getGamepads)
  {
    return null;
  }

  const gamepads = navigator.getGamepads();

  if (!gamepads)
  {
    return null;
  }

  for (const gamepad of gamepads)
  {
    if (!gamepad || gamepad.connected === false)
    {
      continue;
    }

    const [axisX, axisY] = gamepad.axes;

    // compute magnitude to apply a circular dead zone.
    const magnitude = Math.sqrt(axisX * axisX + axisY * axisY);

    if (magnitude < 0.15)
    {
      // stick is inside the dead zone; try the next gamepad.
      continue;
    }

    // atan2 returns radians in [-π, π]; convert to degrees.
    return Math.atan2(axisY, axisX) * 180 / Math.PI;
  }

  return null;
};

/**
 * Converts an 8-direction input code to an angle in degrees.
 * @param {1|2|3|4|6|7|8|9} dir8 The 8-direction code.
 * @returns {number} The angle in degrees (0=right, 90=down).
 */
Game_Player.prototype.dir8ToAngle = function(dir8)
{
  // map 8-dir codes to angles in the RMMZ Y-down space (0=right, 90=down, 180=left, 270=up).
  switch (dir8)
  {
    case J.PIXEL.Directions.RIGHT:
      return 0;
    case J.PIXEL.Directions.LOWERRIGHT:
      return 45;
    case J.PIXEL.Directions.DOWN:
      return 90;
    case J.PIXEL.Directions.LOWERLEFT:
      return 135;
    case J.PIXEL.Directions.LEFT:
      return 180;
    case J.PIXEL.Directions.UPPERLEFT:
      return 225;
    case J.PIXEL.Directions.UP:
      return 270;
    case J.PIXEL.Directions.UPPERRIGHT:
      return 315;
    default:
      return 0;
  }
};

/**
 * Overrides {@link Game_Player.moveByInput}.<br>
 * The meat and potatoes for pixel movement of the player.
 * Handles keyboard/gamepad directional input and click-to-move via destination coordinates.
 */
Game_Player.prototype.moveByInput = function()
{
  // determine if we should be moving when we are not.
  const notMovingButShouldBe = (!this.isMoving() || this.isMovePressed());

  // check if we should be moving when we're not, and actually can.
  if (notMovingButShouldBe && this.canMove())
  {
    // check the direction the player is pressing.
    let direction = Input.dir8;

    // make sure we are not just sitting there.
    if (direction > 0)
    {
      // clear the point-click destination.
      $gameTemp.clearDestination();

      // check if vector movement is active and we have a valid angle.
      const vectorAngle = this.getVectorInputAngle();

      if (vectorAngle !== null)
      {
        // use vector movement for smooth angle-based displacement.
        const moved = this.vectorMoveByAngle(vectorAngle);

        if (moved)
        {
          // keep followers in sync with vector movement.
          this.processFollowersPixelMoving();

          // flag that we're moving.
          this.setMovePressed(true);
        }
        else
        {
          // stop followers and release flag on block.
          this.stopFollowersPixelMoving();
          this.setMovePressed(false);
          this.checkEventTriggerTouchFront(direction);
        }

        // stop processing.
        return;
      }

      // check if the input is NOT being pressed.
      if (!this.isMovePressed())
      {
        // clear the collection of points.
        this.clearPositionalRecords();

        // grab the collection of followers.
        const followers = this._followers._data;

        // also reset their positions.
        followers.forEach(follower => follower.clearPositionalRecords());
      }

      // flag that movement was not successful.
      this.setMovementSuccess(false);

      // determine the actual direction.
      direction = this.pixelMoveByInput(direction);

      // if we have a direction, assign it to ourselves.
      if (direction > 0)
      {
        // set the new direction.
        this.setDirection(direction);
      }

      // check if we've succeeded in moving somehow.
      if (this.isMovementSucceeded())
      {
        // move the followers with the player.
        this.processFollowersPixelMoving();

        // flag that we're holding the button.
        this.setMovePressed(true);
      }
      // we haven't succeeded in moving.
      else
      {
        // halt the followers pixel movement.
        this.stopFollowersPixelMoving();

        // toggle the input to false since we're not pushing the button.
        this.setMovePressed(false);

        // check if we triggered an event infront of the player.
        this.checkEventTriggerTouchFront(direction);
      }

      // stop processing.
      return;
    }

    // handle a pending click-to-move destination if no key is pressed.
    if ($gameTemp.isDestinationValid())
    {
      // attempt to move toward the destination via pixel-aware pathing.
      this.pixelMoveTowardDestination();

      // stop processing regardless of whether we moved.
      return;
    }
  }

  // don't actually move the followers.
  this.stopFollowersPixelMoving();

  // toggle the input to false since we're not pushing the button.
  this.setMovePressed(false);
};

/**
 * Moves the player one pixel step toward the current click-to-move destination.
 * Clears the destination when the player arrives at the target tile.
 */
Game_Player.prototype.pixelMoveTowardDestination = function()
{
  // acquire the destination tile coordinates.
  const destX = $gameTemp.destinationX();
  const destY = $gameTemp.destinationY();

  // compute the rounded player position for arrival check.
  const roundX = Math.round(this.x);
  const roundY = Math.round(this.y);

  // if we have arrived at the destination tile, clear it.
  if (roundX === destX && roundY === destY)
  {
    // destination reached; clear it so we stop pathing.
    $gameTemp.clearDestination();

    // stop followers from moving since we have arrived.
    this.stopFollowersPixelMoving();

    // release the move-pressed flag.
    this.setMovePressed(false);

    // stop processing.
    return;
  }

  // use tile A* to derive the next cardinal direction toward the destination.
  const dir = this.findDirectionTo(destX, destY);

  // if no path was found, give up and clear the destination.
  if (dir === 0)
  {
    // unreachable destination; clear it.
    $gameTemp.clearDestination();

    // stop followers.
    this.stopFollowersPixelMoving();

    // release the move-pressed flag.
    this.setMovePressed(false);

    // stop processing.
    return;
  }

  // reset movement success before attempting the step.
  this.setMovementSuccess(false);

  // execute the pixel step in the A*-derived direction.
  const facedDirection = this.pixelMoveByInput(dir);

  // update facing if a direction was returned.
  if (facedDirection > 0)
  {
    // face the direction of travel.
    this.setDirection(facedDirection);
  }

  // if the step succeeded, keep followers in sync.
  if (this.isMovementSucceeded())
  {
    // move the followers with the player.
    this.processFollowersPixelMoving();

    // flag that we're moving toward a destination.
    this.setMovePressed(true);
  }
  else
  {
    // step failed; stop followers and release move flag.
    this.stopFollowersPixelMoving();
    this.setMovePressed(false);
  }
};

/**
 * Extends {@link #onStep}.<br>
 * Also processes on-step effects for the player.
 */
J.PIXEL.Aliased.Game_Player.set('onStep', Game_Player.prototype.onStep);
Game_Player.prototype.onStep = function()
{
  // perform original logic.
  J.PIXEL.Aliased.Game_Player.get('onStep')
    .call(this);

  // also process a step.
  this.handleOnStepEffects();
};

/**
 * Handles the various things to do on-step.
 */
Game_Player.prototype.handleOnStepEffects = function()
{
  // increases the step counter.
  this.increaseSteps();

  // checks if there is an event to trigger at this location.
  this.checkEventTriggerHere([ 1, 2 ]);
};

/**
 * Processes the pixel movement for followers.
 */
Game_Player.prototype.processFollowersPixelMoving = function()
{
  // Update the position for the player.
  this.recordPixelPosition();

  // Grab all the followers the player has.
  const followers = this._followers._data;

  // Iterate over all the followers to do movement things.
  followers.forEach((follower, index) =>
  {
    // If Ally AI is present and this follower is AI-controlled, do not relocate via follower-train.
    if (J.ABS.EXT.ALLYAI && follower.getJabsBattler()) return;

    // Determine who the previous character was in the sequence.
    const precedingCharacter = index > 0
      ? followers.at(index - 1)
      : $gamePlayer;

    // Update the follower's direction.
    follower.pixelFaceCharacter(precedingCharacter);

    // Move the follower along the player's breadcrumb trail (vanilla-style train).
    const last = precedingCharacter.oldestPositionalRecord();
    if (last)
    {
      // Move the follower to the new location.
      follower.relocate(last.x, last.y);
    }

    // Flag the follower as holding the button.
    follower.startPixelMoving();
  });
};

/**
 * Stops the pixel movement for followers.
 */
Game_Player.prototype.stopFollowersPixelMoving = function()
{
  // Iterate over the followers and halt their pixel movement.
  this._followers._data.forEach(follower =>
  {
    // If Ally AI is present and this follower is AI-controlled, do not interfere.
    if (J.ABS.EXT.ALLYAI && follower.getJabsBattler()) return;

    // Otherwise, stop pixel moving to prevent residual drift.
    follower.stopPixelMoving();
  });
};

/**
 * Overrides {@link Game_CharacterBase.getCollisionPivotY}.<br>
 * Anchors the player's collision center near their feet rather than the tile center.
 * This gives the implied top-down perspective its natural depth feel: the player can
 * slide closer to objects from below (approaching northward) and is gently blocked
 * sooner from above (approaching southward), matching visual depth expectations.
 * @returns {number} The Y pivot offset in tile units.
 */
Game_Player.prototype.getCollisionPivotY = function()
{
  return 0.70;
};
//endregion Game_Player

//region Sprite_PixelCollisionOverlay
/**
 * A sprite that visualizes the PIXEL subcell collision table and the player's hitbox.
 * Draws only the currently visible subcells for performance.
 */
function Sprite_PixelCollisionOverlay()
{
  // Initialize Sprite base.
  this.initialize(...arguments);
}

// Inherit from Sprite.
Sprite_PixelCollisionOverlay.prototype = Object.create(Sprite.prototype);
Sprite_PixelCollisionOverlay.prototype.constructor = Sprite_PixelCollisionOverlay;

/**
 * Initializes the overlay's bitmap and configuration.
 */
Sprite_PixelCollisionOverlay.prototype.initialize = function()
{
  // Perform the base sprite initialization.
  Sprite.prototype.initialize.call(this);

  // Create a bitmap that at least covers the screen.
  this.bitmap = new Bitmap(Graphics.width, Graphics.height);

  // Ensure the overlay sits above the tilemap but below topmost UI.
  this.z = 10;

  // Disable smoothing for crisp subcell rectangles.
  this.bitmap.smooth = false;

  // Track a small throttle counter for redraw frequency.
  this._throttle = 0;

  // Track last display coords to minimize redraws.
  this._lastDisplayX = -9999;
  this._lastDisplayY = -9999;

  // Track last player x/y to detect movement.
  this._lastPlayerX = -9999;
  this._lastPlayerY = -9999;

  // Whether to draw faint grid lines over subcells.
  this._showGridLines = true;

  // Semi-transparent overall opacity so map remains visible.
  this.opacity = 180;
};

/**
 * Updates the overlay each frame.
 */
Sprite_PixelCollisionOverlay.prototype.update = function()
{
  // Perform base update.
  Sprite.prototype.update.call(this);

  // Skip all logic (including the throttled redraw) when the overlay is hidden.
  // Without this guard the bitmap.clear() + fillRect storm runs every 6 frames
  // regardless of visibility, costing ~30fps on its own.
  if (this.visible === false) return;

  // If map or data not present, do nothing.
  if (!$gameMap || !$dataMap)
  {
    // Nothing to draw.
    return;
  }

  // Position the overlay to stick to the map's display origin.
  const tw = $gameMap.tileWidth();
  const th = $gameMap.tileHeight();
  const dx = $gameMap.displayX();
  const dy = $gameMap.displayY();
  this.x = -Math.floor(dx * tw);
  this.y = -Math.floor(dy * th);

  // Throttle redraw to every 6 frames.
  this._throttle++;
  const needThrottleRedraw = (this._throttle % 6) === 0;

  // Detect camera or player motion to request redraw.
  const cameraMoved = (dx !== this._lastDisplayX) || (dy !== this._lastDisplayY);
  const player = $gamePlayer;
  const playerMoved = player && (player.x !== this._lastPlayerX || player.y !== this._lastPlayerY);

  // If neither throttle nor relevant movement, skip.
  if (!needThrottleRedraw && cameraMoved === false && playerMoved === false)
  {
    // Avoid unnecessary redraws.
    return;
  }

  // Cache state for next frame.
  this._lastDisplayX = dx;
  this._lastDisplayY = dy;
  if (player)
  {
    // Cache the player position for next frame.
    this._lastPlayerX = player.x;
    this._lastPlayerY = player.y;
  }

  // Redraw the visible region.
  this.redrawVisibleRegion();
};

/**
 * Redraws the bitmap for the currently visible region of the map.
 */
Sprite_PixelCollisionOverlay.prototype.redrawVisibleRegion = function()
{
  // Clear the previous frame.
  this.bitmap.clear();

  // Ensure collision config exists.
  if (PIXEL_CollisionManager.collisionStepCount === undefined)
  {
    // Initialize with defaults if not present.
    PIXEL_CollisionManager.initConfig();
  }

  // Acquire basic dims and steps.
  const stepCount = PIXEL_CollisionManager.collisionStepCount;
  const subSizeX = $gameMap.tileWidth() / stepCount;
  const subSizeY = $gameMap.tileHeight() / stepCount;

  // Determine visible tile rectangle.
  const tw = $gameMap.tileWidth();
  const th = $gameMap.tileHeight();
  const dx = $gameMap.displayX();
  const dy = $gameMap.displayY();
  const tilesWide = Math.ceil(Graphics.width / tw) + 2;
  const tilesHigh = Math.ceil(Graphics.height / th) + 2;

  // Compute start/end integer tiles.
  const tileStartX = Math.floor(dx);
  const tileStartY = Math.floor(dy);
  const tileEndX = Math.min(tileStartX + tilesWide, $gameMap.width());
  const tileEndY = Math.min(tileStartY + tilesHigh, $gameMap.height());

  // Draw subcells for each visible integer tile.
  for (let ty = tileStartY; ty < tileEndY; ty++)
  {
    // For each row of tiles, iterate subrows.
    for (let tx = tileStartX; tx < tileEndX; tx++)
    {
      // For each subrow in this tile.
      for (let sy = 0; sy < stepCount; sy++)
      {
        // Compute world subcell y coordinate in tile units.
        const subWorldY = ty + (sy / stepCount);

        // Precompute pixel y for this subrow.
        const py = Math.floor((subWorldY - dy) * th);

        // For each subcolumn in this tile.
        for (let sx = 0; sx < stepCount; sx++)
        {
          // Compute world subcell x coordinate in tile units.
          const subWorldX = tx + (sx / stepCount);

          // Lookup the collision code from the table.
          const code = this._readCode(subWorldX, subWorldY);

          // Acquire the color for this code.
          const color = this._colorForCode(code);

          // If no color (treat as transparent open), skip paint to keep perf.
          if (!color)
          {
            // Skip painting transparent subcells.
            continue;
          }

          // Compute pixel x for this subcell.
          const px = Math.floor((subWorldX - dx) * tw);

          // Draw the subcell rectangle with the code color.
          this.bitmap.fillRect(px, py, Math.ceil(subSizeX), Math.ceil(subSizeY), color);
        }
      }
    }
  }

  // Optionally draw faint subgrid lines to help visualize seams.
  if (this._showGridLines)
  {
    // Draw vertical and horizontal subcell grid lines.
    this._drawGridLines(tileStartX, tileStartY, tileEndX, tileEndY, stepCount, tw, th, dx, dy);
  }

  // Draw the player's hitbox on top.
  this._drawPlayerHitbox();

  // Also draw any one-frame sample traces provided by movement checks.
  this._drawSampleTraces();

  // Clear samples after drawing so next frame starts fresh.
  J.PIXEL.Debug.clear();
};

/**
 * Reads a code from the collision table for a fractional tile coordinate.
 * @param {number} subWorldX The fractional tile x.
 * @param {number} subWorldY The fractional tile y.
 * @returns {number} The stored code (or Open if missing).
 */
Sprite_PixelCollisionOverlay.prototype._readCode = function(subWorldX, subWorldY)
{
  // Acquire the table index for this coordinate.
  const idx = PIXEL_CollisionManager._index(subWorldX, subWorldY);

  // Return the code or default to Open if not present.
  return PIXEL_CollisionManager._table[idx] || PIXEL_CollisionManager.Codes.Open;
};

/**
 * Maps collision codes to semi-transparent colors for display.
 * @param {number} code The collision code.
 * @returns {string|null} A CSS color string, or null for transparent skip.
 */
Sprite_PixelCollisionOverlay.prototype._colorForCode = function(code)
{
  // Use a switch for clarity.
  switch (code)
  {
    // Open subcells are transparent; return null to skip the fillRect entirely.
    case PIXEL_CollisionManager.Codes.Open:
      return null;

    // Solid areas are strong red.
    case PIXEL_CollisionManager.Codes.Solid:
      return "rgba(255, 0, 0, 0.35)";

    // Vertical line blockers (Up/Down) are blue.
    case PIXEL_CollisionManager.Codes.VerticalLine:
      return "rgba(40, 120, 255, 0.35)";

    // Horizontal line blockers (Left/Right) are cyan.
    case PIXEL_CollisionManager.Codes.HorizontalLine:
      return "rgba(0, 220, 220, 0.35)";

    // Left edge blocker is orange.
    case PIXEL_CollisionManager.Codes.EdgeLeft:
      return "rgba(255, 140, 0, 0.40)";

    // Right edge blocker is darker orange.
    case PIXEL_CollisionManager.Codes.EdgeRight:
      return "rgba(255, 110, 0, 0.40)";

    // Bottom edge blocker is magenta.
    case PIXEL_CollisionManager.Codes.EdgeDown:
      return "rgba(220, 0, 180, 0.40)";

    // Top edge blocker is purple.
    case PIXEL_CollisionManager.Codes.EdgeUp:
      return "rgba(180, 0, 220, 0.40)";

    // Corners are yellow.
    case PIXEL_CollisionManager.Codes.CornerBottomLeft:
    case PIXEL_CollisionManager.Codes.CornerBottomRight:
    case PIXEL_CollisionManager.Codes.CornerTopLeft:
    case PIXEL_CollisionManager.Codes.CornerTopRight:
      return "rgba(255, 255, 0, 0.40)";

    // Unknown: pale gray.
    default:
      return "rgba(200, 200, 200, 0.25)";
  }
};

/**
 * Draws faint subgrid lines to visualize seam alignment.
 * @param {number} tileStartX Start tile x.
 * @param {number} tileStartY Start tile y.
 * @param {number} tileEndX End tile x.
 * @param {number} tileEndY End tile y.
 * @param {number} stepCount Subcells per tile edge.
 * @param {number} tw Tile width in pixels.
 * @param {number} th Tile height in pixels.
 * @param {number} dx Display origin x in tiles.
 * @param {number} dy Display origin y in tiles.
 */
Sprite_PixelCollisionOverlay.prototype._drawGridLines = function(
  tileStartX,
  tileStartY,
  tileEndX,
  tileEndY,
  stepCount,
  tw,
  th,
  dx,
  dy)
{
  // Choose line colors.
  const tileLine = "rgba(255,255,255,0.12)";
  const subLine = "rgba(255,255,255,0.06)";

  // Compute pixel boundaries.
  const pxStart = Math.floor((tileStartX - dx) * tw);
  const pyStart = Math.floor((tileStartY - dy) * th);
  const pxEnd = Math.ceil((tileEndX - dx) * tw);
  const pyEnd = Math.ceil((tileEndY - dy) * th);

  // Draw tile grid verticals.
  for (let tx = tileStartX; tx <= tileEndX; tx++)
  {
    // Compute pixel x for this tile boundary.
    const px = Math.floor((tx - dx) * tw);

    // Draw the tile vertical line.
    this.bitmap.fillRect(px, pyStart, 1, pyEnd - pyStart, tileLine);

    // Draw subcell verticals within the tile.
    for (let s = 1; s < stepCount; s++)
    {
      // Compute pixel x for subcell seam.
      const psx = Math.floor((tx - dx) * tw + (s * (tw / stepCount)));

      // Draw the subcell vertical line.
      this.bitmap.fillRect(psx, pyStart, 1, pyEnd - pyStart, subLine);
    }
  }

  // Draw tile grid horizontals.
  for (let ty = tileStartY; ty <= tileEndY; ty++)
  {
    // Compute pixel y for this tile boundary.
    const py = Math.floor((ty - dy) * th);

    // Draw the tile horizontal line.
    this.bitmap.fillRect(pxStart, py, pxEnd - pxStart, 1, tileLine);

    // Draw subcell horizontals within the tile.
    for (let s = 1; s < stepCount; s++)
    {
      // Compute pixel y for subcell seam.
      const psy = Math.floor((ty - dy) * th + (s * (th / stepCount)));

      // Draw the subcell horizontal line.
      this.bitmap.fillRect(pxStart, psy, pxEnd - pxStart, 1, subLine);
    }
  }
};

/**
 * Draws the player's collision hitbox rectangle over the overlay.
 */
Sprite_PixelCollisionOverlay.prototype._drawPlayerHitbox = function()
{
  // If no player, skip.
  if (!$gamePlayer)
  {
    // Nothing to draw if no player exists.
    return;
  }

  // Get the player center position using the same pivot used by collision.
  const cx = $gamePlayer.x + $gamePlayer.getCollisionPivotX();
  const cy = $gamePlayer.y + $gamePlayer.getCollisionPivotY();

  // Get the effective (pivot-clamped) collision radius.
  const radius = $gamePlayer.getEffectiveRadius();

  // Build the hitbox from the radius.
  const hb = $gamePlayer._pixelHitbox(radius);

  // Compute world-space rectangle corners in tiles.
  const left = cx + hb.hx;
  const top = cy + hb.hy;
  const widthTiles = hb.w;
  const heightTiles = hb.h;

  // Convert to pixels based on map display origin.
  const tw = $gameMap.tileWidth();
  const th = $gameMap.tileHeight();
  const dx = $gameMap.displayX();
  const dy = $gameMap.displayY();
  const px = Math.floor((left - dx) * tw);
  const py = Math.floor((top - dy) * th);
  const pw = Math.ceil(widthTiles * tw);
  const ph = Math.ceil(heightTiles * th);

  // Draw the outline rectangle for the hitbox.
  this._strokeRect(px, py, pw, ph, "rgba(0, 255, 0, 0.9)");

  // Draw a small cross at the pivot.
  const cxp = Math.floor(((cx - dx) * tw));
  const cyp = Math.floor(((cy - dy) * th));
  this.bitmap.fillRect(cxp - 2, cyp, 5, 1, "rgba(0,255,0,0.9)");
  this.bitmap.fillRect(cxp, cyp - 2, 1, 5, "rgba(0,255,0,0.9)");
};

/**
 * Draws one-frame sample traces emitted by the collision checks.
 */
Sprite_PixelCollisionOverlay.prototype._drawSampleTraces = function()
{
  // If no debug container or no samples, skip.
  if (!J.PIXEL.Debug) return;
  const dbg = J.PIXEL.Debug;
  if (!dbg.samples || dbg.samples.length === 0) return;

  // Acquire pixel conversion.
  const tw = $gameMap.tileWidth();
  const th = $gameMap.tileHeight();
  const dx = $gameMap.displayX();
  const dy = $gameMap.displayY();

  // Compute subcell pixel sizes for a tiny highlight.
  if (PIXEL_CollisionManager.collisionStepCount === undefined) PIXEL_CollisionManager.initConfig();
  const step = PIXEL_CollisionManager.collisionStepCount;
  const subW = Math.max(2, Math.ceil(tw / step) - 1);
  const subH = Math.max(2, Math.ceil(th / step) - 1);

  // Draw each sample as a small rectangle in its color.
  dbg.samples.forEach(s =>
  {
    const px = Math.floor((s.x - dx) * tw);
    const py = Math.floor((s.y - dy) * th);
    this.bitmap.fillRect(px, py, subW, subH, s.color);
  });
};

/**
 * Draws a 1px rectangle stroke.
 * @param {number} x The x in pixels.
 * @param {number} y The y in pixels.
 * @param {number} w The width in pixels.
 * @param {number} h The height in pixels.
 * @param {string} color The CSS color.
 */
Sprite_PixelCollisionOverlay.prototype._strokeRect = function(x, y, w, h, color)
{
  // Draw top edge.
  this.bitmap.fillRect(x, y, w, 1, color);

  // Draw bottom edge.
  this.bitmap.fillRect(x, y + h - 1, w, 1, color);

  // Draw left edge.
  this.bitmap.fillRect(x, y, 1, h, color);

  // Draw right edge.
  this.bitmap.fillRect(x + w - 1, y, 1, h, color);
};
//endregion Sprite_PixelCollisionOverlay

//region Spriteset_Map
/**
 * Extends {@link Spriteset_Map.createUpperLayer}.<br/>
 * Creates the PIXEL collision overlay sprite and adds it to the spriteset.
 */
J.PIXEL.Aliased.Spriteset_Map.set("createUpperLayer", Spriteset_Map.prototype.createUpperLayer);
Spriteset_Map.prototype.createUpperLayer = function()
{
  // Perform original createUpperLayer logic.
  J.PIXEL.Aliased.Spriteset_Map.get("createUpperLayer")
    .call(this);

  // Add the PIXEL collision overlay.
  this.createPixelCollisionOverlay();
};

/**
 * Creates the PIXEL collision overlay sprite and adds it as a child.
 */
Spriteset_Map.prototype.createPixelCollisionOverlay = function()
{
  // Ensure the key mapping for toggle exists.
  this.setupPixelOverlayKeymap();

  // Initialize visibility from plugin metadata (defaults to false if not configured).
  const initialVisibility = (J.PIXEL && J.PIXEL.Metadata)
    ? J.PIXEL.Metadata.OverlayInitiallyVisible
    : false;
  this._pixelOverlayVisible = this._pixelOverlayVisible || initialVisibility;

  // Keep debug sample collection in sync with initial visibility.
  J.PIXEL.Debug.enabled = this._pixelOverlayVisible;

  // Create the overlay sprite.
  this._pixelCollisionOverlay = new Sprite_PixelCollisionOverlay();

  // Set initial visibility.
  this._pixelCollisionOverlay.visible = this._pixelOverlayVisible;

  // Add to the spriteset on the upper layer.
  this.addChild(this._pixelCollisionOverlay);
};

/**
 * Ensures a key is mapped for toggling the overlay.
 * Uses the backslash key (keyCode 220) by default.
 */
Spriteset_Map.prototype.setupPixelOverlayKeymap = function()
{
  // If no mapping for 'pixelOverlay' exists, add one.
  if (!Input.keyMapper[220])
  {
    // Map the backslash key to a custom symbol.
    Input.keyMapper[220] = "pixelOverlay";
  }
};

/**
 * Extends {@link Spriteset_Map.update}.<br/>
 * Handles toggle input and forwards updates to the overlay.
 */
J.PIXEL.Aliased.Spriteset_Map.set("update", Spriteset_Map.prototype.update);
Spriteset_Map.prototype.update = function()
{
  // Perform original update logic.
  J.PIXEL.Aliased.Spriteset_Map.get("update")
    .call(this);

  // If toggle pressed, flip visibility.
  if (Input.isTriggered("pixelOverlay"))
  {
    // Flip the overlay visibility flag.
    this._pixelOverlayVisible = !this._pixelOverlayVisible;

    // Apply to the overlay sprite if it exists.
    if (this._pixelCollisionOverlay)
    {
      // Toggle the visibility.
      this._pixelCollisionOverlay.visible = this._pixelOverlayVisible;
    }

    // Sync the debug sample collection to overlay visibility.
    // When the overlay is hidden, no samples need to be pushed, eliminating
    // the per-frame object allocation in all _pixelCheck* probe loops.
    J.PIXEL.Debug.enabled = this._pixelOverlayVisible;
  }
};
//endregion Spriteset_Map

//# sourceMappingURL=J-Pixelistics.js.map
