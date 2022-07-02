//#region Window_DifficultyList
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
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList()
  {
    // grab all the difficulties available.
    const difficulties = $gameSystem.availableDifficulties();

    // if there are none, then do not try to render items.
    if (!difficulties.length) return;

    // add all difficulties to the list.
    difficulties.forEach(difficulty =>
    {
      // don't render the difficulty in the list if it is hidden.
      if (difficulty.isHidden()) return;

      this.addCommand(
        difficulty.name,
        difficulty.key,
        difficulty.unlocked,  // enabled when unlocked.
        difficulty,
        difficulty.iconIndex);
    }, this);
  }

  /**
   * Gets the difficulty being hovered over in this list.
   * @returns {Difficulty}
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
//#endregion Window_DifficultyList