//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.0 POPUPS-ABS] Combat and reward popups for JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Popups
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-Popups
 * @orderAfter J-ABS
 * @param disableSkillUsedPopups
 * @text Disable skill-used popups
 * @type boolean
 * @default false
 * @desc When true, hides the floating skill name on the caster only; damage/healing/reward popups still show.
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of J-Popups for J-ABS.
 *
 * Have you ever wanted floating popups for all of that glorious combat chaos
 * your JABS game dishes out- damage numbers, healing, experience, gold, loot,
 * level-ups, and skill learns? Well now you can! This plugin wires up popup
 * builders for every major JABS combat and reward event.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Popup construction is handled through JABS_PopupManager, which provides
 * dedicated builder methods for each popup type. All popups are displayed on
 * the relevant battler's or character's map sprite.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.2.0
 *    Plugin parameter disableSkillUsedPopups suppresses caster skill-name popups only.
 * - 1.1.0
 *    Extracted popup construction into a dedicated JABS_PopupManager class.
 *    Added ABS-specific TextPopBuilder and Map_TextPop extensions in _models/.
 *    Renamed source files to standard JABS naming conventions.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//endregion Introduction

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
J.POPUPS.EXT.ABS = {};

J.POPUPS.EXT.ABS.PluginParameters = PluginManager.parameters('J-Popups-ABS');

/**
 * When true, {@link JABS_PopupManager.showSkillUsedPop} returns early (damage and other ABS popups unchanged).
 * @type {boolean}
 */
J.POPUPS.EXT.ABS.DisableSkillUsedPopups = J.POPUPS.EXT.ABS.PluginParameters['disableSkillUsedPopups'] === 'true';

/**
 * A collection of all aliased methods for this plugin.
 */
J.POPUPS.EXT.ABS.Aliased = {};
J.POPUPS.EXT.ABS.Aliased.JABS_Engine = new Map();
J.POPUPS.EXT.ABS.Aliased.JABS_Battler = new Map();
J.POPUPS.EXT.ABS.Aliased.Game_Action = new Map();
//endregion initialization

//region Map_TextPop
/**
 * The popup type for shield interactions.
 */
Map_TextPop.Types.Shield = 'shield';
//endregion Map_TextPop

//region TextPopBuilder
/**
 * Add convenient defaults for configuring a shield-damage popup.
 * @returns {TextPopBuilder}
 */
TextPopBuilder.prototype.isShieldDamage = function()
{
  this.setPopupType(Map_TextPop.Types.Shield);
  this.setXVariance(0);
  this.setYVariance(64);
  this.setTextColorIndex(8);
  this.setIconIndex(448);
  this.forCenterFocusRing();
  return this;
};

/**
 * Add convenient defaults for configuring a shield-break popup.
 * @returns {TextPopBuilder}
 */
TextPopBuilder.prototype.isShieldBreak = function()
{
  this.setPopupType(Map_TextPop.Types.Shield);
  this.setXVariance(20);
  this.setYVariance(64);
  this.setTextColorIndex(7);
  this.setIconIndex(448);
  this.forCenterFocusRing();
  return this;
};
//endregion TextPopBuilder

//region JABS_Engine
/**
 * Extends {@link #postPrimaryBattleEffects}.<br/>
 * Also shows attack damage and skill-used popups on the affected battlers.
 */
J.POPUPS.EXT.ABS.Aliased.JABS_Engine.set('postPrimaryBattleEffects', JABS_Engine.prototype.postPrimaryBattleEffects);
JABS_Engine.prototype.postPrimaryBattleEffects = function(action, target)
{
  J.POPUPS.EXT.ABS.Aliased.JABS_Engine.get('postPrimaryBattleEffects')
    .call(this, action, target);

  JABS_PopupManager.showAttackPop(action, target, this);
  JABS_PopupManager.showSkillUsedPop(action);
};

/**
 * Extends {@link #gainExperienceReward}.<br/>
 * Also shows an experience popup on the caster's character.
 */
J.POPUPS.EXT.ABS.Aliased.JABS_Engine.set('gainExperienceReward', JABS_Engine.prototype.gainExperienceReward);
JABS_Engine.prototype.gainExperienceReward = function(experience, casterCharacter)
{
  J.POPUPS.EXT.ABS.Aliased.JABS_Engine.get('gainExperienceReward')
    .call(this, experience, casterCharacter);

  if (!experience) return;

  JABS_PopupManager.showExperiencePop(experience, casterCharacter);
};

