//region Eyes
/**
 * Puts what the bot can see into words. A stuck report is only as good as the state it was taken in, so
 * everything that decides whether a character can move goes on one line.
 */
class Eyes
{
  /**
   * Describes the player's situation right now.
   * @returns {string}
   */
  static situation()
  {
    const { x, y } = $gamePlayer;
    const open = [ 2, 4, 6, 8 ].filter(direction => $gamePlayer.canPassStraight(direction));
    const tile = `${$gamePlayer.occupiedTileX()},${$gamePlayer.occupiedTileY()}`;
    const position = `at ${x.toFixed(2)},${y.toFixed(2)} on tile ${tile} facing ${$gamePlayer.direction()}`;
    const movement = `open ${open.join('') || 'none'}, can move ${$gamePlayer.canMove()}`;
    const events = `event running ${$gameMap.isEventRunning()} (${Eyes.#interpreterState()})`;
    const screen = `brightness ${$gameScreen.brightness()}, scene active ${SceneManager._scene.isActive()}`;

    return `${position}; ${movement}; ${events}; ${screen}`;
  }

  /**
   * Describes exactly where the map's interpreter is. When a cutscene hangs, the line it hung on and what
   * that line is waiting for are the whole bug report. A common event runs in a child interpreter, so the
   * one that matters is the deepest.
   * @returns {string}
   */
  static #interpreterState()
  {
    let interpreter = $gameMap._interpreter;
    const eventId = interpreter.eventId();

    while (interpreter._childInterpreter !== null) interpreter = interpreter._childInterpreter;

    // an interpreter with nothing to run has no list of commands to be anywhere in.
    const command = interpreter.isRunning() ? interpreter.currentCommand() : undefined;
    const code = command === undefined ? 'none' : command.code;
    const character = interpreter._character;
    const where = character ? ` at ${character.x.toFixed(2)},${character.y.toFixed(2)}` : '';

    return `event ${eventId} line ${interpreter._index} code ${code}, waiting on "${interpreter._waitMode}"${where}`;
  }

  /**
   * Finds what the game thinks is standing in the way of a swing. It will not swing at somebody a player
   * might want to talk to, and that check looks at every event on the battler's own tile and the one in
   * front of it.
   * @param {JABS_Battler} me The battler being played.
   * @returns {string} The name of the event, or nothing if the swing is free to go.
   */
  static whatRefusesTheSwing(me)
  {
    if ($gameMap.hasInteractableEventInFront(me) === false) return '';

    const character = me.getCharacter();
    const x = character.occupiedTileX();
    const y = character.occupiedTileY();
    const direction = character.direction();
    const frontX = $gameMap.roundXWithDirection(x, direction);
    const frontY = $gameMap.roundYWithDirection(y, direction);

    const blocker = [ ...$gameMap.eventsXy(x, y), ...$gameMap.eventsXy(frontX, frontY) ]
      .find(event => event.isJabsBattler() === false && $gameMap.isInteractableEvent(event));

    return blocker === undefined ? 'something past a counter' : blocker.event().name;
  }

  /**
   * Describes a fight that is not getting anywhere: who is where, and everything that could be keeping
   * the mainhand from swinging.
   * @param {JABS_Battler} me The battler being played.
   * @param {JABS_Battler} foe The target.
   * @returns {string}
   */
  static fight(me, foe)
  {
    const gapX = (foe.getX() - me.getX()).toFixed(2);
    const gapY = (foe.getY() - me.getY()).toFixed(2);
    const ready = me.isSkillTypeCooldownReady(JABS_Button.Mainhand);
    const casting = me.isCastingOrChanneling();
    const attacks = me.canBattlerUseAttacks();
    const blocked = $gameMap.hasInteractableEventInFront(me);
    const skillId = me.getSkillIdForAction(JABS_Button.Mainhand);

    return `foe at ${gapX},${gapY} with ${foe.getBattler().hp} hp; skill ${skillId} ready ${ready}, casting ${casting}, `
      + `can attack ${attacks}, event in front ${blocked}, decided ${me.isActionDecided()}`;
  }
}

export default Eyes;
//endregion Eyes
