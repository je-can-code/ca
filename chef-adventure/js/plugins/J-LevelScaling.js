 /*:
 * @target MZ
 * @plugindesc
 * [v1.0 LVL] Scales damage and exp/gold rewards from defeated enemies.
 * @author JE
 * @url https://github.com/jragyn
 * @help
 * # Start of Help
 * 
 * # End of Help
 * 
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Extensions
 * @default Modify Below
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 * 
 * @param Level Scaling
 * @type boolean
 * @desc Turn on experience scaling based on actor vs enemy levels?
 * @default true
 */

//#region plugin setup and configuration
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.LevelScaling = {};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.LevelScaling.PluginParameters = PluginManager.parameters(`J-LevelScaling`);

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.LevelScaling.Metadata = {};
J.LevelScaling.Metadata.Version = '1.0.0';
J.LevelScaling.Metadata.Enabled = Boolean(J.LevelScaling.PluginParameters['Level Scaling']) || true;

/**
 * A collection of all aliased methods for this plugin.
 */
J.LevelScaling.Aliased = {};
J.LevelScaling.Aliased.Game_Action = {};
J.LevelScaling.Aliased.Game_Troop = {};

/**
 * The various note tags that are available for use with this plugin.
 */
J.LevelScaling.Notetags = {};
J.LevelScaling.Notetags.EnemyLevel = "level";

/**
 * Helper functions that are used within this plugin, but also useful externally as well.
 */
J.LevelScaling.Utilities = {};
//#endregion

//#region Game_Action
/**
 * Scales damaged dealt and received to be based on level differences.
 */
J.LevelScaling.Aliased.Game_Action.BaseDamage = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
  const baseDamage = J.LevelScaling.Aliased.Game_Action.BaseDamage.call(this, target, critical);
  const multiplier = J.LevelScaling.Utilities.determineScalingMultiplier(
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
J.LevelScaling.Aliased.Game_Troop.expTotal = Game_Action.prototype.expTotal;
Game_Troop.prototype.expTotal = function() {
  if (J.Extensions.LevelScaling.Enabled) {
    return this.getScaledExpResult();
  } else {
    return J.LevelScaling.Aliased.Game_Troop.expTotal.call(this);
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
    const expFactor = J.LevelScaling.Utilities.determineScalingMultiplier(averageActorLevel, level);
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
  const average = Math.round(lvlTotal / allies.length)
  return average;
}
//#endregion

//#region plugin-specific scaling functions
/**
 * Determines the scaling multiplier.
 * 
 * Based on the difference between user's level and target's level.
 * @param {number} target The level of the target.
 * @param {number} user The level of the user.
 * @returns A decimal representing the multiplier for the damage scaling.
 */
J.LevelScaling.Utilities.determineScalingMultiplier = function(target, user) {
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
}
//#endregion
//ENDOFFILE