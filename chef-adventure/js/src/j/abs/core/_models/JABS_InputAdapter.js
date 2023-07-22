//region JABS_InputAdapter
/**
 * This static class governs the instructions of what to do regarding input.
 * Inputs are received by the JABS_InputController.
 * Inputs are sent from JABS_InputController to the JABS_InputAdapter.
 * The JABS_InputAdapter contains the instructions for what to do with inputs.
 */
class JABS_InputAdapter
{
  /**
   * A collection of registered controllers.
   * @type {JABS_InputController|any}
   */
  static controllers = [];

  /**
   * Constructor.
   * A static class though, so don't try to instantiate this.
   */
  constructor()
  {
    throw new Error('JABS_InputAdapter is a static class.')
  }

  /**
   * Registers a controller with this input adapter.
   * @param {JABS_InputController|any} controller The controller to register.
   */
  static register(controller)
  {
    this.controllers.push(controller);
  }

  /**
   * Checks whether or not any controllers have been registered
   * with this input adapter.
   * @returns {boolean} True if we have at least one registered controller, false otherwise.
   */
  static hasControllers()
  {
    return this.controllers.length > 0;
  }

  /**
   * Executes an action on the map based on the mainhand skill slot.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performMainhandAction(jabsBattler)
  {
    // if the mainhand action isn't ready, then do not perform.
    if (!this.#canPerformMainhandAction(jabsBattler)) return;

    // get all actions associated with the mainhand.
    const actions = jabsBattler.getAttackData(JABS_Button.Mainhand);

    // apply the cooldown type to the appropriate slot.
    actions.forEach(action => action.setCooldownType(JABS_Button.Mainhand));

    // set the player's pending actions action to this skill.
    jabsBattler.setDecidedAction(actions);

    // set the cast time for this battler to the primary skill in the list.
    jabsBattler.setCastCountdown(actions[0].getCastTime());

    // reset the combo data now that we are executing the actions.
    jabsBattler.resetComboData(JABS_Button.Mainhand);
  }

  /**
   * Determines whether or not the player can execute the mainhand action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformMainhandAction(jabsBattler)
  {
    // do not perform actions if there is pedestrians infront of you!
    if ($gameMap.hasInteractableEventInFront(jabsBattler)) return false;

    // if the battler can't use attacks, then do not perform.
    if (!jabsBattler.canBattlerUseAttacks()) return false;

    // if the mainhand action isn't ready, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(JABS_Button.Mainhand)) return false;

    // get all actions associated with the mainhand.
    const actions = jabsBattler.getAttackData(JABS_Button.Mainhand);

    // if there are none, then do not perform.
    if (!actions || !actions.length) return false;

    // if the player is casting, then do not perform.
    if (jabsBattler.isCasting()) return false;

    // perform!
    return true;
  }

  /**
   * Executes an action on the map based on the offhand skill slot.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performOffhandAction(jabsBattler)
  {
    // if the offhand action isn't ready, then do not perform.
    if (!this.#canPerformOffhandAction(jabsBattler)) return;

    // get all actions associated with the offhand.
    const actions = jabsBattler.getAttackData(JABS_Button.Offhand);

    // apply the cooldown type to the appropriate slot.
    actions.forEach(action => action.setCooldownType(JABS_Button.Offhand));

    // set the player's pending actions action to this skill.
    jabsBattler.setDecidedAction(actions);

    // set the cast time for this battler to the primary skill in the list.
    jabsBattler.setCastCountdown(actions[0].getCastTime());

    // reset the combo data now that we are executing the actions.
    jabsBattler.resetComboData(JABS_Button.Offhand);
  }

  /**
   * Determines whether or not the player can execute the offhand action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformOffhandAction(jabsBattler)
  {
    // if the offhand skill is actually a guard skill, then do not perform.
    if (jabsBattler.isGuardSkillByKey(JABS_Button.Offhand)) return false;

    // do not perform actions if there is pedestrians infront of you!
    if ($gameMap.hasInteractableEventInFront(jabsBattler)) return false;

    // if the battler can't use attacks, then do not perform.
    if (!jabsBattler.canBattlerUseAttacks()) return false;

    // if the offhand action isn't ready, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(JABS_Button.Offhand)) return false;

    // get all actions associated with the offhand.
    const actions = jabsBattler.getAttackData(JABS_Button.Offhand);

    // if there are none, then do not perform.
    if (!actions || !actions.length) return false;

    // if the player is casting, then do not perform.
    if (jabsBattler.isCasting()) return false;

    // perform!
    return true;
  }

  /**
   * Begins the execution of a tool.
   * Depending on the equipped tool, this can perform a variety of types of actions.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performToolAction(jabsBattler)
  {
    // if the tool action isn't ready, then do not perform.
    if (!this.#canPerformToolAction(jabsBattler)) return;

    // grab the tool id currently equipped.
    const toolId = jabsBattler.getBattler().getEquippedSkillId(JABS_Button.Tool);

    // perform tool effects!
    jabsBattler.applyToolEffects(toolId);
  }

  /**
   * Determines whether or not the player can execute the tool action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformToolAction(jabsBattler)
  {
    // if the tool is not off cooldown, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(JABS_Button.Tool)) return false;

    // if there is no tool equipped, then do not perform.
    if (!jabsBattler.getBattler().getEquippedSkillId(JABS_Button.Tool)) return false;

    // perform!
    return true;
  }

  /**
   * Executes the dodge action.
   * The player will perform some sort of mobility action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performDodgeAction(jabsBattler)
  {
    // check if we can dodge.
    if (!this.#canPerformDodge(jabsBattler)) return;

    // perform the dodge skill.
    jabsBattler.tryDodgeSkill();
  }

  /**
   * Determines whether or not the player can perform a dodge skill.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformDodge(jabsBattler)
  {
    // if the dodge skill is not off cooldown, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(JABS_Button.Dodge)) return false;

    // if the player is unable to move for some reason, do not perform.
    if (!jabsBattler.canBattlerMove()) return false;

    // perform!
    return true;
  }

  /**
   * Begins execution of a skill based on any of the L1 + ABXY skill slots.
   * @param {number} slot The slot associated with the combat action.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performCombatAction(slot, jabsBattler)
  {
    // if the offhand action isn't ready, then do not perform.
    if (!this.#canPerformCombatActionBySlot(slot, jabsBattler)) return;

    // get all actions associated with the offhand.
    const actions = jabsBattler.getAttackData(slot);

    // set the player's pending actions action to this skill.
    jabsBattler.setDecidedAction(actions);

    // set the cast time for this battler to the primary skill in the list.
    jabsBattler.setCastCountdown(actions[0].getCastTime());
  }

  /**
   * Determines whether or not the player can execute the combat action.
   * @param {string} slot The slot to check if is able to be used.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformCombatActionBySlot(slot, jabsBattler)
  {
    // if the battler can't use attacks, then do not perform.
    if (!jabsBattler.canBattlerUseSkills()) return false;

    // if the slot is empty, then do not perform.
    if (jabsBattler.getBattler().getSkillSlot(slot).isEmpty()) return false;

    // if the offhand action isn't ready, then do not perform.
    if (!jabsBattler.isSkillTypeCooldownReady(slot)) return false;

    // if the battler is already casting, then do not perform.
    if (jabsBattler.isCasting()) return false;

    // if there is no action data for the skill, then do not perform.
    if (jabsBattler.getAttackData(slot).length === 0) return false;

    // perform!
    return true;
  }

  /**
   * Executes the strafe action.
   * The player will not change the direction they are facing while strafing is active.
   * @param {boolean} strafing True if the player is strafing, false otherwise.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performStrafe(strafing, jabsBattler)
  {
    // check if we can strafe.
    if (!this.#canPerformStrafe(jabsBattler)) return;

    // perform the strafe.
    jabsBattler.getCharacter().setDirectionFix(strafing);
  }

  /**
   * Determines whether or not the player can strafe and hold direction while moving.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformStrafe(jabsBattler)
  {
    return true;
  }

  /**
   * Executes the rotation action.
   * The player will not change move while rotation is active.
   * @param {boolean} rotating True if the player is rotating, false otherwise.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performRotate(rotating, jabsBattler)
  {
    // check if we can rotate.
    if (!this.#canPerformRotate(jabsBattler)) return;

    // perform the rotation.
    jabsBattler.setMovementLock(rotating);
  }

  /**
   * Determines whether or not the player can rotate in-place without movement.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformRotate(jabsBattler)
  {
    return true;
  }

  /**
   * Executes the guard action.
   * The player will only perform the guard action if the offhand slot is a guard-ready skill.
   * @param {boolean} guarding True if the player is guarding, false otherwise.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   */
  static performGuard(guarding, jabsBattler)
  {
    // check if we can guard with the offhand slot.
    if (!this.#canPerformGuardBySlot(JABS_Button.Offhand, jabsBattler)) return;

    // perform the guard skill in the offhand slot.
    jabsBattler.executeGuard(guarding, JABS_Button.Offhand);
  }

  /**
   * Determines whether or not the player can guard.
   * @param {string} slot The slot to check if is able to be used.
   * @param {JABS_Battler} jabsBattler The battler performing the action.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformGuardBySlot(slot, jabsBattler)
  {
    // if the offhand slot is not a guard skill, then do not perform.
    if (!jabsBattler.isGuardSkillByKey(slot)) return false;

    // perform!
    return true;
  }

  /**
   * Rotates the leader out to the back and pulls in the next-in-line.
   *
   * NOTE:
   * The logic of party cycling remains in the engine for exposure.
   */
  static performPartyCycling(force = false)
  {
    // check if we can party cycle.
    if (!this.#canPerformPartyCycling(force)) return;

    // execute the party cycling.
    $jabsEngine.performPartyCycling(force);
  }

  /**
   * Determines whether or not the player can party cycle.
   * @param {boolean} force Using `force` overrides party-cycle-lock.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformPartyCycling(force)
  {
    // if rotating is disabled, then skip- forced cycling bypasses this check.
    if (!$gameParty.canPartyCycle() && !force) return false;

    // you can't rotate if there is no party to rotate through.
    if ($gameParty._actors.length === 1) return false;

    // cycle!
    return true;
  }

  /**
   * Calls the JABS quick menu on the map.
   */
  static performMenuAction()
  {
    // if we cannot call the menu, then do not.
    if (!this.#canPerformMenuAction()) return;

    // pause JABS.
    $jabsEngine.absPause = true;

    // request the menu.
    $jabsEngine.requestAbsMenu = true;
  }

  /**
   * Determines whether or not we can call the menu.
   * @returns {boolean} True if they can, false otherwise.
   */
  static #canPerformMenuAction()
  {
    // there are currently no conditions for accessing the JABS menu.
    return true;
  }
}
//endregion JABS_InputAdapter