/**
 * Extends {@link #gainGoldReward}.<br/>
 * Also shows a gold popup on the character.
 */
J.POPUPS.EXT.ABS.Aliased.JABS_Engine.set('gainGoldReward', JABS_Engine.prototype.gainGoldReward);
JABS_Engine.prototype.gainGoldReward = function(gold, character)
{
  J.POPUPS.EXT.ABS.Aliased.JABS_Engine.get('gainGoldReward')
    .call(this, gold, character);

  if (!gold) return;

  JABS_PopupManager.showGoldPop(gold, character);
};

/**
 * Extends {@link #onItemPickedUp}.<br/>
 * Also shows item-loot popups on the character.
 */
J.POPUPS.EXT.ABS.Aliased.JABS_Engine.set('onItemPickedUp', JABS_Engine.prototype.onItemPickedUp);
JABS_Engine.prototype.onItemPickedUp = function(itemDataList, character)
{
  J.POPUPS.EXT.ABS.Aliased.JABS_Engine.get('onItemPickedUp')
    .call(this, itemDataList, character);

  JABS_PopupManager.showItemPickedUpPops(itemDataList, character);
};

/**
 * Extends {@link #battlerLevelup}.<br/>
 * Also shows a level-up popup on the battler's character.
 */
J.POPUPS.EXT.ABS.Aliased.JABS_Engine.set('battlerLevelup', JABS_Engine.prototype.battlerLevelup);
JABS_Engine.prototype.battlerLevelup = function(uuid)
{
  J.POPUPS.EXT.ABS.Aliased.JABS_Engine.get('battlerLevelup')
    .call(this, uuid);

  const battler = JABS_AiManager.getBattlerByUuid(uuid);
  if (battler)
  {
    JABS_PopupManager.showLevelUpPop(battler.getCharacter());
  }
};

/**
 * Extends {@link #battlerSkillLearn}.<br/>
 * Also shows a skill-learn popup on the battler's character.
 */
J.POPUPS.EXT.ABS.Aliased.JABS_Engine.set('battlerSkillLearn', JABS_Engine.prototype.battlerSkillLearn);
JABS_Engine.prototype.battlerSkillLearn = function(skill, uuid)
{
  J.POPUPS.EXT.ABS.Aliased.JABS_Engine.get('battlerSkillLearn')
    .call(this, skill, uuid);

  const battler = JABS_AiManager.getBattlerByUuid(uuid);
  if (battler)
  {
    JABS_PopupManager.showSkillLearnPop(skill, battler.getCharacter());
  }
};
//endregion JABS_Engine

//region JABS_PopupManager
/**
 * A static utility for building and dispatching JABS-related map popups.
 * All methods delegate final dispatch to {@link TextPopManager}.
 */
class JABS_PopupManager
{
  /**
   * Builds and dispatches a combat-result popup on the target's character.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The target battler.
   * @param {JABS_Engine} engine The live engine instance (for elemental icon resolution).
   */
  static showAttackPop(action, target, engine)
  {
    const character = target.getCharacter();
    const pop = JABS_PopupManager.buildDamagePop(action, target, engine);
    TextPopManager.show(pop, character);
  }

