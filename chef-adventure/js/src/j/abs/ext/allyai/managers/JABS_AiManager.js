//region JABS_AiManager
J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.set('aiPhase0', JABS_AiManager.aiPhase0);
/**
 * Extends `aiPhase0()` to accommodate the possibility of actors having an idle phase.
 * @param {JABS_Battler} battler The batter to decide for.
 */
JABS_AiManager.aiPhase0 = function(battler)
{
  // check if this is an enemy's ai being managed.
  if (battler.isEnemy())
  {
    // perform original logic for enemies.
    J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.get('aiPhase0').call(this, battler);
  }
  // it must be an ally.
  else
  {
    // process ally idle phase.
    this.allyAiPhase0(battler);
  }
};

/**
 * Decides what to do for allies in their idle phase.
 * @param {JABS_Battler} allyBattler The ally battler.
 */
JABS_AiManager.allyAiPhase0 = function(allyBattler)
{
  // check if we can perform phase 0 things.
  if (!this.canPerformAllyPhase0(allyBattler)) return;

  // phase 0 for allies is just seeking for alerters if necessary.
  this.seekForAlerter(allyBattler);
};

/**
 * Determines whether or not the ally can do phase 0 things.
 * @param {JABS_Battler} allyBattler The ally battler.
 * @returns {boolean} True if this ally can do phae 0 things, false otherwise.
 */
JABS_AiManager.canPerformAllyPhase0 = function(allyBattler)
{
  // if we are not alerted, do not idle.
  if (!allyBattler.isAlerted()) return false;

  // if we are in active motion, do not idle.
  if (!allyBattler.getCharacter().isStopping()) return false;

  // perform!
  return true;
};

/**
 * Extends {@link #decideAiPhase2Action}.
 * Includes handling ally AI as well as enemy.
 * @param {JABS_Battler} battler The battler deciding the action.
 */
J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.set('decideAiPhase2Action', JABS_AiManager.decideAiPhase2Action);
JABS_AiManager.decideAiPhase2Action = function(battler)
{
  // check if the battler is an enemy.
  if (battler.isEnemy())
  {
    // perform original logic for enemies.
    J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.get('decideAiPhase2Action').call(this, battler);
  }
  // it isn't an enemy, it must be an ally.
  else
  {
    // perform ally AI instead.
    this.decideAllyAiPhase2Action(battler);
  }
};

/**
 * The ally battler decides what action to take.
 * Based on it's AI traits, it will make a decision on an action to take.
 * @param {JABS_Battler} jabsBattler The ally battler deciding the action.
 */
JABS_AiManager.decideAllyAiPhase2Action = function(jabsBattler)
{
  // grab the underlying battler deciding the action.
  const battler = jabsBattler.getBattler();

  // get all slots that have skills in them.
  const validSkillSlots = battler.getValidSkillSlotsForAlly();

  // convert the slots into their respective skill ids.
  const currentlyEquippedSkillIds = validSkillSlots.map(skillSlot => skillSlot.id);

  // decide the action based on the ally ai mode currently assigned.
  const decidedSkillId = jabsBattler
    .getAllyAiMode()
    .decideAction(
      jabsBattler,
      jabsBattler.getTarget(),
      currentlyEquippedSkillIds);

  // validate the skill chosen.
  if (!this.isSkillIdValid(decidedSkillId))
  {
    // cancel the setup.
    this.cancelActionSetup(jabsBattler);

    // stop processing.
    return;
  }

  // TODO: allow allies to use dodge skills, but code the AI to use it intelligently.
  // check if the skill id is actually a mobility skill.
  if (JABS_Battler.isDodgeSkillById(decidedSkillId))
  {
    // cancel the setup.
    this.cancelActionSetup(jabsBattler);

    // stop processing.
    return;
  }

  // determine the slot to apply the cooldown to.
  const decidedSkillSlot = battler.findSlotForSkillId(decidedSkillId);

  // build the cooldown from the skill.
  const cooldownKey = decidedSkillSlot.key;

  // setup the action for use!
  this.setupActionForNextPhase(jabsBattler, decidedSkillId, cooldownKey);
};
//endregion JABS_AiManager