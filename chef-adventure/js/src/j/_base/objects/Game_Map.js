//region Game_Map
/**
 * Gets the note for the current map.
 * @returns {string|String.empty}
 */
Game_Map.prototype.note = function()
{
  if (!$dataMap)
  {
    console.warn(`attempted to get the note for a map that isn't available.`, this, $dataMap);
    return String.empty;
  }

  return $dataMap.note;
};
//endregion Game_Map