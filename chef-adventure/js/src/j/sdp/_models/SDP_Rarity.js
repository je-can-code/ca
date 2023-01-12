//region SDP_Rarity
class SDP_Rarity
{
  /**
   * Common SDPs that bring few pros and many cons.
   * @type {"Common"}
   */
  static Common = "Common";

  /**
   * Magical SDPs that are usually fairly balanced.
   * @type {"Magical"}
   */
  static Magical = "Magical";

  /**
   * Rare SDPs that are skewed in favor of the player granting many positives.
   * @type {"Rare"}
   */
  static Rare = "Rare";

  /**
   * Epic SDPs that make a significant difference if the player chooses to
   * master it.
   * @type {"Epic"}
   */
  static Epic = "Epic";

  /**
   * Legendary SDPs that can easily make-or-break the flow of battle with the
   * immense boons they bring.
   * @type {"Legendary"}
   */
  static Legendary = "Legendary";

  /**
   * Godlike SDPs that are few and far between, because they are tremendously
   * imbalanced in favor of the player. The player would be a fool to not master
   * this as soon as possible.
   * @type {string}
   */
  static Godlike = "Godlike";

  /**
   * Convert the string form of an SDP's rarity into a color index.
   * @param {string} rarity The word associated with the rarity.
   * @returns {number}
   */
  static fromRarityToColor(rarity)
  {
    switch (rarity)
    {
      case this.Common:
        return 0;
      case this.Magical:
        return 3;
      case this.Rare:
        return 23;
      case this.Epic:
        return 31;
      case this.Legendary:
        return 20;
      case this.Godlike:
        return 25;
      default:
        console.warn("if modifying the rarity dropdown options, be sure to fix them here, too.");
        console.warn(`${rarity} was not an implemented option.`);
        return 0;
    }
  }
}
//endregion SDP_Rarity