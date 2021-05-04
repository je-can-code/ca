//#region initialization
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 LEVEL] Scales damage and exp/gold rewards from defeated enemies.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 * This plugin scales damage dealt and received in combat by a factor based on
 * the difference in level between the two battlers.
 * 
 * All that is needed is to add a tag to enemy battlers to define their level:
 * <level:NUM>
 * Where NUM is the level you want this particular enemy to be.
 * 
 * The level scale is +/- 10 levels, where if the difference is +10 levels
 * between one battler and another, then damage dealt will be multiplied by 2,
 * and damage received from a target -10 levels from the opposing battler will
 * be reduced to 10%. As a reward for managing to defeat higher-level battlers,
 * you will receive bonus experience/gold from them at the same multiplicative
 * rate as the damage is dealt. On the flipside, if you're significantly more
 * powerful than the opposing battler, defeating it will net a reduced reward.
 * 
 * If you do not want a particular enemy to benefit/detriment from this effect,
 * leave off the tag of <level:NUM> and the multiplier will not be used.
 * 
 * If you need to toggle this plugin, you can use the plugin commands to
 * enable/disable it on-the-fly.
 * 
 * 
 * 
 * The point of this plugin was to help mitigate a player staying in a single
 * area for excessive amounts of time farming weaker enemies to level up.
 * 
 * The scaling does go both ways, which can also help buffer the need to
 * constantly tweak and adjust numbers (or worsen the need) for allies and
 * enemies parameters.
 * ============================================================================
 * @param Level Scaling
 * @type boolean
 * @desc Enable damage/rewards scaling?
 * @default true
 * 
 * @command enableScaling
 * @text Enable Scaling
 * @desc Enables the scaling functionality for damage/rewards.
 * 
 * @command disableScaling
 * @text Disable Scaling
 * @desc Disables the scaling functionality for damage/rewards.
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() => {
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement) {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.LEVEL = {};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.LEVEL.PluginParameters = PluginManager.parameters(`J-LevelScaling`);

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.LEVEL.Metadata = {};
J.LEVEL.Metadata.Version = '1.0.0';
J.LEVEL.Metadata.Enabled = J.LEVEL.PluginParameters['Level Scaling'] === "true";

/**
 * A collection of all aliased methods for this plugin.
 */
J.LEVEL.Aliased = {};
J.LEVEL.Aliased.Game_Action = {};
J.LEVEL.Aliased.Game_Troop = {};

/**
 * The various note tags that are available for use with this plugin.
 */
J.LEVEL.Notetags = {};
J.LEVEL.Notetags.EnemyLevel = "level";

/**
 * Helper functions that are used within this plugin, but also used externally as well.
 */
J.LEVEL.Utilities = {};

/**
 * Determines the scaling multiplier.
 * 
 * Based on the difference between user's level and target's level.
 * @param {number} target The level of the target.
 * @param {number} user The level of the user.
 * @returns A decimal representing the multiplier for the damage scaling.
 */
J.LEVEL.Utilities.determineScalingMultiplier = function(target, user) {
  if (!user || !target || // if user or target doesn't have a level
    user == 0 || target == 0) 
      return 1.0;
  const compared = target - user;
  if (compared < -9) return 2.0;     // 10 or more levels higher than the target.
  else if (compared > 9) return 0.1; // 10 or more levels lower than the target.
  
  switch (compared) {
    case -9: return 1.8;  // nine levels above the target.
    case -8: return 1.6;
    case -7: return 1.5;
    case -6: return 1.4;
    case -5: return 1.3;  // five levels above the target.
    case -4: return 1.2;
    case -3: return 1.1;
    case -2: return 1.0;
    case -1: return 1.0;
    case 0: return 1.0;   // same level as the target.
    case 1: return 1.0;
    case 2: return 0.9;
    case 3: return 0.8;
    case 4: return 0.7;
    case 5: return 0.6;   // five levels below the target.
    case 6: return 0.5;
    case 7: return 0.4;
    case 8: return 0.3;
    case 9: return 0.2;   // nine levels below the target.
  }
};
//#region Plugin Command Registration
/**
 * Plugin command for enabling the scaling functionality.
 */
PluginManager.registerCommand(J.LEVEL.Metadata.Name, "enableScaling", () => {
  J.LEVEL.Metadata.Enabled = true;
});

/**
 * Plugin command for disabling the scaling functionality.
 */
PluginManager.registerCommand(J.LEVEL.Metadata.Name, "disableScaling", () => {
  J.LEVEL.Metadata.Enabled = false;
});
//#endregion Plugin Command Registration
//#endregion initialization

//#region Game_Action
/**
 * Scales damaged dealt and received to be based on level differences.
 */
J.LEVEL.Aliased.Game_Action.BaseDamage = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
  // if this functionality is disabled, then return the default.
  if (!J.LEVEL.Metadata.Enabled) {
    return J.LEVEL.Aliased.Game_Action.BaseDamage.call(this, target, critical);
  }

  // otherwise perform the calculations between level and factor in the multiplier.
  const baseDamage = J.LEVEL.Aliased.Game_Action.BaseDamage.call(this, target, critical);
  const multiplier = J.LEVEL.Utilities.determineScalingMultiplier(
    target.level, 
    this.subject().level);
  
  const result = baseDamage * multiplier;
  return result;
}
//#endregion

//#region Game_Troop
/**
 * Upon defeating a troop of enemies, scales the earned experience based on
 * average actor level vs each of the enemies.
 */
J.LEVEL.Aliased.Game_Troop.expTotal = Game_Action.prototype.expTotal;
Game_Troop.prototype.expTotal = function() {
  if (J.LEVEL.Metadata.Enabled) {
    return this.getScaledExpResult();
  } else {
    return J.LEVEL.Aliased.Game_Troop.expTotal.call(this);
  }
}

/**
 * Determines the amount of experience gained based on the average battle party compared to
 * each defeated enemy.
 * 
 * This method is used in place of the current `.reduce()` to find total experience.
 * @returns {number} The scaled amount of EXP this enemy troop yielded.
 */
Game_Troop.prototype.getScaledExpResult = function() {
  var expTotal = 0;
  var deadEnemies = this.deadMembers();
  const averageActorLevel = $gameParty.averageActorLevel()
  deadEnemies.forEach(enemy => {
    const level = enemy.level;
    const expFactor = J.LEVEL.Utilities.determineScalingMultiplier(averageActorLevel, level);
    const total = Math.round(expFactor * enemy.exp())
    expTotal += total;
  });
  return expTotal;
}
//#endregion

//#region Game_Party
/**
 * Checks the current battle party and averages all levels.
 * @returns {number} The average battle party level (rounded).
 */
Game_Party.prototype.averageActorLevel = function() {
  let lvlTotal = 0;
  const allies = this.battleMembers();
  allies.forEach(actor => {
    lvlTotal += actor.level;
  });

  return Math.round(lvlTotal / allies.length);
}
//#endregion

//ENDOFFILE