  /**
   * Builds the combat-result {@link Map_TextPop} for an action on a target.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The target battler.
   * @param {JABS_Engine} engine The live engine instance.
   * @returns {Map_TextPop}
   */
  static buildDamagePop(action, target, engine)
  {
    const skill = action.getBaseSkill();
    const caster = action.getCaster();
    const gameAction = action.getAction();
    const targetBattler = target.getBattler();
    const actionResult = targetBattler.result();

    let elementalRate;
    if (J.ELEM)
    {
      elementalRate = gameAction.calculateRawElementRate(targetBattler);
    }
    else
    {
      elementalRate = gameAction.calcElementRate(targetBattler);
    }

    const elementalIcon = engine.determineElementalIcon(skill, caster);
    const iconIndex = actionResult.parried
      ? 128
      : elementalIcon;

    const textPopBuilder = new TextPopBuilder(0);

    switch (true)
    {
      case actionResult.parried:
        textPopBuilder
          .setValue(`PARRY!`)
          .setPopupType(Map_TextPop.Types.Parry)
          .forCenterFocusRing()
          .setTextAccent(`parry`);
        break;
      case actionResult.evaded:
        textPopBuilder
          .setValue(`DODGE`)
          .setPopupType(Map_TextPop.Types.Evade)
          .forCenterFocusRing()
          .setTextAccent(`evade`);
        break;
      case actionResult.hpDamage !== 0:
        textPopBuilder
          .setValue(actionResult.hpDamage)
          .isHpDamage();
        if (actionResult.hpDamage < 0)
        {
          textPopBuilder.forIncomingHealRing();
        }
        else
        {
          textPopBuilder.forEnemyDamageRing();
        }
        break;
      case actionResult.mpDamage !== 0:
        textPopBuilder
          .setValue(actionResult.mpDamage)
          .isMpDamage();
        if (actionResult.mpDamage < 0)
        {
          textPopBuilder.forIncomingHealRing();
        }
        else
        {
          textPopBuilder.forEnemyDamageRing();
        }
        break;
      case actionResult.tpDamage !== 0:
        textPopBuilder
          .setValue(actionResult.tpDamage)
          .isTpDamage();
        if (actionResult.tpDamage < 0)
        {
          textPopBuilder.forIncomingHealRing();
        }
        else
        {
          textPopBuilder.forEnemyDamageRing();
        }
        break;
      default:
        textPopBuilder
          .setValue(actionResult.hpDamage)
          .isHpDamage()
          .forEnemyDamageRing();
        break;
    }

    return textPopBuilder
      .setIconIndex(iconIndex)
      .isElemental(elementalRate)
      .setCritical(actionResult.critical)
      .build();
  }

  /**
   * Dispatches a skill-used popup on the caster's character.
   * @param {JABS_Action} action The action whose caster should show the popup.
   */
  static showSkillUsedPop(action)
  {
    if (J.POPUPS.EXT.ABS.DisableSkillUsedPopups === true)
    {
      return;
    }

    const caster = action.getCaster();
    if (caster.isInanimate())
    {
      return;
    }

    const skill = action.getBaseSkill();
    const character = caster.getCharacter();
    const pop = new TextPopBuilder(skill.name)
      .isSkillUsed(skill.iconIndex)
      .build();

    TextPopManager.show(pop, character);
  }

  /**
   * Dispatches an experience popup on the given character.
   * @param {number} experience The experience amount.
   * @param {Game_Character} character The character who earned the experience.
   */
  static showExperiencePop(experience, character)
  {
    const pop = new TextPopBuilder(Math.round(experience))
      .isExperience()
      .build();

    TextPopManager.show(pop, character);
  }

  /**
   * Dispatches a gold popup on the given character.
   * @param {number} gold The gold amount.
   * @param {Game_Character} character The character who earned the gold.
   */
  static showGoldPop(gold, character)
  {
    const pop = new TextPopBuilder(Math.round(gold))
      .isGold()
      .build();

    TextPopManager.show(pop, character);
  }

  /**
   * Dispatches a loot popup for each item in the list on the given character.
   * @param {RPG_BaseItem[]} itemDataList All items picked up.
   * @param {Game_Character} character The character who picked them up.
   */
  static showItemPickedUpPops(itemDataList, character)
  {
    const pops = itemDataList.map(itemData =>
      new TextPopBuilder(itemData.name)
        .isLoot()
        .setIconIndex(itemData.iconIndex)
        .build()
    );

    TextPopManager.showBatch(pops, character);
  }

  /**
   * Dispatches a level-up popup on the given character.
   * @param {Game_Character} character The character who leveled up.
   */
  static showLevelUpPop(character)
  {
    const pop = new TextPopBuilder(`LEVEL UP`)
      .isLevelUp()
      .build();

    TextPopManager.show(pop, character);
  }

  /**
   * Dispatches a skill-learned popup on the given character.
   * @param {RPG_Skill} skill The skill that was learned.
   * @param {Game_Character} character The character who learned it.
   */
  static showSkillLearnPop(skill, character)
  {
    const pop = new TextPopBuilder(skill.name)
      .isSkillLearned(skill.iconIndex)
      .build();

    TextPopManager.show(pop, character);
  }

