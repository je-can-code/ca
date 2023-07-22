//region Game_Map
/**
 * Overwrites {@link #checkPassage}.
 * Disables the ability to walk over tiles with the terrain ID of 1.
 * In practice, this prevents battlers from getting knocked into otherwise
 * unreachable locations, like what is supposed to be ceiling tiles.
 * @param {number} x The `x` coordinate.
 * @param {number} y The `y` coordinate.
 * @param {number} bit The bitwise operator being checked.
 * @returns {boolean} True if the tile can be walked on, false otherwise.
 */
Game_Map.prototype.checkPassage = function(x, y, bit)
{
  // grab all the flags for the tileset.
  const flags = this.tilesetFlags();

  // grab all the tiles available at the designated location.
  const tiles = this.allTiles(x, y);

  // iterate over each tile represented at these coordinates.
  for (const tile of tiles)
  {
    // grab the flag for this tile.
    const flag = flags[tile];

    // represents [*] No effect on passage.
    if ((flag & 0x10) !== 0)
    {
      continue;
    }

    // represents [Terrain 1] blocks passage.
    if ((flag >> 12) === 1)
    {
      return false;
    }

    // represents [o] Passable.
    if ((flag & bit) === 0)
    {
      return true;
    }

    // represents [x] Impassable.
    if ((flag & bit) === bit)
    {
      return false;
    }
  }

  // this tile cannot be passed.
  return false;
};

/**
 * Extends {@link #setup}.
 * Upon map initialization, assigns a random integer between 1-100 to an arbitrary variable.
 * In CA, this value is used to determine the presence of "rare/named" monsters on the map.
 */
J.CAMods.Aliased.Game_Map.set('setup', Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId)
{
  // perform original logic.
  J.CAMods.Aliased.Game_Map.get('setup').call(this, mapId);

  // update rare/named enemy variable.
  $gameVariables.setValue(13, Math.randomInt(100) + 1);
};
//endregion Game_Map