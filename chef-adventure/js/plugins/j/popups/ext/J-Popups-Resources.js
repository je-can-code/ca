//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 POPUPS-RESOURCES] Skill cost and resource gain popups.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Popups
 * @base J-Resources
 * @orderAfter J-Base
 * @orderAfter J-Popups
 * @orderAfter J-Resources
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin adds visual popup feedback for the HP, MP, and TP costs and
 * gains introduced by J-Resources.
 *
 * Have you ever wanted to see a popup fly off your character when a skill
 * drains their HP, or when a hit-based gain restores their MP mid-combat?
 * Well now you can! Any time a J-Resources cost is paid or a gain is applied,
 * a text popup will appear over that battler's character on the map.
 *
 * Integrates with others of mine plugins:
 * - J-Resources-ABS; on-attack and when-hit gains are covered automatically.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * - HP cost popups appear in red tones.
 * - MP cost popups appear in blue tones.
 * - TP cost popups appear in yellow/green tones.
 * - Gain popups use the corresponding healing color tones.
 *
 * NOTE:
 * If J-Resources-ABS is also loaded, the on-attack and when-hit gains from
 * that plugin go through the same Game_Battler hooks and get popups for free.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 *    Added HP/MP/TP cost and gain popups hooked via Game_Battler methods.
 *    On-attack and when-hit gains from J-Resources-ABS are covered automatically.
 * ============================================================================
 */
//endregion annotations


//region plugin metadata
class JPopupsResources_PluginMetadata
  extends PluginMetadata
{
  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   *  Extends {@link #postInitialize}.<br>
   *  Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();
  }
}

//endregion plugin metadata

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.POPUPS.EXT.RESOURCES = {};

/**
 * The metadata associated with this plugin.
 */
J.POPUPS.EXT.RESOURCES.Metadata = new JPopupsResources_PluginMetadata('J-Popups-Resources', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.POPUPS.EXT.RESOURCES.Aliased = {};
J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler = new Map();
//endregion initialization

//region Game_Battler
/**
 * Extends {@link #paySkillHpCost}.<br/>
 * Also generates a pop for the damage dealt.
 */
J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.set('paySkillHpCost', Game_Battler.prototype.paySkillHpCost);
Game_Battler.prototype.paySkillHpCost = function(amount)
{
  // perform original logic.
  J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.get('paySkillHpCost')
    .call(this, amount);

  // don't pop 0 costs.
  if (amount === 0) return;

  // do nothing if we're not using JABS.
  if (!J.ABS) return;

  // validate we have a battler.
  const jabsBattler = JABS_AiManager.getBattlerByUuid(this.getUuid());
  if (!jabsBattler) return;

  // validate we have a character to display the popup on.
  const character = jabsBattler.getCharacter();
  if (!character) return;

  // build the popup.
  const pop = new TextPopBuilder(amount)
    .isHpDamage()
    .forEnemyDamageRing()
    .build();

  // show the damage popup.
  TextPopManager.show(pop, character);
};

/**
 * Extends {@link #gainHpFromResource}.<br/>
 * Also generates a pop for the healing received.
 */
J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.set('gainHpFromResource', Game_Battler.prototype.gainHpFromResource);
Game_Battler.prototype.gainHpFromResource = function(amount)
{
  // perform original logic.
  J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.get('gainHpFromResource')
    .call(this, amount);

  // don't pop 0 gains.
  if (amount === 0) return;

  // do nothing if we're not using JABS.
  if (!J.ABS) return;

  // validate we have a battler.
  const jabsBattler = JABS_AiManager.getBattlerByUuid(this.getUuid());
  if (!jabsBattler) return;

  // validate we have a character to display the popup on.
  const character = jabsBattler.getCharacter();
  if (!character) return;

  // build the popup.
  const pop = new TextPopBuilder(-amount)
    .isHpDamage()
    .forIncomingHealRing()
    .build();

  // show the damage popup.
  TextPopManager.show(pop, character);
};

/**
 * Extends {@link #gainMpFromResource}.<br/>
 * Also generates a pop for the healing received.
 */
J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.set('gainMpFromResource', Game_Battler.prototype.gainMpFromResource);
Game_Battler.prototype.gainMpFromResource = function(amount)
{
  // perform original logic.
  J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.get('gainMpFromResource')
    .call(this, amount);

  // don't pop 0 gains.
  if (amount === 0) return;

  // do nothing if we're not using JABS.
  if (!J.ABS) return;

  // validate we have a battler.
  const jabsBattler = JABS_AiManager.getBattlerByUuid(this.getUuid());
  if (!jabsBattler) return;

  // validate we have a character to display the popup on.
  const character = jabsBattler.getCharacter();
  if (!character) return;

  // build the popup.
  const pop = new TextPopBuilder(-amount)
    .isMpDamage()
    .forIncomingHealRing()
    .build();

  // show the damage popup.
  TextPopManager.show(pop, character);
};

/**
 * Extends {@link #gainTpFromResource}.<br/>
 * Also generates a pop for the healing received.
 */
J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.set('gainTpFromResource', Game_Battler.prototype.gainTpFromResource);
Game_Battler.prototype.gainTpFromResource = function(amount)
{
  // perform original logic.
  J.POPUPS.EXT.RESOURCES.Aliased.Game_Battler.get('gainTpFromResource')
    .call(this, amount);

  // don't pop 0 gains.
  if (amount === 0) return;

  // do nothing if we're not using JABS.
  if (!J.ABS) return;

  // validate we have a battler.
  const jabsBattler = JABS_AiManager.getBattlerByUuid(this.getUuid());
  if (!jabsBattler) return;

  // validate we have a character to display the popup on.
  const character = jabsBattler.getCharacter();
  if (!character) return;

  // build the popup.
  const pop = new TextPopBuilder(-amount)
    .isTpDamage()
    .forIncomingHealRing()
    .build();

  // show the damage popup.
  TextPopManager.show(pop, character);
};
//endregion Game_Battler

//# sourceMappingURL=J-Popups-Resources.js.map
