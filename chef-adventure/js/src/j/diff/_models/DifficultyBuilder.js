//region DifficultyBuilder
/**
 * The fluent-builder for easily creating new difficulties.
 */
class DifficultyBuilder 
{
  #name = String.empty;
  #key = String.empty;
  #description = String.empty;
  #iconIndex = 0;
  #cost = 0;

  #actorEffects = new DifficultyBattlerEffects();
  #enemyEffects = new DifficultyBattlerEffects();

  #exp = 100;
  #gold = 100;
  #sdp = 100;
  #drops = 100;
  #encounters = 100;

  #enabled = false;
  #unlocked = true;
  #hidden = false;

  /**
   * Constructor.
   * @param {string} name The name of this difficulty.
   * @param {string} key The unique key of this difficulty.
   */
  constructor(name, key) 
  {
    this.setName(name);
    this.setKey(key);
  }

  /**
   * Builds the difficulty with its current configuration.
   * @returns {DifficultyMetadata}
   */
  build() 
  {
    // start the difficulty here.
    const difficulty = new DifficultyMetadata();

    // assign the core data.
    difficulty.name = this.#name;
    difficulty.key = this.#key;
    difficulty.description = this.#description;
    difficulty.iconIndex = this.#iconIndex;
    difficulty.cost = this.#cost;

    // assign the battler effects.
    difficulty.actorEffects = this.#actorEffects;
    difficulty.enemyEffects = this.#enemyEffects;

    // assign the bonuses.
    difficulty.exp = this.#exp;
    difficulty.gold = this.#gold;
    difficulty.sdp = this.#sdp;
    difficulty.drops = this.#drops;
    difficulty.encounters = this.#encounters;

    // assign the access booleans.
    difficulty.enabled = this.#enabled;
    difficulty.unlocked = this.#unlocked;
    difficulty.hidden = this.#hidden;

    // return the built product.
    return difficulty;
  }

  setName(name) 
  {
    this.#name = name;
    return this;
  }

  setKey(key) 
  {
    this.#key = key;
    return this;
  }

  setDescription(description) 
  {
    this.#description = description;
    return this;
  }

  setIconIndex(iconIndex) 
  {
    this.#iconIndex = iconIndex;
    return this;
  }

  setCost(cost) 
  {
    this.#cost = cost;
    return this;
  }

  setActorEffects(effects) 
  {
    this.#actorEffects = effects;
    return this;
  }

  setEnemyEffects(effects)
  {
    this.#enemyEffects = effects;
    return this;
  }

  setExp(exp)
  {
    this.#exp = exp;
    return this;
  }

  setGold(gold)
  {
    this.#gold = gold;
    return this;
  }

  setSdp(sdp)
  {
    this.#sdp = sdp;
    return this;
  }

  setDrops(drops)
  {
    this.#drops = drops;
    return this;
  }

  setEncounters(encounters)
  {
    this.#encounters = encounters;
    return this;
  }

  setUnlocked(unlocked)
  {
    this.#unlocked = unlocked;
    return this;
  }

  setEnabled(enabled)
  {
    this.#enabled = enabled;
    return this;
  }

  setHidden(hidden)
  {
    this.#hidden = hidden;
    return this;
  }
}
//endregion DifficultyBuilder