//region MapLogBuilder
/**
 * A fluent-builder for the logger on the map.
 */
class MapLogBuilder
{
  /**
   * The current message that this log contains.
   * @type {string}
   */
  #message = "message-unset";

  /**
   * Builds the log based on the currently provided info.
   * @returns {Map_Log} The built log.
   */
  build()
  {
    // instantiate the log.
    const log = new Map_Log(this.#message);

    // clear this builder of its instance data.
    this.#clear();

    // return the log.
    return log;
  }

  /**
   * Clears the current parameters for this log.<br/>
   * This automatically runs after `build()` is run.
   */
  #clear()
  {
    this.#message = String.empty;
  }

  /**
   * Sets the message of this log.
   * @param {string} message The message to set for this log to display.
   * @returns {this} This builder, for fluent chaining.
   */
  setMessage(message)
  {
    this.#message = message;
    return this;
  }

  /**
   * Wraps a name within a text coded color.
   * @param {string} name The name to wrap.
   * @param {number} textColorIndex The text color index to wrap the name in.
   * @returns {string} The wrapped name with the text coded color.
   */
  #wrapName(name, textColorIndex)
  {
    return `\\C[${textColorIndex}]${name}\\C[0]`;
  }

  /**
   * Sets up a message based on the context of a target battler being hit by a caster's skill.
   * @param {string} targetName The name of the target battler hit by the skill.
   * @param {string} casterName The name of the battler who casted the skill.
   * @param {number} skillId The id of the skill the target was hit by.
   * @param {string} amount The amount of damage (as string) the target battler was hit for.
   * @param {string} reduction The amount of damage (as string) the target battler mitigated.
   * @param {boolean} isHealing True if this is healing, false otherwise.
   * @param {boolean} isCritical True if this is critical, false otherwise.
   * @returns {this} This builder, for fluent chaining.
   */
  setupExecution(targetName, casterName, skillId, amount, reduction, isHealing, isCritical)
  {
    // the caster's name, wrapped in an aggressive color.
    const aggressor = this.#wrapName(casterName, 2);

    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // determine the type of execution this is, hurting or healing.
    let hurtOrHeal;
    if (isCritical)
    {
      hurtOrHeal = isHealing ? "critically healed" : "landed a critical";
    }
    else
    {
      hurtOrHeal = isHealing ? "healed" : "hit";
    }

    // the text color index is based on whether or not its flagged as healing.
    const color = isHealing ? 29 : 10;

    // construct the message.
    // eslint-disable-next-line max-len
    const message = `${aggressor} ${hurtOrHeal} ${defender} with \\Skill[${skillId}] for \\C[${color}]${amount}\\C[0]${reduction}!`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of a battler being defeated.
   * @param {string} targetName The name of the battler defeated.
   * @returns {this} This builder, for fluent chaining.
   */
  setupTargetDefeated(targetName)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} was defeated.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of an actor learning a skill.
   * @param {string} targetName The name of the actor learning the skill.
   * @param {number} skillIdLearned The id of the skill being learned.
   * @returns {this} This builder, for fluent chaining.
   */
  setupSkillLearn(targetName, skillIdLearned)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} learned \\Skill[${skillIdLearned}]!`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of an actor leveling up.
   * @param {string} targetName The name of the actor reaching a new level.
   * @param {number} levelReached The level newly reached.
   * @returns {this} This builder, for fluent chaining.
   */
  setupLevelUp(targetName, levelReached)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} has reached level \\*${levelReached}\\*!`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of a battler becoming afflicted with a state.
   * @param {string} targetName The name of the battler becoming afflicted.
   * @param {number} stateId The state id of the state being afflicted.
   * @returns {this} This builder, for fluent chaining.
   */
  setupStateAfflicted(targetName, stateId)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} became afflicted with \\State[${stateId}].`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of a battler retaliating.
   * @param {string} targetName The name of the battler retaliating.
   * @returns {this} This builder, for fluent chaining.
   */
  setupRetaliation(targetName)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} retaliated!`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of a battler parrying a caster's skill.
   * @param {string} targetName The name of the battler parrying.
   * @param {string} casterName The name of the battler being parried.
   * @param {number} skillId The id of the skill being parried.
   * @param {boolean} isPreciseParry True if the parry is a precise parry, false otherwise.
   * @returns {this} This builder, for fluent chaining.
   */
  setupParry(targetName, casterName, skillId, isPreciseParry)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const prefix = isPreciseParry ? "precise-" : "";
    const suffix = isPreciseParry ? " with finesse!" : ".";
    const message = `${defender} ${prefix}parried ${casterName}'s \\Skill[${skillId}]${suffix}`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of a battler dodging the caster's skill.
   * @param {string} targetName The name of the battler dodging.
   * @param {string} casterName The name of the battler being dodged.
   * @param {number} skillId The id of the skill being dodged.
   * @returns {this} This builder, for fluent chaining.
   */
  setupDodge(targetName, casterName, skillId)
  {
    // the caster's name, wrapped in an aggressive color.
    const aggressor = this.#wrapName(casterName, 2);

    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} dodged ${aggressor}'s \\Skill[${skillId}].`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of a battler landing a skill on another battler,
   * but the spell did no damage and applied no states.
   * @param {string} targetName The name of the battler dodging.
   * @param {string} casterName The name of the battler being dodged.
   * @param {number} skillId The id of the skill being dodged.
   * @returns {this} This builder, for fluent chaining.
   */
  setupUndamaged(targetName, casterName, skillId)
  {
    // construct the message.
    // eslint-disable-next-line max-len
    const message = `\\C[16]${casterName}\\C[0] used \\Skill[${skillId}], but it had no effect on \\C[2]${targetName}\\C[0].`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of party cycling to a given battler.
   * @param {string} targetName The name of the battler being party cycled to.
   * @returns {this} This builder, for fluent chaining.
   */
  setupPartyCycle(targetName)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `Party cycled to ${defender}.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of a battler using an item.
   * @param {string} targetName The name of the battler being party cycled to.
   * @param {number} itemId The id of the item we're using the last of.
   * @returns {this} This builder, for fluent chaining.
   */
  setupUsedItem(targetName, itemId)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} used the \\Item[${itemId}].`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of using the last item/tool and unequipping it.
   * @param {number} itemId The id of the item we're using the last of.
   * @returns {this} This builder, for fluent chaining.
   */
  setupUsedLastItem(itemId)
  {
    // construct the message.
    const message = `The last \\Item[${itemId}] was consumed and unequipped.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on teh context of a battler earning experience.
   * @param {string} targetName The name of the battler earning experience.
   * @param {number} expGained The amount of experience earned by the battler.
   * @returns {this} This builder, for fluent chaining.
   */
  setupExperienceGained(targetName, expGained)
  {
    // wrap the amount in the appropriate color.
    const exp = this.#translateReward("exp", expGained);

    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} gained \\*${exp}\\* experience.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Sets up a message based on the context of the party finding gold.
   * @param {number} goldFound The amount of gold found by the party.
   * @returns {this} This builder, for fluent chaining.
   */
  setupGoldFound(goldFound)
  {
    // wrap the amount in the appropriate color.
    const gold = this.#translateReward("gold", goldFound);

    // construct the message.
    const message = `The party found \\*${gold}\\* gold.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  #translateReward(rewardType, amount)
  {
    switch (rewardType)
    {
      case "exp":
        return `\\C[6]${amount}\\C[0]`;
      case "gold":
        return `\\C[14]${amount}\\C[0]`;
      default:
        return amount;
    }
  }

  /**
   * Sets up a message based on the context of the player picking up loot.
   * @param {string} targetName The name of the player.
   * @param {"armor"|"weapon"|"item"} lootType One of "armor", "weapon", or "item".
   * @param {number} lootId The id of the loot from the database.
   * @returns {this} This builder, for fluent chaining.
   */
  setupLootObtained(targetName, lootType, lootId)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // translate the loot based on type and id.
    const loot = this.#translateLoot(lootType, lootId);

    // construct the message.
    const message = `${defender} obtained the \\*${loot}\\*.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }

  /**
   * Translates into the proper text code based on loot type and id.
   * @param {"armor"|"weapon"|"item"} lootType One of "armor", "weapon", or "item".
   * @param {number} lootId The id of the loot from the database.
   * @returns {string} The compiled wrapped text code of the loot.
   */
  #translateLoot(lootType, lootId)
  {
    switch (lootType)
    {
      case "armor":
        return `\\Armor[${lootId}]`;
      case "weapon":
        return `\\Weapon[${lootId}]`;
      case "item":
        return `\\Item[${lootId}]`;
      default:
        return String.empty;
    }
  }

  /**
   * Sets up a message based on the context of a battler earning SDP points.
   * @param {string} targetName The name of the battler earning points.
   * @param {number} amount The amount of SDP points earned.
   * @returns {this} This builder, for fluent chaining.
   */
  setupSdpAcquired(targetName, amount)
  {
    // the target's name, wrapped in a defender color.
    const defender = this.#wrapName(targetName, 16);

    // construct the message.
    const message = `${defender} acquired \\*${amount}\\* SDP points.`;

    // assign the message to this log.
    this.setMessage(message);

    // return the builder for continuous building.
    return this;
  }
}
//endregion MapLogBuilder