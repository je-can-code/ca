//region Window_MonsterpediaList
/**
 * A window containing the list of all enemies perceived for the monsterpedia.
 */
class Window_MonsterpediaList extends Window_Command
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Implements {@link #makeCommandList}.
   * Creates the command list of omnipedia entries available for this window.
   */
  makeCommandList()
  {
    // grab all the omnipedia listings available.
    const commands = this.buildCommands();

    // build all the commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * Adds all omnipedia commands to the list that are available.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // grab all valid enemies.
    const enemies = [];

    // an iterator function for filtering out enemies.
    const forEacher = enemy =>
    {
      // if the enemy is invalid, we don't process it.
      if (!this.isValidEnemy(enemy)) return;

      // push the enemy by its index.
      enemies.push(enemy);
    };

    // build the list of enemies.
    $dataEnemies.forEach(forEacher, this);

    // compile the list of commands.
    const commands = enemies.map(this.buildCommand, this);

    // return the compiled list of commands.
    return commands;
  }

  /**
   * Determines whether or not the enemy is a valid enemy.
   * @param {RPG_Enemy} enemy The enemy database data.
   * @returns {boolean} True if the enemy should be listed in the monsterpedia, false otherwise.
   */
  isValidEnemy(enemy)
  {
    // if the enemy is null/undefined, then the enemy is invalid.
    if (!enemy) return false;

    // if the enemy has no name, then the enemy is invalid.
    if (!enemy.name) return false;

    // if an enemy is explicitly hidden, then the enemy is invalid.
    if (enemy.hideFromMonsterpedia) return false;

    // the enemy is valid!
    return true;
  }

  /**
   * Builds a {@link BuiltWindowCommand} based on the enemy data.
   * @param {RPG_Enemy} enemy The enemy database data.
   * @returns {BuiltWindowCommand} The built command based on this enemy.
   */
  buildCommand(enemy)
  {
    // deconstruct data points out for building the list.
    const { id, name } = enemy;

    // grab the observations associated with this enemy id.
    const observations = $gameParty.getOrCreateMonsterpediaObservationsById(id);

    // default the name to the enemy's name.
    let enemyName = name;

    // validate the player knows the name of this monster.
    if (!observations.knowsName)
    {
      // mask the name if it isn't known.
      enemyName = J.BASE.Helpers.maskString(enemyName);
    }

    let enemyMonsterFamilyIconIndex = enemy.monsterFamilyIcon;

    // check if the player doesn't know the family, or has never defeated the monster.
    if (!observations.knowsFamily || observations.numberDefeated === 0)
    {
      // TODO: parameterize this.
      // the icon is a question mark.
      enemyMonsterFamilyIconIndex = 93;
    }

    // build a command based on the enemy.
    return new WindowCommandBuilder(enemyName)
      .setSymbol(`${id}-${name}`)
      .setExtensionData(observations)
      .setIconIndex(enemyMonsterFamilyIconIndex)
      .build();
  }
}
//endregion Window_MonsterpediaList