  /**
   * Dispatches a tool-use result popup on the caster's character.
   * @param {Game_Action} gameAction The action describing the tool effect.
   * @param {RPG_Item} itemData The item database entry.
   * @param {JABS_Battler} caster The battler who used the item.
   * @param {JABS_Battler} target The battler receiving the effect.
   */
  static showItemAppliedPop(gameAction, itemData, caster, target)
  {
    const character = caster.getCharacter();
    const targetBattler = target.getBattler();
    const actionResult = targetBattler.result();

    const elementalIcon = $jabsEngine.determineElementalIcon(itemData, caster);
    const iconIndex = actionResult.parried
      ? 128
      : elementalIcon;

    const textPopBuilder = new TextPopBuilder(0);

    switch (true)
    {
      case actionResult.parried:
        textPopBuilder
          .setValue(`PARRY!`)
          .setPopupType(Map_TextPop.Types.Parry)
          .forCenterFocusRing()
          .setTextAccent(`parry`);
        break;
      case actionResult.evaded:
        textPopBuilder
          .setValue(`DODGE`)
          .setPopupType(Map_TextPop.Types.Evade)
          .forCenterFocusRing()
          .setTextAccent(`evade`);
        break;
      case actionResult.hpDamage !== 0:
        textPopBuilder
          .setValue(actionResult.hpDamage)
          .isHpDamage();
        if (actionResult.hpDamage < 0)
        {
          textPopBuilder.forIncomingHealRing();
        }
        else
        {
          textPopBuilder.forEnemyDamageRing();
        }
        break;
      case actionResult.mpDamage !== 0:
        textPopBuilder
          .setValue(actionResult.mpDamage)
          .isMpDamage();
        if (actionResult.mpDamage < 0)
        {
          textPopBuilder.forIncomingHealRing();
        }
        else
        {
          textPopBuilder.forEnemyDamageRing();
        }
        break;
      case actionResult.tpDamage !== 0:
        textPopBuilder
          .setValue(actionResult.tpDamage)
          .isTpDamage();
        if (actionResult.tpDamage < 0)
        {
          textPopBuilder.forIncomingHealRing();
        }
        else
        {
          textPopBuilder.forEnemyDamageRing();
        }
        break;
      default:
        textPopBuilder
          .setValue(actionResult.hpDamage)
          .isHpDamage()
          .forEnemyDamageRing();
        break;
    }

    const pop = textPopBuilder
      .setIconIndex(iconIndex)
      .setCritical(actionResult.critical)
      .build();

    TextPopManager.show(pop, character);
  }

  /**
   * Dispatches a slip or regen popup on the battler's character.
   * @param {number} displayAmount The signed amount (negative = regen).
   * @param {0|1|2} type HP / MP / TP resource index.
   * @param {JABS_Battler} battler The battler showing the pop.
   */
  static showSlipPop(displayAmount, type, battler)
  {
    const character = battler.getCharacter();
    const textPopBuilder = new TextPopBuilder(displayAmount);

    switch (type)
    {
      case 0:
        textPopBuilder.isHpDamage();
        break;
      case 1:
        textPopBuilder.isMpDamage();
        break;
      case 2:
        textPopBuilder.isTpDamage();
        break;
    }

    if (displayAmount < 0)
    {
      textPopBuilder.forRegenRing();
    }
    else
    {
      textPopBuilder.forSlipDamageRing();
    }

    TextPopManager.show(textPopBuilder.build(), character);
  }
}

//endregion JABS_PopupManager

//region Game_Action
/**
 * Extends {@link #onFormulaResourceDelta}.<br/>
 * Also shows a resource-delta popup on the recipient's JABS character.
 */
