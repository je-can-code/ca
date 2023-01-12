class Window_MonsterpediaDetail extends Window_Base
{
  //region properties
  /**
   * The player's observations of the currently highlighted enemy.
   * @type {MonsterpediaObservations|null}
   */
  #currentObservations = null;

  /**
   * A cache of all sprites associated with enemies in the monsterpedia.
   * @type {Map<number, Sprite_Enemy>}
   */
  #battlerImageCache = new Map();

  /**
   * A cache of all sprites associated with base parameters.
   * @type {Map<number, Sprite_Icon>}
   */
  #baseParameterIconCache = new Map();

  /**
   * A cache of all sprites associated with sp parameters.
   * @type {Map<number, Sprite_Icon>}
   */
  #spParameterIconCache = new Map();

  /**
   * A cache of all sprites associated with ex parameters.
   * @type {Map<number, Sprite_Icon>}
   */
  #exParameterIconCache = new Map();
  //endregion properties

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

  //region image caching
  /**
   * Gets the battler image cache.
   * @returns {Map<number, Sprite_Enemy>}
   */
  getEnemyImageCache()
  {
    return this.#battlerImageCache;
  }

  /**
   * Gets the b-parameter icon image cache.
   * @returns {Map<number, Sprite_Icon>}
   */
  getBaseParameterIconCache()
  {
    return this.#baseParameterIconCache;
  }

  /**
   * Gets the s-parameter icon image cache.
   * @returns {Map<number, Sprite_Icon>}
   */
  getSpParameterIconCache()
  {
    return this.#spParameterIconCache;
  }

  /**
   * Gets the x-parameter icon image cache.
   * @returns {Map<number, Sprite_Icon>}
   */
  getExParameterIconCache()
  {
    return this.#exParameterIconCache;
  }

  /**
   * Populates the sprite cache ahead of rendering.
   */
  populateImageCache()
  {
    // populate enemy battler sprites into the cache.
    this.populateEnemySpriteImageCache();

    // populate all icon sprites into the cache.
    this.populateParameterIconSpriteCache();
  }

  /**
   * Caches all enemy battler sprites that have been at least perceived once.
   */
  populateEnemySpriteImageCache()
  {
    // grab the current list of observations.
    const monsterpediaCache = $gameParty.getMonsterpediaObservationsCache();

    // an iterator function for caching enemy sprites.
    const forEacherEnemySprites = (_, enemyId) => this.getOrCreateEnemySprite(enemyId);

    // iterate over each of them and cache the sprites.
    monsterpediaCache.forEach(forEacherEnemySprites, this);
  }

  /**
   * Caches all sprites associated with parameters icons.
   */
  populateParameterIconSpriteCache()
  {
    // cache the b-param icon sprites.
    this.populateBaseParameterIconSpriteCache();

    // cache the s-param icon sprites.
    this.populateSpParameterIconSpriteCache();

    // cache the x-param icon sprites.
    this.populateExParameterIconSpriteCache();
  }

  /**
   * Caches all base parameter icon sprites.
   */
  populateBaseParameterIconSpriteCache()
  {
    // define the parameter ids that qualify as b-params.
    const bparamIds = Game_BattlerBase.knownBaseParameterIds().concat(30);

    // an iterator function for creating base parameter icon sprites.
    const forEacher = (_, bParamId) => this.getOrCreateBaseParameterIconSprite(bParamId);

    // cache all sprites.
    bparamIds.forEach(forEacher, this);
  }

  /**
   * Caches all sp parameter icon sprites.
   */
  populateSpParameterIconSpriteCache()
  {
    // define the parameter ids that qualify as s-params.
    const sparamIds = Game_BattlerBase.knownSpParameterIds();

    // an iterator function for creating sp parameter icon sprites.
    const forEacher = (_, sParamId) => this.getOrCreateSpParameterIconSprite(sParamId);

    // cache all sprites.
    sparamIds.forEach(forEacher, this);
  }

  /**
   * Caches all ex parameter icon sprites.
   */
  populateExParameterIconSpriteCache()
  {
    // define the parameter ids that qualify as x-params.
    const xparamIds = Game_BattlerBase.knownExParameterIds();

    // an iterator function for creating ex parameter icon sprites.
    const forEacher = (_, xParamId) => this.getOrCreateExParameterIconSprite(xParamId);

    // cache all sprites.
    xparamIds.forEach(forEacher, this);
  }

  /**
   * Gets the enemy's sprite. If it is already cached, the cached one will be
   * returned, otherwise it'll be created and then cached.
   * @param {number} enemyId The id of the battler to retrieve the sprite for.
   * @returns {Sprite_Enemy}
   */
  getOrCreateEnemySprite(enemyId)
  {
    // grab the cache.
    const cache = this.getEnemyImageCache();

    // check if the key already maps to a cached sprite.
    if (cache.has(enemyId))
    {
      // if it does, just return that.
      return cache.get(enemyId);
    }

    // determine the battler associated with the enemy sprite.
    const battler = new Game_Enemy(enemyId, 0, 0);

    // TODO: replace this with a non-battle version of the sprite.
    // create a new sprite.
    const sprite = new Sprite_Enemy(battler);

    // cache the sprite.
    cache.set(enemyId, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Gets the base parameter icon sprite. If it is already cached, the cached one will be
   * returned, otherwise it'll be created and then cached.
   * @param {number} bParamId The id of the parameter to retrieve the sprite for.
   * @returns {Sprite_Icon}
   */
  getOrCreateBaseParameterIconSprite(bParamId)
  {
    // grab the cache.
    const cache = this.getBaseParameterIconCache();

    // check if the key already maps to a cached sprite.
    if (cache.has(bParamId))
    {
      // if it does, just return that.
      return cache.get(bParamId);
    }

    // determine the icon index for this b-parameter.
    // for the sake of the monsterpedia, we are categorizing "maxTp"(30) as a base param.
    const iconIndex = bParamId === 30
      ? IconManager.maxTp()
      : IconManager.param(bParamId);

    // create a new sprite.
    const sprite = new Sprite_Icon(iconIndex);

    // cache the sprite.
    cache.set(bParamId, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Gets the sp parameter icon sprite. If it is already cached, the cached one will be
   * returned, otherwise it'll be created and then cached.
   * @param {number} sParamId The id of the parameter to retrieve the sprite for.
   * @returns {Sprite_Icon}
   */
  getOrCreateSpParameterIconSprite(sParamId)
  {
    // grab the cache.
    const cache = this.getSpParameterIconCache();

    // check if the key already maps to a cached sprite.
    if (cache.has(sParamId))
    {
      // if it does, just return that.
      return cache.get(sParamId);
    }

    // determine the icon index for this s-parameter.
    const iconIndex = IconManager.sparam(sParamId);

    // create a new sprite.
    const sprite = new Sprite_Icon(iconIndex);

    // cache the sprite.
    cache.set(sParamId, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Gets the ex parameter icon sprite. If it is already cached, the cached one will be
   * returned, otherwise it'll be created and then cached.
   * @param {number} xParamId The id of the parameter to retrieve the sprite for.
   * @returns {Sprite_Icon}
   */
  getOrCreateExParameterIconSprite(xParamId)
  {
    // grab the cache.
    const cache = this.getExParameterIconCache();

    // check if the key already maps to a cached sprite.
    if (cache.has(xParamId))
    {
      // if it does, just return that.
      return cache.get(xParamId);
    }

    // determine the icon index for this x-parameter.
    const iconIndex = IconManager.xparam(xParamId);

    // create a new sprite.
    const sprite = new Sprite_Icon(iconIndex);

    // cache the sprite.
    cache.set(xParamId, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }
  //endregion image caching

  /**
   * Extends {@link #clearContent}.
   * Also hides all cached images.
   */
  clearContent()
  {
    // perform original logic.
    super.clearContent();

    // grab the cache of enemy images.
    const cache = this.getEnemyImageCache();

    // hide all of them.
    cache.forEach(sprite => sprite.hide());
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

    // define the origin x,y coordinates.
    const [x, y] = [0, 0];

    // shorthand the lineHeight.
    const lh = this.lineHeight();

    // draw the enemyId of the enemy.
    this.drawEnemyId(x, y);

    // draw the enemy name.
    const enemyNameX = x + 100;
    this.drawEnemyName(enemyNameX, y);

    // draw the battler image for the enemy.
    const enemySpriteY = y + (lh * 3);
    this.drawEnemySprite(x, enemySpriteY);

    // draw the parameters for the enemy.
    const parametersX = this.width - 300;
    this.drawEnemyParameters(parametersX, y);

    // draw the drops for the enemy.
    const dropsX = this.width - 550;
    this.drawEnemyDrops(dropsX, y);

    // draw the description of the enemy.
    const descriptionY = this.height - (lh * 6);
    this.drawDescription(x, descriptionY);

    // draw the enemy's elementalistics.
    const elementalisticsX = this.width - 300;
    const elementalisticsY = this.height - (lh * 9);
    this.drawElementalistics(elementalisticsX, elementalisticsY);
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
    this.drawEnemyDefeatCountValue(valueX, y);

    // reduce font size for a tiny "DEFEATED".
    const keyY = y - 14;
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
    this.modFontSize(-10);

    // force bold for the key.
    this.toggleItalics(true);

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

  /**
   * Draws the enemy's battler sprite at the given point.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemySprite(x, y)
  {
    // grab the id out of the current observations.
    const { id, numberDefeated } = this.getObservations();

    // don't render the sprite if we have never defeated it.
    if (numberDefeated < 1) return;

    // get the sprite from the cache.
    const sprite = this.getOrCreateEnemySprite(id);

    // determine the home coordinates for this enemy sprite.
    let homeX = x + sprite.width;
    const homeY = y + sprite.height;

    // check if this is a "larger" sprite.
    if (sprite.width > 300)
    {
      // create a proportionate modifier against the X to move the image to the left.
      const xModifier = (sprite.width * 0.4);

      // move the sprite to the left.
      homeX -= xModifier;
    }

    // show it where it needs to be shown.
    sprite.setHome(homeX, homeY);
    sprite.show();
  }

  /**
   * Draws the primary parameters of the enemy.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemyParameters(x, y)
  {
    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // draw the level of the enemy.
    this.drawLevelParameter(x, y);

    // draw the resources of the enemy.
    const resourcesY = lh * 2;
    this.drawResourceParameters(x, resourcesY);

    // draw the parameters of the enemy.
    const parametersY = lh * 6;
    this.drawCoreParameters(x, parametersY);
  }

  /**
   * Draws the level of the enemy.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawLevelParameter(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // reduce the font size a bit for these params.
    this.modFontSize(-4);

    // grab the id out of the current observations.
    const { id, knowsParameters } = this.getObservations();

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // extract the parameters to draw from this enemy.
    const { level, } = gameEnemy;

    // draw the level parameter.
    this.drawEnemyParameter(
      x,
      y,
      IconManager.level(),
      TextManager.level,
      level,
      !knowsParameters,
      4);
  }

  /**
   * Draws the resource parameters of the enemy, such as HP/MP/TP.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawResourceParameters(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // reduce the font size a bit for these params.
    this.modFontSize(-4);

    // grab the id out of the current observations.
    const { id, knowsParameters } = this.getObservations();

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // extract the parameters to draw from this enemy.
    const { mhp, mmp, mtp, } = gameEnemy;

    const maxRemover = parameterName =>
    {
      return parameterName.replace('Max ', String.empty)
    };

    // draw the max hp parameter.
    const maxHpName = maxRemover(TextManager.param(0));
    this.drawEnemyParameter(
      x,
      y,
      IconManager.param(0),
      maxHpName,
      mhp,
      !knowsParameters);

    // draw the max mp parameter.
    const maxMpName = maxRemover(TextManager.param(1));
    const maxMpXPlus = 12;
    const maxMpYPlus = lh * 1;
    this.drawEnemyParameter(
      x + maxMpXPlus,
      y + maxMpYPlus,
      IconManager.param(1),
      maxMpName,
      mmp,
      !knowsParameters,
      6);

    // draw the max tp parameter.
    const maxTpName = maxRemover(TextManager.maxTp());
    const maxTpXPlus = 24;
    const maxTpYPlus = lh * 2;
    this.drawEnemyParameter(
      x + maxTpXPlus,
      y + maxTpYPlus,
      IconManager.maxTp(),
      maxTpName,
      mtp,
      !knowsParameters,
      6);
  }

  /**
   * Draws the core parameters of the enemy, such as atk/def/mat/mdf/agi/luk.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawCoreParameters(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // reduce the font size a bit for these params.
    this.modFontSize(-4);

    // grab the id out of the current observations.
    const { id, knowsParameters } = this.getObservations();

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // extract the parameters to draw from this enemy.
    const {
      atk, def, pdr,
      mat, mdf, mdr,
      agi, hit, cnt,
      luk, cri, cev,
    } = gameEnemy;

    // the modifier for where the left column begins.
    const leftColumnX = 8;

    // draw the attack parameter.
    const atkXPlus = leftColumnX;
    this.drawEnemyParameter(
      x + atkXPlus,
      y,
      IconManager.param(2),
      TextManager.param(2),
      atk,
      !knowsParameters,
      4);

    // draw the endurance parameter.
    const defXPlus = leftColumnX + 8;
    const defYPlus = lh * 1;
    this.drawEnemyParameter(
      x + defXPlus,
      y + defYPlus,
      IconManager.param(3),
      TextManager.param(3),
      def,
      !knowsParameters,
      4);

    // draw the phys dmg down parameter.
    const pdrXPlus = leftColumnX + 8;
    const pdrYPlus = lh * 2;
    const pdrValue = (pdr * 100) - 100;
    this.drawEnemyParameter(
      x + pdrXPlus,
      y + pdrYPlus,
      IconManager.sparam(6),
      TextManager.sparam(6),
      pdrValue,
      !knowsParameters,
      3);

    // draw the force parameter.
    const matXPlus = leftColumnX;
    const matYPlus = lh * 3;
    this.drawEnemyParameter(
      x + matXPlus,
      y + matYPlus,
      IconManager.param(4),
      TextManager.param(4),
      mat,
      !knowsParameters,
      4);

    // draw the resist parameter.
    const mdfXPlus = leftColumnX + 8;
    const mdfYPlus = lh * 4;
    this.drawEnemyParameter(
      x + mdfXPlus,
      y + mdfYPlus,
      IconManager.param(5),
      TextManager.param(5),
      mdf,
      !knowsParameters,
      4);

    // draw the magi def down parameter.
    const mdrXPlus = leftColumnX + 8;
    const mdrYPlus = lh * 5;
    const mdrValue = (mdr * 100) - 100;
    this.drawEnemyParameter(
      x + mdrXPlus,
      y + mdrYPlus,
      IconManager.sparam(7),
      TextManager.sparam(7),
      mdrValue,
      !knowsParameters,
      3);

    // draw the speed parameter.
    const agiXPlus = leftColumnX;
    const agiYPlus = lh * 6;
    this.drawEnemyParameter(
      x + agiXPlus,
      y + agiYPlus,
      IconManager.param(6),
      TextManager.param(6),
      agi,
      !knowsParameters,
      4);

    // draw the hit rate parameter.
    const hitXPlus = leftColumnX + 8;
    const hitYPlus = lh * 7;
    const hitValue = (hit * 100);
    this.drawEnemyParameter(
      x + hitXPlus,
      y + hitYPlus,
      IconManager.xparam(0),
      TextManager.xparam(0),
      hitValue,
      !knowsParameters,
      4);

    // draw the autocounter parameter.
    const cntXPlus = leftColumnX + 8;
    const cntYPlus = lh * 8;
    const cntValue = (cnt * 100);
    this.drawEnemyParameter(
      x + cntXPlus,
      y + cntYPlus,
      IconManager.xparam(6),
      TextManager.xparam(6),
      cntValue,
      !knowsParameters,
      3);

    // draw the b-param parameter.
    const lukXPlus = leftColumnX;
    const lukYPlus = lh * 9;
    this.drawEnemyParameter(
      x + lukXPlus,
      y + lukYPlus,
      IconManager.param(7),
      TextManager.param(7),
      luk,
      !knowsParameters,
      4);

    // draw the crit chance parameter.
    const criXPlus = leftColumnX + 8;
    const criYPlus = lh * 10;
    const criValue = (cri * 100);
    this.drawEnemyParameter(
      x + criXPlus,
      y + criYPlus,
      IconManager.xparam(2),
      TextManager.xparam(2),
      criValue,
      !knowsParameters,
      4);

    // draw the cev parameter.
    const cevXPlus = leftColumnX + 8;
    const cevYPlus = lh * 11;
    const cevValue = (cev * 100);
    this.drawEnemyParameter(
      x + cevXPlus,
      y + cevYPlus,
      IconManager.xparam(3),
      TextManager.xparam(3),
      cevValue,
      !knowsParameters,
      4);
  }

  /**
   * Draws the enemy parameter with the given data at the designated point's coordinates.
   *
   * If the parameter name is {@link String.empty}, the name will be omitted entirely from drawing.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   * @param {number} iconIndex The icon index of the parameter.
   * @param {string} parameterName The name of the parameter.
   * @param {number} parameterValue The numeric value of the parameter.
   * @param {boolean=} maskValue Whether or not to mask the parameter value; defaults to false.
   * @param {number=} padZeroCount The number of zeroes to pad a masked parameter value with.
   * @param {number=} spacePlus Additional space to add between the name and value of this parameter.
   */
  drawEnemyParameter(
    x,
    y,
    iconIndex,
    parameterName,
    parameterValue,
    maskValue = false,
    padZeroCount = 8,
    spacePlus = 0)
  {
    // determine the padding for prefixing with an icon.
    const iconWidthPadding = iconIndex === 0
      ? 0   // no padding for no icon.
      : 40; // padding if we have an icon.

    // a small space between parameter name and value.
    const nameValueSpace = 48 + spacePlus;

    // draw the icon for the parameter.
    this.drawIcon(iconIndex, x, y);

    // calculate the x coordinate for the parameter name.
    const parameterNameX = x + iconWidthPadding;

    // calculate the parameter width.
    const parameterNameWidth = (parameterName !== String.empty)
      ? 300
      : 0;

    // start the parameter value x coordinate where the name is, in case we are skipping the name.
    let parameterValueX = parameterNameX;

    // check if we're adding the name.
    if (parameterName !== String.empty)
    {
      // names are bold!
      this.toggleBold(true);

      // draw the parameter name.
      this.drawText(`${parameterName}`, parameterNameX, y, parameterNameWidth, Window_Base.TextAlignments.Left);

      // disable bold when done writing.
      this.toggleBold(false);

      // the name was drawn, add the name plus x.
      parameterValueX += nameValueSpace;
    }

    // mask the value if we are commanded.
    const possiblyMaskedValue = maskValue
      ? J.BASE.Helpers.maskString(parameterValue.padZero(padZeroCount))
      : parameterValue.padZero(padZeroCount);

    // determine the width of the value.
    //const parameterValueWidth = this.textWidth(possiblyMaskedValue);
    const parameterValueWidth = (parameterName !== String.empty)
      ? 120
      : this.textWidth(possiblyMaskedValue);

    // draw the parameter value.
    this.drawEnemyParameterValue(parameterValueX, y, possiblyMaskedValue, parameterValueWidth)
  }

  /**
   * Draws an enemy's parameter value.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   * @param {string} value The stringified parameter value, possibly masked.
   * @param {number} width The width to work with.
   */
  drawEnemyParameterValue(x, y, value, width)
  {
    let isBold = false;
    this.changeTextColor(ColorManager.textColor(8))
    const charWidth = this.textWidth(value.charAt(0));
    const totalCharWidth = value.length * charWidth;
    [...value].forEach((char, index) =>
    {
      if (char !== "0")
      {
        isBold = true;
        this.changeTextColor(ColorManager.normalColor());
      }

      this.toggleBold(isBold);

      const charX = x + (index * charWidth) - totalCharWidth;

      this.drawText(char, charX, y, width, Window_Base.TextAlignments.Right);

      this.toggleBold(false);
    });

    this.changeTextColor(ColorManager.normalColor());
  }

  /**
   * Draws the list of an enemy's potential loot drops.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemyDrops(x, y)
  {
    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // draw the core rewards, like experience/gold/sdp earned.
    this.drawBasicRewards(x, y);

    // draw the sdp drop data.
    const sdpYPlus = lh * 4;
    this.drawSdpDrop(x, sdpYPlus);

    // draw the standard drops information.
    const dropsYPlus = lh * 6;
    this.drawStandardDrops(x, dropsYPlus);
  }

  /**
   * Draws the basic rewards such as exp/gold/sdp.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawBasicRewards(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // reduce the font size just a hair.
    this.modFontSize(0);

    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // we'll need the entire observations object for drops.
    const observations = this.getObservations();

    // grab the id out of the current observations.
    const { id, knowsParameters } = observations;

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // draw the experience data.
    const expIcon = IconManager.rewardParam(0);
    const expName = TextManager.rewardParam(0);
    const expValue = gameEnemy.exp();
    this.drawEnemyParameter(
      x,
      y,
      expIcon,
      expName,
      expValue,
      !knowsParameters,
      0);

    // draw the gold data.
    const goldIcon = IconManager.rewardParam(1);
    const goldName = TextManager.rewardParam(1);
    const goldValue = gameEnemy.gold();
    const goldYPlus = lh * 1;
    this.drawEnemyParameter(
      x,
      y + goldYPlus,
      goldIcon,
      goldName,
      goldValue,
      !knowsParameters,
      0);

    // draw the SDP data.
    const sdpIcon = IconManager.rewardParam(4);
    const sdpName = TextManager.rewardParam(4);
    const sdpValue = gameEnemy.sdpPoints();
    const sdpYPlus = lh * 2;
    this.drawEnemyParameter(
      x,
      y + sdpYPlus,
      sdpIcon,
      sdpName,
      sdpValue,
      !knowsParameters,
      0);
  }

  /**
   * Draws the sdp drop.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawSdpDrop(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // reduce the font size just a hair.
    this.modFontSize(-6);

    // we'll need the entire observations object for drops.
    const observations = this.getObservations();

    // grab the id out of the current observations.
    const { id, knowsParameters } = observations;

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // grab the list of possible drops this foe has.
    const sdpDropData = gameEnemy.getSdpDropData();

    if (sdpDropData === null || sdpDropData.at(0) === String.empty)
    {
      // draw the blurb about no SDP drop.
      const noSdpDropsText = `No SDP to unlock.`;
      const noSdpDropsTextWidth = this.textWidth(noSdpDropsText);
      this.drawText(noSdpDropsText, x, y, noSdpDropsTextWidth);

      // stop processing.
      return;
    }

    // extract the data from the sdp drop.
    const [ sdpKey, sdpDropChance, sdpItemId ] = sdpDropData;

    // grab the corresponding panel with this key.
    const panel = $gameSystem.getSdpByKey(sdpKey);

    // if there is no panel, then don't try to render it.
    if (!panel) return;

    // translate the drop chance to a percent.
    let dropText = `${sdpDropChance}%`;

    // check if the panel is also already unlocked.
    if (panel.isUnlocked())
    {
      // flip the text to a checkbox to indicate no need to seek it out.
      dropText = `✅`;
    }

    // extract the item data associated with the panel.
    const { name, iconIndex } = $dataItems.at(sdpItemId);

    // mask the name if applicable.
    const panelName = knowsParameters
      ? name
      : J.BASE.Helpers.maskString(name);

    // render the parameter.
    this.drawEnemyParameter(
      x,
      y,
      iconIndex,
      panelName,
      dropText,
      false,
      0,
      20);
  }

  /**
   * Draws the standard list of all loot that this enemy can drop.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawStandardDrops(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // reduce the font size just a hair.
    this.modFontSize(-6);

    // we'll need the entire observations object for drops.
    const observations = this.getObservations();

    // grab the id out of the current observations.
    const { id, numberDefeated } = observations;

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // grab the list of possible drops this foe has.
    const drops = gameEnemy.getDropItems();

    // if we have no drops, do not render them.
    if (!drops.length)
    {
      // render a "no drops" text blob.
      const noDropsText = `No standard drops to acquire.`;
      const noDropsTextWidth = this.textWidth(noDropsText);
      this.drawText(noDropsText, x, y, noDropsTextWidth);

      // stop processing.
      return;
    }

    // we skip healing drops like berries, so lets track how many were skipped.
    let numberSkipped = 0;

    // an iterator function for drawing drops if applicable.
    const forEacher = (drop, index) =>
    {
      if (this.isSkippableDrop(drop))
      {
        // add to the number of items we skipped.
        numberSkipped++;

        return;
      }

      // grab the implementation.
      const implementation = drop.toImplementation();

      // extract the data out of the drop with more accurate naming.
      const {
        dataId: dropId,
        denominator: dropChance,
        kind: dropType
      } = drop;

      // determine if we know this drop.
      const isDropKnown = observations.isDropKnown(dropType, dropId) || numberDefeated > 100;

      // the icon is determined by whether or not we know of this drop.
      const dropIcon = isDropKnown
        ? implementation.iconIndex
        : 93; // the question mark icon.

      // the name is masked if we haven't observed this drop.
      const dropName = isDropKnown
        ? implementation.name
        : J.BASE.Helpers.maskString(implementation.name);

      // draw the loot drop.
      const dropYPlus = (index - numberSkipped) * lh;
      this.drawEnemyParameter(
        x,
        y + dropYPlus,
        dropIcon,
        dropName,
        `${dropChance}%`,
        false,
        4);
    };

    // draw all the drops.
    drops.forEach(forEacher, this);
  }

  /**
   * Determines whether or not the drop should be drawn in the monsterpedia.
   * @param {RPG_DropItem} drop The drop to inspect.
   * @returns {boolean} True if this drop should be skipped, false otherwise.
   */
  isSkippableDrop(drop)
  {
    // SDP drops don't show up in this list.
    if (drop.isSdpDrop()) return true;

    // skippable items don't show up in this list.
    if (drop.kind === RPG_DropItem.Types.Item)
    {
      return this.skippableItemIds().includes(drop.dataId);
    }

    // skippable weapons don't show up in this list.
    if (drop.kind === RPG_DropItem.Types.Weapon)
    {
      return this.skippableWeaponIds().includes(drop.dataId);
    }

    // skippable armors don't show up in this list.
    if (drop.kind === RPG_DropItem.Types.Armor)
    {
      return this.skippableArmorIds().includes(drop.dataId);
    }

    return true;
  }

  /**
   * A list of item ids that shouldn't be drawn in the list of loot.
   * @returns {number[]}
   */
  skippableItemIds()
  {
    return [2, 3, 4, 8, 9];
  }

  /**
   * A list of weapon ids that shouldn't be drawn in the list of loot.
   * @returns {number[]}
   */
  skippableWeaponIds()
  {
    return [];
  }

  /**
   * A list of armor ids that shouldn't be drawn in the list of loot.
   * @returns {number[]}
   */
  skippableArmorIds()
  {
    return [];
  }

  /**
   * Draws the description text of an enemy.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawDescription(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // we'll need the entire observations object for drops.
    const observations = this.getObservations();

    // grab the id out of the current observations.
    const { id, knowsDescription } = observations;

    // grab a reference to the enemy for database analysis.
    const { monsterpediaDescription } = $dataEnemies.at(id);

    // reduce the font size for the description text.
    this.modFontSize(-4);

    // check to make sure we have a description.
    if (!monsterpediaDescription.length)
    {
      // render the missing description text if there is no description.
      const missingDescriptionText = "There is no description for this enemy.";
      const missingDescriptionTextWidth = this.textWidth(missingDescriptionText);
      this.drawText(missingDescriptionText, x, y, missingDescriptionTextWidth);

      // stop processing.
      return;
    }

    // iterate over each of the description lines and draw them.
    monsterpediaDescription.forEach((line, index) =>
    {
      const lineText = knowsDescription
        ? line
        : J.BASE.Helpers.maskString(line);
      const lineY = y + (lh * index);
      const lineWidth = this.textWidth(lineText);
      this.drawText(lineText, x, lineY, lineWidth);
    });
  }

  /**
   * Draws the elementalistics of an enemy.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawElementalistics(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // we'll need the entire observations object for drops.
    const observations = this.getObservations();

    // grab the id out of the current observations.
    const { id } = observations;

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // reduce the font size for the description text.
    this.modFontSize(-4);

    const validElementIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    validElementIds.forEach((elementId, index) =>
    {
      this.changeTextColor(ColorManager.normalColor());

      const elementIcon = IconManager.element(elementId);

      const elementName = TextManager.element(elementId);

      let elementRate = gameEnemy.elementRate(elementId) * 100;

      const knowsElementalistic = observations.isElementalisticKnown(elementId);

      if (!knowsElementalistic)
      {
        elementRate = J.BASE.Helpers.maskString(elementRate.padZero(4));
      }
      else
      {
        if (elementRate === 100)
        {
          this.changeTextColor(ColorManager.normalColor());
        }
        else if (elementRate > 100)
        {
          this.changeTextColor(ColorManager.textColor(10));
        }
        else if (elementRate < 100 && elementRate > 0)
        {
          this.changeTextColor(ColorManager.textColor(17));
        }
        else if (elementRate === 0)
        {
          this.changeTextColor(ColorManager.textColor(8));
        }
        else if (elementRate < 0)
        {
          this.changeTextColor(ColorManager.textColor(23));
        }
      }

      const elementYPlus = lh * index;
      this.drawEnemyParameter(
        x,
        y + elementYPlus,
        elementIcon,
        elementName,
        elementRate,
        false,
        4);
    });
  }

  /*
  TODO:
  sections include
  - regions found
  - ailmentalistics
  - elementalistics
   */
}