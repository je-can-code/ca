//region Window_DifficultyList
class Window_DifficultyList extends Window_Command
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Implements {@link #makeCommandList}.
   * Creates the command list of difficulties for this window.
   */
  makeCommandList()
  {
    // grab all the difficulties available.
    const difficulties = DifficultyManager.availableDifficulties();

    // if there are none, then do not try to render items.
    if (!difficulties.length) return;

    // sort the difficulties by their keys as best as possible.
    difficulties.sort((a, b) =>
    {
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    });

    // add all difficulties to the list.
    difficulties.forEach(this.makeDifficultyCommand, this);

    // grab the applied difficulty.
    const appliedDifficulty = $gameTemp.getAppliedDifficulty();

    // slide the applied difficulty command above all others.
    this.prependCommand(
      `\\I[${appliedDifficulty.iconIndex}]${appliedDifficulty.name}`,
      appliedDifficulty.key,
      false,// enabled
      appliedDifficulty,
      83,   // icon index
      6     // color index
    );
  }

  /**
   * Make and add a single difficulty command.
   * @param {DifficultyLayer} difficulty The dfificulty command to create.
   */
  makeDifficultyCommand(difficulty)
  {
    // don't render the difficulty in the list if it is hidden.
    if (difficulty.isHidden()) return;

    // don't render the difficulty labeled as "default".
    if (difficulty.isDefaultLayer()) return;

    // TODO: parameterize this.
    const enabledIcon = difficulty.isEnabled()
      ? 25
      : 16;

    // initialize the difficulty name to be the difficulty's name with its corresponding icon.
    let difficultyName = `\\I[${difficulty.iconIndex}]${difficulty.name}`;

    // check if the difficulty layer is locked from user selection.
    if (!difficulty.isUnlocked())
    {
      // TODO: parameterize this.
      // grab the lock icon.
      const lockIcon = 2530;

      // slap a lock icon infront of the difficulty.
      difficultyName = `\\I[${lockIcon}]${difficultyName}`;
    }

    // ensures the cost is no more than what points we have remaining.
    // you can disable already enabled layers without needing the point cost again.
    const enoughLayerPoints = difficulty.isEnabled() || (difficulty.canPayCost());

    // check if the command should be enabled.
    // locked commands are always disabled- the player cannot modify locked difficulty layers.
    const enabled = (difficulty.isUnlocked() && enoughLayerPoints);

    // render the command with the given details.
    this.addCommand(
      difficultyName,           // drawEx(name)
      difficulty.key,           // symbol
      enabled,                  // enabled/disabled command
      difficulty,               // extra data
      enabledIcon);             // command icon index
  }

  /**
   * Gets the difficulty being hovered over in this list.
   * @returns {DifficultyLayer}
   */
  hoveredDifficulty()
  {
    return this.currentExt();
  }

  /**
   * Designed for overriding to weave in functionality on-change of the index.
   */
  onIndexChange()
  {
  }
}
//endregion Window_DifficultyList