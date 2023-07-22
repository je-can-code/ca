//region RPG_BaseBattler
/**
 * A class representing the groundwork for what all battlers
 * database data look like.
 */
class RPG_BaseBattler extends RPG_Base
{
  /**
   * The name of the battler while in battle.
   * @type {string}
   */
  battlerName = String.empty;

  /**
   * The collection of traits this battler has.
   * @type {RPG_Trait[]}
   */
  traits = [];

  /**
   * Constructor.
   * Maps the base battler data to the properties on this class.
   * @param {RPG_Enemy|rm.types.Actor} battler The battler to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(battler, index)
  {
    // perform original logic.
    super(battler, index);

    // map core battler data onto this object.
    this.battlerName = battler.battlerName;
    this.traits = battler.traits
      .map(trait => new RPG_Trait(trait));
  }
}
//endregion RPG_BaseBattler