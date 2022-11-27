class Window_MonsterpediaDetail extends Window_Base
{
  /**
   * The player's observations of the currently highlighted enemy.
   * @type {MonsterpediaObservations|null}
   */
  #currentObservations = null;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Gets the current enemy observations for this window.
   * @returns {MonsterpediaObservations|null}
   */
  getObservations()
  {
    return this.#currentObservations;
  }

  /**
   * Sets the current enemy observations for this window.
   * @param {MonsterpediaObservations} observations
   */
  setObservations(observations)
  {
    this.#currentObservations = observations;
  }

  /**
   * Implements {@link Window_Base.drawContent}.
   * Draws a header and some detail for the omnipedia list header.
   */
  drawContent()
  {
    // grab the currently-highlighted observation.
    const observations = this.getObservations();

    // if we have no observations, do not draw.
    if (!observations) return;

    const { id } = observations;

    const databaseEnemy = $dataEnemies.at(id);

    const gameEnemy = $gameEnemies.enemy(id);

    // define the origin x,y coordinates.
    const [x, y] = [0, 0];

    // shorthand the lineHeight.
    const lh = this.lineHeight();

    // draw the enemyId of the enemy.
    this.drawEnemyId(x, y);

    // draw the enemy name.
    const enemyNameX = x + 100;
    this.drawEnemyName(enemyNameX, y);
  }

  /**
   * Draws the enemy's id at the given point.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemyId(x, y)
  {
    // clear residual font modifications.
    const valueX = x + 12;
    const valueY = y + 8;
    this.drawEnemyDefeatCountValue(valueX, valueY);

    // reduce font size for a tiny "DEFEATED".
    const keyY = y - 4;
    this.drawEnemyDefeatCountKey(x, keyY);
  }

  /**
   * Draws the enemy's defeated count value at the given point.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemyDefeatCountValue(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // boost the font size, headers are big!
    this.modFontSize(6);

    // grab the id out of the current observations.
    const { numberDefeated } = this.getObservations();

    // pad the id with zeroes to ensure we always have at least 3 digits.
    const paddedNumberDefeated = numberDefeated.padZero(4);

    // calculate the text width.
    const textWidth = this.textWidth(paddedNumberDefeated);

    // render the "ID" text.
    this.drawText(`${paddedNumberDefeated}`, x, y, textWidth, Window_Base.TextAlignments.Left);
  }

  /**
   * Draws the enemy's defeated count key at the given point.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemyDefeatCountKey(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // reduce font size for a tiny "ID".
    this.modFontSize(-6);

    // force bold for the key.
    this.toggleBold(true);

    // capture the text to render.
    const defeatCounterText = "DEFEATED";

    // determine the text width for the key.
    const textWidth = this.textWidth(defeatCounterText);

    // render the text.
    this.drawText(defeatCounterText, x, y, textWidth, Window_Base.TextAlignments.Left);
  }

  /**
   * Draws the enemy's name at the given point.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemyName(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // boost the font size, headers are big!
    this.modFontSize(14);

    // bold the header.
    this.toggleBold(true);

    // grab the id out of the current observations.
    const { id, knowsName } = this.getObservations();

    // pull the enemy's database data out.
    const databaseEnemy = $dataEnemies.at(id);

    // define the name.
    const { name } = databaseEnemy;

    // potentially mask the name depending on whether or not the player knows it.
    const possiblyMaskedName = knowsName
      ? name
      : J.BASE.Helpers.maskString(name);

    // determine the width of the enemy's name.
    const textWidth = this.textWidth(name);

    // draw the header.
    this.drawText(possiblyMaskedName, x, y, textWidth, Window_Base.TextAlignments.Left);
  }

  /*
  TODO:
  sections include
  - id
  - description
  - regions found
  - parameters
  - ailmentalistics
  - elementalistics
   */
}