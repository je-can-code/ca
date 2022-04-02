/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 DIFF] The various custom models created for difficulty.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-Difficulty
 * @orderBefore J-Difficulty
 * @help
 * ============================================================================
 * A component of the difficulty engine.
 * ============================================================================
 */

class Difficulty
{
  name = String.empty;
  key = String.empty;
  description = String.empty;
  iconIndex = 0;

  bparams = [100, 100, 100, 100, 100, 100, 100, 100];
  sparams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  xparams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

  exp = 100;
  gold = 100;
  sdp = 100;
  drops = 100;
  encounters = 100;

  unlocked = true;

  lock()
  {
    this.unlocked = false;
  };

  unlock()
  {
    this.unlocked = true;
  };
}

class DifficultyBuilder
{
  #name = String.empty;
  #key = String.empty;
  #description = String.empty;
  #iconIndex = 0;
  #bparams = [100, 100, 100, 100, 100, 100, 100, 100];
  #sparams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  #xparams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  #exp = 100;
  #gold = 100;
  #sdp = 100;
  #drops = 100;
  #encounters = 100;
  #unlocked = true;

  /**
   * Constructor.
   * @param {string} name The name of this difficulty.
   * @param {string} key The unique key of this difficulty.
   */
  constructor(name, key)
  {
    this.setName(name);
    this.setKey(key);
  };

  /**
   * Builds the difficulty with its current configuration.
   * @returns {Difficulty}
   */
  build()
  {
    const difficulty = new Difficulty();
    difficulty.name = this.#name;
    difficulty.key = this.#key;
    difficulty.description = this.#description;
    difficulty.iconIndex = this.#iconIndex;
    difficulty.bparams = this.#bparams;
    difficulty.sparams = this.#sparams;
    difficulty.xparams = this.#xparams;
    difficulty.exp = this.#exp;
    difficulty.gold = this.#gold;
    difficulty.sdp = this.#sdp;
    difficulty.drops = this.#drops;
    difficulty.encounters = this.#encounters;
    difficulty.unlocked = this.#unlocked;

    return difficulty;
  };

  setName(name)
  {
    this.#name = name;
    return this;
  };

  setKey(key)
  {
    this.#key = key;
    return this;
  };

  setDescription(description)
  {
    this.#description = description;
    return this;
  };

  setIconIndex(iconIndex)
  {
    this.#iconIndex = iconIndex;
    return this;
  };

  setBparam(paramId, value)
  {
    this.#bparams[paramId] = value;
    return this;
  };

  setSparam(paramId, value)
  {
    this.#sparams[paramId] = value;
    return this;
  };

  setXparam(paramId, value)
  {
    this.#xparams[paramId] = value;
    return this;
  };

  setExp(exp)
  {
    this.#exp = exp;
    return this;
  };

  setGold(gold)
  {
    this.#gold = gold;
    return this;
  };

  setSdp(sdp)
  {
    this.#sdp = sdp;
    return this;
  };

  setDrops(drops)
  {
    this.#drops = drops;
    return this;
  };

  setEncounters(encounters)
  {
    this.#encounters = encounters;
    return this;
  };

  setUnlocked(unlocked)
  {
    this.#unlocked = unlocked;
    return this;
  };
}