/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 PIXEL] WIP Enables pixel movement.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @help
 * ==============================================================================
 * Enables 8-directional pixel movement.
 *
 * This is a Work In Progress.
 *
 * This is almost entirely complete as a functional pixel movement plugin, but
 * I encountered some issues that I just couldn't solve.
 *
 * The current issues of the plugin are:
 *
 * The Hitbox of player is anchored to the top left point (0,0) of the character
 * sprite image, resulting in your average character sprite looking like it was
 * able to step about half of a tile onto impassible terrain from the left/top,
 * and getting blocked prematurely about a half of a tile by invisible terrain
 * when approaching impassible terrain from the bottom/right.
 *
 * Additional modifications will be necessary to accommodate action sprites in
 * JABS as they aren't adapted currently and will travel very little distance if
 * they are projectiles with fixed distance.
 *
 * Additional modifications will be necessary to accommodate events and their
 * movement routes with respect to pixel movement.
 * ==============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ==============================================================================
 * As a courtesy, the plugin started as:
 * https://github.com/gsioteam/rmmz_movement
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

//region metadata
/**
 * The over-arching extensions collection for JABS.
 */
J.ABS.EXT ||= {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.PIXEL = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.PIXEL.Metadata = {};
J.ABS.EXT.PIXEL.Metadata.Version = '1.0.0';
J.ABS.EXT.PIXEL.Metadata.Name = `J-ABS-PixelMovement`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.PIXEL.PluginParameters = PluginManager.parameters(J.ABS.EXT.PIXEL.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.PIXEL.Aliased = {
  Game_Character: new Map(),
  Game_CharacterBase: new Map(),
  Game_Follower: new Map(),
  Game_Map: new Map(),
  Game_Player: new Map(),

  JABS_AiManager: new Map(),

  Spriteset_Map: new Map(),
};
//endregion metadata

/**
 * A small debug container for one-frame collision sampling traces.
 */
J.ABS.EXT.PIXEL.Debug = {
  /** @type {{x:number,y:number,color:string}[]} */
  samples: [],

  /**
   * Queues a subcell sample to be drawn this frame by the overlay.
   * @param {number} x Fractional tile x (seam-aligned).
   * @param {number} y Fractional tile y (seam-aligned).
   * @param {string} color A rgba color string.
   */
  push(x, y, color)
  {
    this.samples.push({ x, y, color });
  },

  /** Clears samples at end-of-frame. */
  clear()
  {
    this.samples.length = 0;
  }
};

//region JABS_AiManager
/**
 * Keeps allies within leash range of the leader, even during combat.
 * If beyond leash, snap back and clear movement to avoid drift.
 * @param {JABS_Battler} allyBattler The ally battler.
 */
J.ABS.EXT.PIXEL.Aliased.JABS_AiManager.set("rubberbandAlly", JABS_AiManager.rubberbandAlly);
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
J.ABS.EXT.PIXEL.Aliased.JABS_AiManager.set("moveTowardSlotIfNeeded", JABS_AiManager.moveTowardSlotIfNeeded);
JABS_AiManager.moveTowardSlotIfNeeded = function(allyBattler, desiredX, desiredY)
{
  // acquire the character once.
  const chr = allyBattler.getCharacter();

  // resolve tolerances.
  let tolerance = 0.45; // default if ALLYAI not present.
  let hysteresis = 0.25; // extra ring outside tolerance for gentle throttling near target.
  if (J.ABS.EXT.ALLYAI && J.ABS.EXT.ALLYAI.Metadata)
  {
    // use the configured formation tolerance if available.
    tolerance = J.ABS.EXT.ALLYAI.Metadata.FormationTolerance;

    // use the configured hysteresis if available.
    hysteresis = 0.25;
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

/**
 * Extends {@link #moveTowardSlotIfNeeded}.<br/>
 * Replaces movement with PIXEL-aware hysteresis and near-target throttling to prevent sliding.
 * This implementation does NOT call the original; it fully handles formation movement.
 * @param {JABS_Battler} allyBattler The ally battler.
 * @param {number} desiredX The desired slot x (fractional center).
 * @param {number} desiredY The desired slot y (fractional center).
 */
J.ABS.EXT.PIXEL.Aliased.JABS_AiManager.set("moveTowardSlotIfNeeded", JABS_AiManager.moveTowardSlotIfNeeded);
JABS_AiManager.moveTowardSlotIfNeeded = function(allyBattler, desiredX, desiredY)
{
  // acquire the character once.
  const chr = allyBattler.getCharacter();

  // resolve tolerances.
  let tolerance = 0.45; // default if ALLYAI not present.
  let hysteresis = 0.25; // extra ring outside tolerance for gentle throttling near target.
  if (J.ABS.EXT.ALLYAI && J.ABS.EXT.ALLYAI.Metadata)
  {
    tolerance = J.ABS.EXT.ALLYAI.Metadata.FormationTolerance;
    hysteresis = 0.25;
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
    if (chr.isPixelOnCooldown && chr.isPixelOnCooldown())
    {
      // do not move this frame while on cooldown.
      return;
    }

    // if able to move, issue a single smart step and set a short cooldown.
    if (allyBattler.canBattlerMove())
    {
      allyBattler.smartMoveTowardCoordinates(desiredX, desiredY);

      // set a short, local cooldown (1 frame) to reduce micro-steps and sliding.
      if (!chr._j) chr._j = {};
      chr._j._pixelMoveCooldown = 1;
    }

    // done processing near-range.
    return;
  }

  // we are far enough away: move every frame without throttling for responsiveness.
  if (allyBattler.canBattlerMove())
  {
    allyBattler.smartMoveTowardCoordinates(desiredX, desiredY);
  }
};
//endregion JABS_AiManager

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
   */
  static initConfig()
  {
    // Define how many subcells per tile axis will be used (1, 2, or 4).
    this.collisionStepCount = 4;

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
    if (!this.collisionStepCount)
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
        // Determine whether moving down is allowed from this tile.
        const passDown = $gameMap.isPassable(x, y, J.ABS.Directions.DOWN);

        // Determine whether moving left is allowed from this tile.
        const passLeft = $gameMap.isPassable(x, y, J.ABS.Directions.LEFT);

        // Determine whether moving right is allowed from this tile.
        const passRight = $gameMap.isPassable(x, y, J.ABS.Directions.RIGHT);

        // Determine whether moving up is allowed from this tile.
        const passUp = $gameMap.isPassable(x, y, J.ABS.Directions.UP);

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
    if (d === J.ABS.Directions.DOWN || d === J.ABS.Directions.UP)
    {
      // Compute the subrow for bottom or top.
      const subY = (d === J.ABS.Directions.DOWN)
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
    const subX = (d === J.ABS.Directions.RIGHT)
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
    const subY = (vert === J.ABS.Directions.DOWN)
      ? (y + 1 - step)
      : y;

    // Compute the subcolumn for left or right.
    const subX = (horz === J.ABS.Directions.RIGHT)
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
      this._drawEdge(x, y, J.ABS.Directions.LEFT, this.Codes.EdgeLeft);
    }

    // If right is blocked, draw the right edge line.
    if (passRight === false)
    {
      // Draw the right boundary as an edge blocker.
      this._drawEdge(x, y, J.ABS.Directions.RIGHT, this.Codes.EdgeRight);
    }

    // If down is blocked, draw bottom edge and corners as needed.
    if (passDown === false)
    {
      // Draw the bottom boundary as an edge blocker.
      this._drawEdge(x, y, J.ABS.Directions.DOWN, this.Codes.EdgeDown);

      // If left is also blocked, draw the bottom-left corner.
      if (passLeft === false)
      {
        // Place a single blocked subcell in the bottom-left corner.
        this._drawCorner(x, y, J.ABS.Directions.LEFT, J.ABS.Directions.DOWN, this.Codes.CornerBottomLeft);
      }

      // If right is also blocked, draw the bottom-right corner.
      if (passRight === false)
      {
        // Place a single blocked subcell in the bottom-right corner.
        this._drawCorner(x, y, J.ABS.Directions.RIGHT, J.ABS.Directions.DOWN, this.Codes.CornerBottomRight);
      }
    }

    // If up is blocked, draw top edge and corners as needed.
    if (passUp === false)
    {
      // Draw the top boundary as an edge blocker.
      this._drawEdge(x, y, J.ABS.Directions.UP, this.Codes.EdgeUp);

      // If left is also blocked, draw the top-left corner.
      if (passLeft === false)
      {
        // Place a single blocked subcell in the top-left corner.
        this._drawCorner(x, y, J.ABS.Directions.LEFT, J.ABS.Directions.UP, this.Codes.CornerTopLeft);
      }

      // If right is also blocked, draw the top-right corner.
      if (passRight === false)
      {
        // Place a single blocked subcell in the top-right corner.
        this._drawCorner(x, y, J.ABS.Directions.RIGHT, J.ABS.Directions.UP, this.Codes.CornerTopRight);
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
  static _mergeSingleTile(blockUp, blockDown, blockLeft, blockRight)
  {
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
  static isPositionPassable(px, py, d)
  {
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
      if (d === J.ABS.Directions.UP || d === J.ABS.Directions.DOWN)
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
      if (d === J.ABS.Directions.LEFT || d === J.ABS.Directions.RIGHT)
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
      return d !== J.ABS.Directions.LEFT;
    }
    if (code === this.Codes.EdgeRight)
    {
      // Block entering from the RIGHT.
      return d !== J.ABS.Directions.RIGHT;
    }
    if (code === this.Codes.EdgeDown)
    {
      // Block entering from DOWN.
      return d !== J.ABS.Directions.DOWN;
    }
    if (code === this.Codes.EdgeUp)
    {
      // Block entering from UP.
      return d !== J.ABS.Directions.UP;
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
 * A tile-space anchor for collision sampling.
 * @type {number}
 */
PIXEL_CollisionManager.AnchorX = 0;

/**
 * A tile-space anchor for collision sampling.
 * @type {number}
 */
PIXEL_CollisionManager.AnchorY = 0;

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

/**
 * Extends {@link processMoveCommand}.<br>
 * Ensures when move routes are being processed, that we adjust the x,y coordinates.
 * @param {rm.types.EventCommand} command The commands associated with this movement.
 */
J.ABS.EXT.PIXEL.Aliased.Game_Character.set('processMoveCommand', Game_Character.prototype.processMoveCommand);
Game_Character.prototype.processMoveCommand = function(command)
{
  // when processing move routes, we are never pressing the move input.
  this.setMovePressed(false);

  // check if an event is manipulating movement.
  if ($gameMap.isEventRunning())
  {
    // round the x,y coordinates to move correctly.
    this._x = Math.round(this.x);
    this._y = Math.round(this.y);
  }

  // perform the original logic.
  J.ABS.EXT.PIXEL.Aliased.Game_Character.get('processMoveCommand')
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

//region Game_CharacterBase
//region init
/**
 * Extends {@link Game_CharacterBase.initMembers}.<br>
 * Includes this plugin's extra properties as well.
 */
J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.set('initMembers', Game_CharacterBase.prototype.initMembers);
Game_CharacterBase.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.get('initMembers')
    .call(this);

  // initialize the additional members.
  this.initPixelMovementMembers();
};

/**
 * Initializes the new members related to this plugin.
 */
Game_CharacterBase.prototype.initPixelMovementMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * The collection for tracking the {@link Point} coordinates for all members.
   * This is managed in a first-in-first-out (FIFO) style.
   * @type {Point[]}
   */
  this._j._positionalRecords = [];

  /**
   * Whether or not one of the directional inputs are being held down.
   * @type {boolean} True if at least one direction is being held, false otherwise.
   */
  this._j._movePressing = false;

  /**
   * The move distance for tracking steps.
   * @type {number}
   */
  this._j._moveDistance = 0;

  /**
   * The number of steps this character has taken.
   * @type {number}
   */
  this._j._pixelSteps = 0;

  /**
   * Whether or not we are currently counting pixel steps.
   * @type {boolean}
   */
  this._j._isPixelStepping = false;

  /**
   * The last straight direction we moved while stepping.
   * @type {number}
   */
  this._j._pixelDirection = 0;

  /**
   * The pixel step count at which we stop stepping.
   * @type {number}
   */
  this._j._pixelStepsEnd = 0;

  /**
   * Cooldown frames after a pixel move before another can be issued.
   * Prevents AllyAI from pushing every single frame.
   * @type {number}
   */
  this._j._pixelMoveCooldown = 0;

  /**
   * Flag indicating whether a pixel step occurred this frame.
   * Used to preserve walk animation even when render coords snap each update.
   * @type {boolean}
   */
  this._j._movedThisFrame = false;

  /**
   * The cached direction for the micro-route (if any).
   * @type {number}
   */
  this._j._mrDir = 0;

  /**
   * The remaining frames to apply the cached micro-route direction.
   * @type {number}
   */
  this._j._mrFrames = 0;
};
//endregion init

//region properties
/**
 * Gets the remaining cooldown frames before another pixel move can be issued.
 * @returns {number} The remaining cooldown frames.
 */
Game_CharacterBase.prototype.getPixelMoveCooldown = function()
{
  // Return the remaining cooldown frames for pixel movement.
  return this._j._pixelMoveCooldown;
};

/**
 * Sets the remaining cooldown frames for pixel movement.
 * @param {number} frames The number of frames to set for cooldown.
 */
Game_CharacterBase.prototype.setPixelMoveCooldown = function(frames)
{
  // Assign the new cooldown frame count for pixel movement.
  this._j._pixelMoveCooldown = frames;
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
  this._j._movedThisFrame = moved;
};

/**
 * Gets whether or not this character performed a pixel step this frame.
 * @returns {boolean} True if we moved this frame, false otherwise.
 */
Game_CharacterBase.prototype.didMoveThisFrame = function()
{
  // Return whether or not we moved this frame.
  return this._j._movedThisFrame === true;
};

/**
 * Clears the per-frame pixel movement flag.
 */
Game_CharacterBase.prototype.clearMovedThisFrame = function()
{
  // Reset the frame-based movement flag.
  this._j._movedThisFrame = false;
};

/**
 * Gets the cached micro-route direction.
 * @returns {number} The cached 8-dir code, or 0 if unset.
 */
Game_CharacterBase.prototype.getMicroRouteDirection = function()
{
  // Return the cached micro-route direction.
  return this._j._mrDir;
};

/**
 * Sets the cached micro-route direction.
 * @param {number} newDirection The 8-dir code to cache.
 */
Game_CharacterBase.prototype.setMicroRouteDirection = function(newDirection)
{
  // Assign the new cached micro-route direction.
  this._j._mrDir = newDirection;
};

/**
 * Gets the remaining micro-route frames.
 * @returns {number} The remaining frames for the cached direction.
 */
Game_CharacterBase.prototype.getMicroRouteFrames = function()
{
  // Return how many frames remain for the cached micro-route.
  return this._j._mrFrames;
};

/**
 * Sets the remaining micro-route frames to apply the cached direction.
 * @param {number} frames The number of frames to hold the cached direction.
 */
Game_CharacterBase.prototype.setMicroRouteFrames = function(frames)
{
  // Assign the remaining frames to apply the cached micro-route.
  this._j._mrFrames = frames;
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
  return this._j._positionalRecords;
};

/**
 * Clears the positional cache for characters on the map.
 */
Game_CharacterBase.prototype.clearPositionalRecords = function()
{
  this._j._positionalRecords = [];
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
J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.set("update", Game_CharacterBase.prototype.update);
Game_CharacterBase.prototype.update = function()
{
  // Perform original logic.
  J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.get("update")
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
  return this._j._moveDistance;
};

/**
 * Modifies the move distance by a given amount.
 * @param {number} distance The distance in pixels.
 */
Game_CharacterBase.prototype.modMoveDistance = function(distance)
{
  // modify the move distance by the given amount.
  this._j._moveDistance += distance;
};

/**
 * Gets how many pixel steps this character has taken.
 * @returns {number}
 */
Game_CharacterBase.prototype.pixelSteps = function()
{
  return this._j._pixelSteps;
};

/**
 * Modifies the pixel step counter.
 * @param {number=} steps The number of steps to take; defaults to 1.
 */
Game_CharacterBase.prototype.takePixelSteps = function(steps = 1)
{
  this._j._pixelSteps += steps;
};

/**
 * Clears the number of pixel steps taken by this character.
 */
Game_CharacterBase.prototype.clearPixelSteps = function()
{
  this._j._pixelSteps = 0;
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
  this._j._moveDistance = 0;
};

/**
 * Extends {@link Game_CharacterBase.isMoving}.<br/>
 * Includes whether or not a pixel movement occurred this frame.
 * @returns {boolean}
 */
J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.set("isMoving", Game_CharacterBase.prototype.isMoving);
Game_CharacterBase.prototype.isMoving = function()
{
  // Determine movement per the original engine behavior.
  const original = J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.get("isMoving")
    .call(this);

  // Include pixel-step movement that occurred this frame.
  const movedThisFrame = !!this._j._movedThisFrame;

  // Return whether we are moving per engine or because of a pixel step.
  return original || movedThisFrame;
};

/**
 * Gets whether or not the move input is being pressed.
 * @returns {boolean}
 */
Game_CharacterBase.prototype.isMovePressed = function()
{
  return this._j._movePressing;
};

/**
 * Sets whether or not the move input is being held down.
 * @param {boolean} pressed The new value of whether or not the button is being pressed.
 */
Game_CharacterBase.prototype.setMovePressed = function(pressed)
{
  this._j._movePressing = pressed;
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
 * Manages the coordinates for characters on the map.
 */
Game_CharacterBase.prototype.recordPixelPosition = function()
{
  // grab the most recently added point from the collection.
  const last = this.mostRecentPositionalRecord();

  // a short-hand function for calculating distance between two points.
  const distance = (a, b) =>
  {
    if (!a || !b) return 0;

    return $gameMap.distance(last.x, last.y, this.x, this.y);
  };

  // calculate the distance between
  const deltaDistance = distance(last, this);

  // check if the distance has exceeded the threshold.
  if (deltaDistance > 2)
  {
    // clear the cache.
    this.clearPositionalRecords();
  }
  // check if we are missing any records, or have moved enough.
  else if (!last || deltaDistance > 0.1)
  {
    // TODO: use the Point class?
    const point = {
      x: this.x,
      y: this.y
    }; //new Point(this.x, this.y);

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
  const radius = this.getCollisionRadius();

  // If we ended up overlapping solid tiles after this step, revert the move.
  if (this.isOverlappingSolidTiles(this._x, this._y, radius))
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
    case J.ABS.Directions.DOWN:
      this.moveStraight2Down(pixelDistance);
      break;
    case J.ABS.Directions.LEFT:
      this.moveStraight4Left(pixelDistance);
      break;
    case J.ABS.Directions.RIGHT:
      this.moveStraight6Right(pixelDistance);
      break;
    case J.ABS.Directions.UP:
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
    case J.ABS.Directions.LOWERLEFT:
      this.moveDiagonal1DownLeft(pixelDistance);
      break;
    case J.ABS.Directions.LOWERRIGHT:
      this.moveDiagonal3DownRight(pixelDistance);
      break;
    case J.ABS.Directions.UPPERLEFT:
      this.moveDiagonal7UpLeft(pixelDistance);
      break;
    case J.ABS.Directions.UPPERRIGHT:
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
  this._y += pixelDistance
};

/**
 * Move diagonally down-right the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveDiagonal3DownRight = function(pixelDistance)
{
  this._x += pixelDistance;
  this._y += pixelDistance
};

/**
 * Move diagonally up-left the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveDiagonal7UpLeft = function(pixelDistance)
{
  this._x -= pixelDistance;
  this._y -= pixelDistance
};

/**
 * Move diagonally up-right the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveDiagonal9UpRight = function(pixelDistance)
{
  this._x += pixelDistance;
  this._y -= pixelDistance
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
Game_CharacterBase.prototype.canPassStraight = function(direction, distance = this.distancePerFrame())
{
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
  const subCount = this._pixelCollisionSubCount(distance);

  // Update cached radius-based hitbox.
  const radius = this.getCollisionRadius();

  // Compute hitbox metrics relative to center.
  const hitbox = this._pixelHitbox(radius);

  // Compute the subcell size for substepping.
  const subStepSize = 1 / subCount;

  // Determine the signed unit direction components.
  let dx = 0;
  let dy = 0;
  if (direction === J.ABS.Directions.RIGHT)
  {
    // Moving to the right.
    dx = 1;
  }
  else if (direction === J.ABS.Directions.LEFT)
  {
    // Moving to the left.
    dx = -1;
  }
  else if (direction === J.ABS.Directions.DOWN)
  {
    // Moving downward.
    dy = 1;
  }
  else if (direction === J.ABS.Directions.UP)
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
        $gameMap.isPassable(tx, ty, J.ABS.Directions.DOWN) ||
        $gameMap.isPassable(tx, ty, J.ABS.Directions.LEFT) ||
        $gameMap.isPassable(tx, ty, J.ABS.Directions.RIGHT) ||
        $gameMap.isPassable(tx, ty, J.ABS.Directions.UP);

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
 * Moves straight in a given direction.
 * If there is an underlying diagonal direction, then move diagonally.
 * @param {number} direction The direction being moved.
 */
J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.set('moveStraight', Game_CharacterBase.prototype.moveStraight);
Game_CharacterBase.prototype.moveStraight = function(direction)
{
  // Evaluate pixel-aware straight passability including character collision.
  this.setMovementSuccess(this.canPassStraight(direction));

  // If passable, perform a pixel-distance straight move and face that direction.
  if (this.isMovementSucceeded())
  {
    // Move by the per-frame straight distance in the chosen direction.
    this.movePixelDistance(direction, this.distancePerFrame());

    // Face the direction of travel.
    this.setDirection(direction);
  }
};

/**
 * Moves diagonally in a given direction.
 * If there is an underlying diagonal direction, then move diagonally.
 * @param {number} direction The direction being moved.
 */
J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.set('moveDiagonally', Game_CharacterBase.prototype.moveDiagonally);
Game_CharacterBase.prototype.moveDiagonally = function(horz, vert)
{
  // const [ horz, vert ] = this.getDiagonalDirections(direction);
  this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));

  if (this.isMovementSucceeded())
  {
    const direction = this.directionFromHorzVert(horz, vert);
    this.movePixelDistance(direction, this.diagonalDistancePerFrame());
    this.setDirection(direction);
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
  const canDown = () => this.canPassStraight(J.ABS.Directions.DOWN, straightDistance);
  const canUp = () => this.canPassStraight(J.ABS.Directions.UP, straightDistance);
  const canLeft = () => this.canPassStraight(J.ABS.Directions.LEFT, straightDistance);
  const canRight = () => this.canPassStraight(J.ABS.Directions.RIGHT, straightDistance);

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
      case J.ABS.Directions.LOWERLEFT:
      case J.ABS.Directions.LOWERRIGHT:
      {
        // Face down when going to a lower row.
        this.setDirection(J.ABS.Directions.DOWN);
        return J.ABS.Directions.DOWN;
      }
      case J.ABS.Directions.UPPERLEFT:
      case J.ABS.Directions.UPPERRIGHT:
      {
        // Face up when going to an upper row.
        this.setDirection(J.ABS.Directions.UP);
        return J.ABS.Directions.UP;
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
      case J.ABS.Directions.DOWN:
      case J.ABS.Directions.UP:
      {
        // Re-center X after vertical motion.
        recenterXAfterVertical();
        break;
      }
      case J.ABS.Directions.LEFT:
      case J.ABS.Directions.RIGHT:
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
      case J.ABS.Directions.LOWERLEFT:
      {
        // If both component legs are passable, try the diagonal.
        if (canLeft() && canDown())
        {
          // Attempt diagonal; return cardinal-facing or 0.
          const faced = tryDiagonal(J.ABS.Directions.LOWERLEFT);
          if (faced > 0) return faced;

          // If diagonal landing blocked, split by residuals.
          return diagonalFallback(
            J.ABS.Directions.LEFT,
            J.ABS.Directions.DOWN,
            () => (this.x - roundX) < (roundY - this.y));
        }

        // If only one leg is passable, recurse to that cardinal.
        if (canLeft()) return this.pixelMoveByInput(J.ABS.Directions.LEFT);
        if (canDown()) return this.pixelMoveByInput(J.ABS.Directions.DOWN);

        // Otherwise, bias facing to down for consistency.
        innerDirection = J.ABS.Directions.DOWN;
        return innerDirection;
      }
      case J.ABS.Directions.LOWERRIGHT:
      {
        // If both component legs are passable, try the diagonal.
        if (canRight() && canDown())
        {
          // Attempt diagonal; return cardinal-facing or 0.
          const faced = tryDiagonal(J.ABS.Directions.LOWERRIGHT);
          if (faced > 0) return faced;

          // If diagonal landing blocked, split by residuals.
          return diagonalFallback(
            J.ABS.Directions.RIGHT,
            J.ABS.Directions.DOWN,
            () => (roundX - this.x) < (roundY - this.y));
        }

        // If only one leg is passable, recurse to that cardinal.
        if (canRight()) return this.pixelMoveByInput(J.ABS.Directions.RIGHT);
        if (canDown()) return this.pixelMoveByInput(J.ABS.Directions.DOWN);

        // Otherwise, bias facing to down for consistency.
        innerDirection = J.ABS.Directions.DOWN;
        return innerDirection;
      }
      case J.ABS.Directions.UPPERLEFT:
      {
        // If both component legs are passable, try the diagonal.
        if (canLeft() && canUp())
        {
          // Attempt diagonal; return cardinal-facing or 0.
          const faced = tryDiagonal(J.ABS.Directions.UPPERLEFT);
          if (faced > 0) return faced;

          // If diagonal landing blocked, split by residuals.
          return diagonalFallback(
            J.ABS.Directions.LEFT,
            J.ABS.Directions.UP,
            () => (this.x - roundX) < (this.y - roundY));
        }

        // If only one leg is passable, recurse to that cardinal.
        if (canLeft()) return this.pixelMoveByInput(J.ABS.Directions.LEFT);
        if (canUp()) return this.pixelMoveByInput(J.ABS.Directions.UP);

        // Otherwise, bias facing to up for consistency.
        innerDirection = J.ABS.Directions.UP;
        return innerDirection;
      }
      case J.ABS.Directions.UPPERRIGHT:
      {
        // If both component legs are passable, try the diagonal.
        if (canRight() && canUp())
        {
          // Attempt diagonal; return cardinal-facing or 0.
          const faced = tryDiagonal(J.ABS.Directions.UPPERRIGHT);
          if (faced > 0) return faced;

          // If diagonal landing blocked, split by residuals.
          return diagonalFallback(
            J.ABS.Directions.RIGHT,
            J.ABS.Directions.UP,
            () => (roundX - this.x) < (this.y - roundY));
        }

        // If only one leg is passable, recurse to that cardinal.
        if (canRight()) return this.pixelMoveByInput(J.ABS.Directions.RIGHT);
        if (canUp()) return this.pixelMoveByInput(J.ABS.Directions.UP);

        // Otherwise, bias facing to up for consistency.
        innerDirection = J.ABS.Directions.UP;
        return innerDirection;
      }
      default:
      {
        // Unknown diagonal; return 0 to indicate not handled.
        return 0;
      }
    }
  };

  // Handles straight inputs using a switch with shared execution and gentle re-centering.
  const handleStraight = (cardinalDir) =>
  {
    // Handle the straight direction selection with a switch.
    switch (cardinalDir)
    {
      case J.ABS.Directions.DOWN:
      {
        // Down if passable.
        if (canDown()) return doStraightMove(J.ABS.Directions.DOWN);
        return 0;
      }
      case J.ABS.Directions.UP:
      {
        // Up if passable.
        if (canUp()) return doStraightMove(J.ABS.Directions.UP);
        return 0;
      }
      case J.ABS.Directions.LEFT:
      {
        // Left if passable.
        if (canLeft()) return doStraightMove(J.ABS.Directions.LEFT);
        return 0;
      }
      case J.ABS.Directions.RIGHT:
      {
        // Right if passable.
        if (canRight()) return doStraightMove(J.ABS.Directions.RIGHT);
        return 0;
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
Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert)
{
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
  const radius = this.getCollisionRadius();

  // Build the hitbox for collision sampling.
  const hitbox = this._pixelHitbox(radius);

  // Determine the subgrid resolution.
  const subCount = this._pixelCollisionSubCount(straightStep);

  // Initialize destination center X with current X.
  let nx = this._x;

  // Initialize destination center Y with current Y.
  let ny = this._y;

  // If the horizontal leg is right, add the diagonal step to X.
  if (horz === J.ABS.Directions.RIGHT)
  {
    nx = this._x + diagStep;
  }
  // Else if the horizontal leg is left, subtract the diagonal step from X.
  else if (horz === J.ABS.Directions.LEFT)
  {
    nx = this._x - diagStep;
  }

  // If the vertical leg is down, add the diagonal step to Y.
  if (vert === J.ABS.Directions.DOWN)
  {
    ny = this._y + diagStep;
  }
  // Else if the vertical leg is up, subtract the diagonal step from Y.
  else if (vert === J.ABS.Directions.UP)
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
  if (horz === J.ABS.Directions.LEFT)
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
  if (vert === J.ABS.Directions.UP)
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
  if (vert === J.ABS.Directions.DOWN)
  {
    y2 = this._y + straightStep;
  }
  // Else if moving up, subtract straight step from y2.
  else if (vert === J.ABS.Directions.UP)
  {
    y2 = this._y - straightStep;
  }

  // Validate the horizontal leg at the displaced Y.
  if (horz === J.ABS.Directions.LEFT)
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
  if (horz === J.ABS.Directions.RIGHT)
  {
    x2 = this._x + straightStep;
  }
  // Else if moving left, subtract straight step from x2.
  else if (horz === J.ABS.Directions.LEFT)
  {
    x2 = this._x - straightStep;
  }

  // Validate the vertical leg at the displaced X.
  if (vert === J.ABS.Directions.UP)
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
  if (horz === J.ABS.Directions.LEFT)
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
  if (vert === J.ABS.Directions.UP)
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
  const canDown = () => this.canPassStraight(J.ABS.Directions.DOWN, straightDistance);
  const canUp = () => this.canPassStraight(J.ABS.Directions.UP, straightDistance);
  const canLeft = () => this.canPassStraight(J.ABS.Directions.LEFT, straightDistance);
  const canRight = () => this.canPassStraight(J.ABS.Directions.RIGHT, straightDistance);

  // Require both legs of the diagonal to be passable.
  let legsOk = false;
  if (diagonalDir === J.ABS.Directions.LOWERLEFT) legsOk = (canLeft() && canDown());
  if (diagonalDir === J.ABS.Directions.LOWERRIGHT) legsOk = (canRight() && canDown());
  if (diagonalDir === J.ABS.Directions.UPPERLEFT) legsOk = (canLeft() && canUp());
  if (diagonalDir === J.ABS.Directions.UPPERRIGHT) legsOk = (canRight() && canUp());
  if (legsOk === false) return false;

  // Simulate the diagonal landing point (same step length you execute with).
  const step = this.diagonalDistancePerFrame();
  let nx = this._x;
  let ny = this._y;
  if (diagonalDir === J.ABS.Directions.LOWERLEFT)
  {
    nx -= step;
    ny += step;
  }
  if (diagonalDir === J.ABS.Directions.LOWERRIGHT)
  {
    nx += step;
    ny += step;
  }
  if (diagonalDir === J.ABS.Directions.UPPERLEFT)
  {
    nx -= step;
    ny -= step;
  }
  if (diagonalDir === J.ABS.Directions.UPPERRIGHT)
  {
    nx += step;
    ny -= step;
  }

  // Reject if a character occupies the diagonal landing point.
  const radius = this.getCollisionRadius();
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
  // Choose the half-size (in tiles) for the probe AABB.
  const halfW = radius;

  // Choose the half-size (in tiles) for the probe AABB.
  const halfH = radius;

  // The probe center is the actual fractional coordinates in tile units.
  const probeCx = px;

  // The probe center is the actual fractional coordinates in tile units.
  const probeCy = py;

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

    // Exclude JABS actions (do not block movement).
    if (ev.isJabsAction()) return;

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

    // Extra defense: skip if marked as a JABS action (even if included above).
    if (ch.isJabsAction())
    {
      // Do not collide with JABS actions here.
      continue;
    }

    // Acquire candidate center in true fractional tile space.
    const cx = ch.x;

    // Acquire candidate center in true fractional tile space.
    const cy = ch.y;

    // Candidate half-extents in tiles; use the character's configured radius.
    const cr = ch.getCollisionRadius();

    // Candidate half width in tile units.
    const chw = cr;

    // Candidate half height in tile units.
    const chh = cr;

    // Test AABB overlap.
    if (aabbOverlap(probeCx, probeCy, halfW, halfH, cx, cy, chw, chh))
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
 * Gets the collision pivot X in tile units for this character.
 * The pivot represents the reference point for hitbox placement and sampling.
 * Defaults to bottom-center horizontally (0.5).
 * @returns {number} The X pivot in tile units.
 */
Game_CharacterBase.prototype.getCollisionPivotX = function()
{
  // Return bottom-center horizontally.
  return 0;
};

/**
 * Gets the collision pivot Y in tile units for this character.
 * The pivot represents the reference point for hitbox placement and sampling.
 * Defaults to feet (bottom of the tile) at 1.0.
 * @returns {number} The Y pivot in tile units.
 */
Game_CharacterBase.prototype.getCollisionPivotY = function()
{
  // Return the feet as the pivot (bottom of the tile).
  return 0;
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
 * Chooses a collision subgrid resolution that matches our PIXEL collision table.
 * @param {number} step The intended straight step size for this frame.
 * @returns {number} The collision subgrid count.
 */
Game_CharacterBase.prototype._pixelCollisionSubCount = function(step)
{
  if (!PIXEL_CollisionManager.collisionStepCount)
  {
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

  // Current left/right integer column indices.
  const curLeftIdx = Math.floor((px0 + hb.hx) * count + eps);
  const curRightIdx = Math.floor((px0 + hb.hx + hb.w) * count - eps);

  // Destination left/right integer column indices.
  const destLeftIdx = Math.floor((px1 + hb.hx) * count + eps);
  const destRightIdx = Math.floor((px1 + hb.hx + hb.w) * count - eps);

  // Determine if we truly cross the seam to the left (entering destRightIdx).
  const crossed = (destRightIdx === curLeftIdx - 1);
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
  const destColX = destRightIdx / count;

  // Iterate all overlapped rows on that column transition.
  for (let row = firstRowIdx; row <= lastRowIdx; row++)
  {
    // Convert the current row index into a fractional y for sampling.
    const ny = row / count;

    // DEBUG markers.
    J.ABS.EXT.PIXEL.Debug.push(curColX,  ny, "rgba(255, 255, 0, 0.6)"); // yellow current
    J.ABS.EXT.PIXEL.Debug.push(destColX, ny, "rgba(0, 255, 255, 0.6)"); // cyan dest

    // Current left-most subcell must allow moving LEFT (exiting left).
    if (this._pixelIsPositionPassable(curColX, ny, J.ABS.Directions.LEFT) === false) return false;

    // Destination right-most subcell must allow moving RIGHT (entering from left).
    if (this._pixelIsPositionPassable(destColX, ny, J.ABS.Directions.RIGHT) === false) return false;
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

  // Current right integer column index (last covered).
  const curRightIdx = Math.floor((px0 + hb.hx + hb.w) * count - eps);

  // Destination left integer column index (first covered).
  const destLeftIdx = Math.floor((px1 + hb.hx) * count + eps);

  // True rightward seam crossing occurs when dest-left is exactly one beyond cur-right.
  const crossed = (destLeftIdx === curRightIdx + 1);
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
  const destColX = destLeftIdx / count;

  // Iterate all overlapped rows on that column transition.
  for (let row = firstRowIdx; row <= lastRowIdx; row++)
  {
    // Convert the row index into a fractional y for sampling.
    const ny = row / count;

    // DEBUG markers.
    J.ABS.EXT.PIXEL.Debug.push(curColX,  ny, "rgba(255, 255, 0, 0.6)"); // yellow current
    J.ABS.EXT.PIXEL.Debug.push(destColX, ny, "rgba(0, 255, 255, 0.6)");  // cyan dest

    // Current right-most must allow RIGHT (exiting right).
    if (this._pixelIsPositionPassable(curColX, ny, J.ABS.Directions.RIGHT) === false) return false;

    // Destination left-most must allow LEFT (entering from right).
    if (this._pixelIsPositionPassable(destColX, ny, J.ABS.Directions.LEFT) === false) return false;
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

  // Current top/bottom integer row indices.
  const curTopIdx    = Math.floor((py0 + hb.hy) * count + eps);
  const curBottomIdx = Math.floor((py0 + hb.hy + hb.h) * count - eps);

  // Destination top/bottom integer row indices.
  const destTopIdx    = Math.floor((py1 + hb.hy) * count + eps);
  const destBottomIdx = Math.floor((py1 + hb.hy + hb.h) * count - eps);

  // True upward crossing: destination bottom exactly one above current top.
  const crossed = (destBottomIdx === curTopIdx - 1);
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
  const destRowY = destBottomIdx / count;

  // Iterate all overlapped columns on that row transition.
  for (let col = firstColIdx; col <= lastColIdx; col++)
  {
    // Convert the column index into a fractional x for sampling.
    const nx = col / count;

    // DEBUG markers.
    J.ABS.EXT.PIXEL.Debug.push(nx, curRowY,  "rgba(255, 255, 0, 0.6)");    // yellow current
    J.ABS.EXT.PIXEL.Debug.push(nx, destRowY, "rgba(0, 255, 255, 0.6)");    // cyan dest

    // Current top must allow UP (exiting upward).
    if (this._pixelIsPositionPassable(nx, curRowY,  J.ABS.Directions.UP)   === false) return false;

    // Destination bottom must allow DOWN (entering from below).
    if (this._pixelIsPositionPassable(nx, destRowY, J.ABS.Directions.DOWN) === false) return false;
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

  // Current bottom integer row index.
  const curBottomIdx = Math.floor((py0 + hb.hy + hb.h) * count - eps);

  // Destination top integer row index.
  const destTopIdx   = Math.floor((py1 + hb.hy) * count + eps);

  // True downward crossing: destination top exactly one below current bottom.
  const crossed = (destTopIdx === curBottomIdx + 1);
  if (crossed === false)
  {
    // No seam entry; nothing to validate.
    return true;
  }

  // Horizontal span in integer columns.
  const firstColIdx = Math.floor((px + hb.hx) * count + eps);
  const lastColIdx  = Math.floor((px + hb.hx + hb.w) * count - eps);

  // Convert seam rows to fractional for sampling.
  const curRowY  = curBottomIdx / count;
  const destRowY = destTopIdx   / count;

  // Iterate all overlapped columns on that row transition.
  for (let col = firstColIdx; col <= lastColIdx; col++)
  {
    // Convert the column index into a fractional x for sampling.
    const nx = col / count;

    // DEBUG markers.
    J.ABS.EXT.PIXEL.Debug.push(nx, curRowY,  "rgba(255, 255, 0, 0.6)"); // yellow current
    J.ABS.EXT.PIXEL.Debug.push(nx, destRowY, "rgba(0, 255, 255, 0.6)"); // cyan dest

    // Current bottom must allow DOWN (exiting downward).
    if (this._pixelIsPositionPassable(nx, curRowY,  J.ABS.Directions.DOWN) === false) return false;

    // Destination top must allow UP (entering from above).
    if (this._pixelIsPositionPassable(nx, destRowY, J.ABS.Directions.UP)   === false) return false;
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
    J.ABS.EXT.PIXEL.Debug.push(columnX, ny, "rgba(0, 128, 255, 0.6)");

    // Compute lane permissions.
    const upOk   = this._pixelIsPositionPassable(columnX, ny, J.ABS.Directions.UP);
    const downOk = this._pixelIsPositionPassable(columnX, ny, J.ABS.Directions.DOWN);

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
    J.ABS.EXT.PIXEL.Debug.push(nx, rowY, "rgba(0, 128, 255, 0.6)");

    // Compute lane permissions.
    const leftOk  = this._pixelIsPositionPassable(nx, rowY, J.ABS.Directions.LEFT);
    const rightOk = this._pixelIsPositionPassable(nx, rowY, J.ABS.Directions.RIGHT);

    // Require at least one lane open for sliding.
    if (leftOk === false && rightOk === false) return false;
  }

  // Lanes are open enough to permit passage.
  return true;
};
//endregion pixel helpers
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

//endregion Game_Event

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
      this.setDirection(J.ABS.Directions.DOWN);
      break;
    case shouldFaceUp:
      this.setDirection(J.ABS.Directions.UP);
      break;
    case shouldFaceLeft:
      this.setDirection(J.ABS.Directions.LEFT);
      break;
    case shouldFaceRight:
      this.setDirection(J.ABS.Directions.RIGHT);
      break;
  }
};

/**
 * Extends {@link Game_Follower.chaseCharacter}.<br/>
 * Suppresses vanilla chasing when ALLYAI controls this follower, so formation owns movement.
 * @param {Game_Character} character The character to chase (usually the preceding character).
 */
J.ABS.EXT.PIXEL.Aliased.Game_Follower.set("chaseCharacter", Game_Follower.prototype.chaseCharacter);
Game_Follower.prototype.chaseCharacter = function(character)
{
  // If Ally AI exists and this follower is AI-controlled, defer to formation logic entirely.
  if (J.ABS.EXT.ALLYAI && this.getJabsBattler()) return;

  // Perform original vanilla chase behavior for non-AI followers.
  J.ABS.EXT.PIXEL.Aliased.Game_Follower.get("chaseCharacter")
    .call(this, character);
};

/**
 * Extends {@link Game_Follower.update}.<br/>
 * Ensures follower render coordinates always match logical coordinates.
 */
J.ABS.EXT.PIXEL.Aliased.Game_Follower.set("update", Game_Follower.prototype.update);
Game_Follower.prototype.update = function()
{
  // Perform original logic.
  J.ABS.EXT.PIXEL.Aliased.Game_Follower.get("update")
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
J.ABS.EXT.PIXEL.Aliased.Game_Follower.set("moveStraight", Game_Follower.prototype.moveStraight);
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
  J.ABS.EXT.PIXEL.Aliased.Game_Follower.get("moveStraight")
    .call(this, direction);
};

/**
 * Extends {@link Game_Follower.moveDiagonally}.<br/>
 * When AllyAI controls this follower and it is idle (not alerted/engaged),
 * block generic diagonal movement unless PIXEL is actively driving movement.
 * @param {4|6} horz The horizontal component direction (4=left, 6=right).
 * @param {2|8} vert The vertical component direction (2=down, 8=up).
 */
J.ABS.EXT.PIXEL.Aliased.Game_Follower.set("moveDiagonally", Game_Follower.prototype.moveDiagonally);
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
  J.ABS.EXT.PIXEL.Aliased.Game_Follower.get("moveDiagonally")
    .call(this, horz, vert);
};

//region Game_Map
/**
 * Extends {@link Game_Map.setup}.<br>
 * Builds the PIXEL subcell collision table when a new map loads.
 * @param {number} mapId The id of the map to setup.
 */
J.ABS.EXT.PIXEL.Aliased.Game_Map.set("setup", Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId)
{
  // Perform the original setup logic.
  J.ABS.EXT.PIXEL.Aliased.Game_Map.get("setup")
    .call(this, mapId);

  // Build the PIXEL subcell collision table for this map.
  PIXEL_CollisionManager.setupCollision();
};
//endregion Game_Map

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
    // round the x,y coordinates.
    const roundX = Math.round(this.x);
    const roundY = Math.round(this.y);

    // start the event with the rounded coordinates.
    this.startMapEvent(roundX, roundY, triggers, false);
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
J.ABS.EXT.PIXEL.Aliased.Game_Player.set('checkEventTriggerTouch', Game_Player.prototype.checkEventTriggerTouch);
Game_Player.prototype.checkEventTriggerTouch = function(x, y)
{
  // round the x,y coordinates.
  const roundX = Math.round(x);
  const roundY = Math.round(y);

  // TODO: does this actually need to round?
  // determine the threshold for pixel movement regarding event triggering.
  const didTrigger = Math.abs(roundX - x) < 0.3 && Math.abs(roundY - y) < 0.3; // within 1/3 of a tile triggers?

  // check if the event was triggered with the threshold coordinates.
  if (didTrigger)
  {
    // return the original logic's result.
    return J.ABS.EXT.PIXEL.Aliased.Game_Player.get('checkEventTriggerTouch')
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
 * Overrides {@link Game_Player.moveByInput}.<br>
 * The meat and potatoes for pixel movement of the player.
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

      // check if the input is NOT being pressed.
      if (!this.isMovePressed())
      {
        // clear the collection of points.
        this.clearPositionalRecords();

        // grab the collectino of followers.
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
  }

  // don't actually move the followers.
  this.stopFollowersPixelMoving();

  // toggle the input to false since we're not pushing the button.
  this.setMovePressed(false);
};

/**
 * Extends {@link #onStep}.<br>
 * Also processes on-step effects for the player.
 */
J.ABS.EXT.PIXEL.Aliased.Game_Player.set('onStep', Game_Player.prototype.onStep);
Game_Player.prototype.onStep = function()
{
  // perform original logic.
  J.ABS.EXT.PIXEL.Aliased.Game_Player.get('onStep')
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

//region JABS_Battler
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
    let cachedPassable = false;

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
 * @param {number} angle The angle in degrees from Math.atan2(dy, dx).
 * @returns {1|2|3|4|6|7|8|9}
 */
JABS_Battler.prototype.angleToDirection = function(angle)
{
  // Define half-sector width (45° / 2).
  const half = 22.5;

  // RIGHT: -22.5 .. 22.5
  const isRight = angle > -half && angle <= half; // 6

  // DOWN-RIGHT: 22.5 .. 67.5
  const isDownRight = angle > half && angle <= (half + 45); // 3

  // DOWN: 67.5 .. 112.5
  const isDown = angle > (half + 45) && angle <= (half + 90); // 2

  // DOWN-LEFT: 112.5 .. 157.5
  const isDownLeft = angle > (half + 90) && angle <= (half + 135); // 1

  // LEFT: >157.5 or <= -157.5
  const isLeft = angle > (half + 135) || angle <= -(half + 135); // 4

  // UP-LEFT: -157.5 .. -112.5
  const isUpLeft = angle > -(half + 135) && angle <= -(half + 90); // 7

  // UP: -112.5 .. -67.5
  const isUp = angle > -(half + 90) && angle <= -(half + 45); // 8

  // UP-RIGHT: -67.5 .. -22.5
  const isUpRight = angle > -(half + 45) && angle <= -half; // 9

  // Map the sector to the direction numbers.
  if (isRight)
  {
    return J.ABS.Directions.RIGHT; // 6
  }
  else if (isDownRight)
  {
    return J.ABS.Directions.LOWERRIGHT; // 3
  }
  else if (isDown)
  {
    return J.ABS.Directions.DOWN; // 2
  }
  else if (isDownLeft)
  {
    return J.ABS.Directions.LOWERLEFT; // 1
  }
  else if (isLeft)
  {
    return J.ABS.Directions.LEFT; // 4
  }
  else if (isUpLeft)
  {
    return J.ABS.Directions.UPPERLEFT; // 7
  }
  else if (isUp)
  {
    return J.ABS.Directions.UP; // 8
  }
  else if (isUpRight)
  {
    return J.ABS.Directions.UPPERRIGHT; // 9
  }

  // Unknown sector; return 0.
  return 0;
};
//endregion JABS_Battler

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
  if (!PIXEL_CollisionManager.collisionStepCount)
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
  J.ABS.EXT.PIXEL.Debug.clear();
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
    // Open subcells are lightly tinted; null to skip heavy fill (faster).
    case PIXEL_CollisionManager.Codes.Open:
      return "rgba(0, 255, 0, 0.08)";

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

  // Get the collision radius from the character base extension.
  const radius = $gamePlayer.getCollisionRadius();

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
  if (!J.ABS.EXT.PIXEL.Debug) return;
  const dbg = J.ABS.EXT.PIXEL.Debug;
  if (!dbg.samples || dbg.samples.length === 0) return;

  // Acquire pixel conversion.
  const tw = $gameMap.tileWidth();
  const th = $gameMap.tileHeight();
  const dx = $gameMap.displayX();
  const dy = $gameMap.displayY();

  // Compute subcell pixel sizes for a tiny highlight.
  if (!PIXEL_CollisionManager.collisionStepCount) PIXEL_CollisionManager.initConfig();
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
J.ABS.EXT.PIXEL.Aliased.Spriteset_Map.set("createUpperLayer", Spriteset_Map.prototype.createUpperLayer);
Spriteset_Map.prototype.createUpperLayer = function()
{
  // Perform original createUpperLayer logic.
  J.ABS.EXT.PIXEL.Aliased.Spriteset_Map.get("createUpperLayer")
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

  // Initialize visibility flag if not present.
  this._pixelOverlayVisible = this._pixelOverlayVisible || false;

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
J.ABS.EXT.PIXEL.Aliased.Spriteset_Map.set("update", Spriteset_Map.prototype.update);
Spriteset_Map.prototype.update = function()
{
  // Perform original update logic.
  J.ABS.EXT.PIXEL.Aliased.Spriteset_Map.get("update")
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
  }
};
//endregion Spriteset_Map