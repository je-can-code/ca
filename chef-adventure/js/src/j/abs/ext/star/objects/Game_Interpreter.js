/**
 * Overwrites {@link Game_Interpreter.command301}.
 * Alters the event command handler of "Battle Processing".
 * Replaces the default battle setup with our star battle setup instead.
 * @param {any} params The parameters from the event command.
 * @returns {boolean}
 */
Game_Interpreter.prototype.command301 = function(params)
{
  // we cannot engage in battle if already in battle.
  if ($gameParty.inBattle()) return true;

  const [designationType, troopIdentifier, canEscape, canLose] = params;

  // makes sure we don't do this if we're already in-battle.
  // convert the params into a troop id.
  const troopId = this.command301convertToTroopId(designationType, troopIdentifier);

  // check what the troop is for that troop id.
  const hasTroop = !!$dataTroops[troopId];

  // check to ensure there is a valid troop.
  if (hasTroop)
  {
    // setup the battle manager with the troop data.
    BattleManager.setup(troopId, canEscape, canLose);

    // do event things.
    BattleManager.setEventCallback(n => this._branch[this._indent] = n);

    // update the encounter count (???).
    $gamePlayer.makeEncounterCount();

    // TODO: do we need to do something about this?
    // SceneManager.push(Scene_Battle);
    //$gamePlayer.prepareForStarBattle(); // non-existing method in source or present.
  }
  return true;
};

/**
 * Retrieves the troop id based on the given designation type.
 * @param {number} designationType The type of designation from the event command.
 * @param {number} troopIdentifier The potential identifier provided in the params.
 * @returns {number} The troop id.
 */
Game_Interpreter.prototype.command301convertToTroopId = function(designationType, troopIdentifier)
{
  switch (designationType)
  {
    // zero = "direct designation" of the troop id.
    case 0: return troopIdentifier;

    // one = "variable designation" of the troop id.
    case 1: return $gameVariables.value(troopIdentifier);

    // two = "random encounter designation" of the troop id.
    case 2: return $gamePlayer.makeEncounterTroopId();
  }

  console.error(`invalid event command params, `, designationType, troopIdentifier);
  throw new Error('borked');
};