J.POPUPS.EXT.ABS.Aliased.Game_Action.set('onFormulaResourceDelta', Game_Action.prototype.onFormulaResourceDelta);
Game_Action.prototype.onFormulaResourceDelta = function(recipient, amount, resource)
{
  J.POPUPS.EXT.ABS.Aliased.Game_Action.get('onFormulaResourceDelta')
    .call(this, recipient, amount, resource);

  const jabs = JABS_AiManager.getBattlerByUuid(recipient.getUuid());
  if (!jabs) return;

  const signed = Math.round(amount);
  const magnitude = Math.abs(signed);
  if (magnitude === 0) return;

  const popupValue = signed < 0
    ? -magnitude
    : magnitude;
  const textPopBuilder = new TextPopBuilder(popupValue);

  switch (resource)
  {
    case FormulaEffect.Resource.HP:
      textPopBuilder.isHpDamage();
      break;
    case FormulaEffect.Resource.MP:
      textPopBuilder.isMpDamage();
      break;
    case FormulaEffect.Resource.TP:
      textPopBuilder.isTpDamage();
      break;
  }

  if (signed < 0)
  {
    textPopBuilder.forIncomingHealRing();
  }
  else
  {
    textPopBuilder.forEnemyDamageRing();
  }

  TextPopManager.show(textPopBuilder.build(), jabs.getCharacter());
};

/**
 * Extends {@link #onShieldDamageAbsorbed}.<br/>
 * Also shows a shield-damage popup on the target's JABS character.
 */
J.POPUPS.EXT.ABS.Aliased.Game_Action.set('onShieldDamageAbsorbed', Game_Action.prototype.onShieldDamageAbsorbed);
Game_Action.prototype.onShieldDamageAbsorbed = function(target, value)
{
  J.POPUPS.EXT.ABS.Aliased.Game_Action.get('onShieldDamageAbsorbed')
    .call(this, target, value);

  const jabsBattler = JABS_AiManager.getBattlerByUuid(target.getUuid());
  if (!jabsBattler) return;

  const pop = new TextPopBuilder(`  -${Math.round(value)}`)
    .isShieldDamage()
    .build();

  TextPopManager.show(pop, jabsBattler.getCharacter());
};

/**
 * Extends {@link #onShieldBroken}.<br/>
 * Also shows a shield-break popup on the target's JABS character.
 */
J.POPUPS.EXT.ABS.Aliased.Game_Action.set('onShieldBroken', Game_Action.prototype.onShieldBroken);
Game_Action.prototype.onShieldBroken = function(target)
{
  J.POPUPS.EXT.ABS.Aliased.Game_Action.get('onShieldBroken')
    .call(this, target);

  const jabsBattler = JABS_AiManager.getBattlerByUuid(target.getUuid());
  if (!jabsBattler) return;

  const pop = new TextPopBuilder(`B R E A K`)
    .isShieldBreak()
    .build();

  TextPopManager.show(pop, jabsBattler.getCharacter());
};
//endregion Game_Action

//region JABS_Battler
/**
 * Extends {@link #onSlipRegenTick}.<br/>
 * Also shows a slip or regen popup on the battler's character.
 */
J.POPUPS.EXT.ABS.Aliased.JABS_Battler.set('onSlipRegenTick', JABS_Battler.prototype.onSlipRegenTick);
JABS_Battler.prototype.onSlipRegenTick = function(displayAmount, type)
{
  // perform original logic.
  J.POPUPS.EXT.ABS.Aliased.JABS_Battler.get('onSlipRegenTick')
    .call(this, displayAmount, type);

  JABS_PopupManager.showSlipPop(displayAmount, type, this);
};

/**
 * Extends {@link #onItemApplied}.<br/>
 * Also shows the appropriate popup for item tool usage.
 */
J.POPUPS.EXT.ABS.Aliased.JABS_Battler.set('onItemApplied', JABS_Battler.prototype.onItemApplied);
JABS_Battler.prototype.onItemApplied = function(gameAction, itemId, target = this)
{
  // perform original logic.
  J.POPUPS.EXT.ABS.Aliased.JABS_Battler.get('onItemApplied')
    .call(this, gameAction, itemId, target);

  const toolData = $dataItems.at(itemId);

  if (toolData.sdpKey !== String.empty)
  {
    // show item pickup popup for SDP unlock items used as tools.
    $jabsEngine.onItemPickedUp([ toolData ], this.getCharacter());
    return;
  }

  // show the damage result popup on the caster's character.
  JABS_PopupManager.showItemAppliedPop(gameAction, toolData, this, target);
};
//endregion JABS_Battler

//# sourceMappingURL=J-Popups-ABS.js.map
