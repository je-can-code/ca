//region Ledger
/**
 * Keeps the books on every hit in the game: who hit whom, with what, and for how much.
 *
 * Whether a fight is fair is a question about numbers nobody can read off a screen at speed, and these
 * are the real ones, taken from each hit as it lands rather than worked out from the formulas.
 */
class Ledger
{
  /**
   * One row per attacker, target and skill.
   * @type {Map<string, {attacker: string, target: string, skill: string, hits: number, nothing: number,
   * misses: number, total: number, biggest: number}>}
   */
  #rows = new Map();

  /**
   * Finds or starts the row for a pairing.
   * @param {string} attacker Who attacked.
   * @param {string} target Who got attacked.
   * @param {string} skill What with.
   * @returns {object} The row.
   */
  #rowFor(attacker, target, skill)
  {
    const key = `${attacker}|${target}|${skill}`;

    if (this.#rows.has(key) === false)
    {
      this.#rows.set(key, { attacker, target, skill, hits: 0, nothing: 0, misses: 0, total: 0, biggest: 0 });
    }

    return this.#rows.get(key);
  }

  /**
   * Writes down the action that was just applied.
   * @param {Game_Action} action The action.
   * @param {Game_Battler} target Who it was applied to.
   */
  record(action, target)
  {
    const result = target.result();
    const row = this.#rowFor(action.subject().name(), target.name(), action.item().name);

    if (result.isHit() === false)
    {
      row.misses += 1;
      return;
    }

    // a hit for nothing is the interesting case: it landed, and the numbers ate it.
    if (result.hpDamage === 0)
    {
      row.nothing += 1;
      return;
    }

    row.hits += 1;
    row.total += result.hpDamage;
    row.biggest = Math.max(row.biggest, result.hpDamage);
  }

  /**
   * Gets every row, biggest damage first.
   * @returns {object[]}
   */
  rows()
  {
    return Array.from(this.#rows.values())
      .sort((left, right) => right.total - left.total);
  }
}

export default Ledger;
//endregion Ledger
