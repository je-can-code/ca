 //#region Initialization
 /*:
 * @target MZ
 * @plugindesc 
 * Mods exclusive to Chef Adventure.
 * @author JE
 * @url https://dev.azure.com/je-can-code/RPG%20Maker/_git/rmmz
 * @help
 * These modifications of code are exclusive to Chef Adventure.
 */
 /**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.CAMods = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CAMods.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-CA-Mods`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.CAMods.PluginParameters = PluginManager.parameters(J.CAMods.Metadata.Name);
J.CAMods.Metadata = {
  ...J.CAMods.Metadata,
  /**
   * The version of this plugin.
   */
  Version: 1.00,
};

/**
 * A collection of data points being tracked for CA, and their respective variable assignment.
 */
J.CAMods.Tracking = {
  EnemiesDefeated: 101,
  DestructiblesDestroyed: 102,
  TotalDamageDealt: 103,
  HighestDamageDealt: 104,
  NumberOfCritsDealt: 105,
  BiggestCritDealt: 106,
  NumberOfParries: 107,
  NumberOfPreciseParries: 108,
  TotalDamageTaken: 109,
  HighestDamageTaken: 110,
  NumberOfCritsTaken: 111,
  BiggestCritTaken: 112,
  MainhandSkillUsage: 113,
  OffhandSkillUsage: 114,
  AssignedSkillUsage: 115,
  DodgeSkillUsage: 116,
  NumberOfDeaths: 117,
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.CAMods.Aliased = {
  Game_Actor: {},
  Game_BattleMap: {},
  Game_Map: {},
  Game_Player: {},
  JABS_Battler: {},
};
//#endregion Initialization

//#region Game objects
//#region Game_Actor
/**
 * Extends the base slots provided to have a duplicate of the 5th type (accessory).
 */
J.CAMods.Aliased.Game_Actor.equipSlots = Game_Actor.prototype.equipSlots;
Game_Actor.prototype.equipSlots = function() {
  const baseSlots = J.CAMods.Aliased.Game_Actor.equipSlots.call(this);
  baseSlots.push(5);
  return baseSlots;
};
//#endregion Game_Actor

//#region Game_BattleMap
/**
 * Extends the handling of defeated enemies to track data.
 * @param {JABS_Battler} defeatedTarget The `JABS_Battler` that was defeated.
 * @param {JABS_Battler} caster The `JABS_Battler` that defeated the target.
 */
J.CAMods.Aliased.Game_BattleMap.handleDefeatedEnemy = Game_BattleMap.prototype.handleDefeatedEnemy;
Game_BattleMap.prototype.handleDefeatedEnemy = function(defeatedTarget, caster) {
  J.CAMods.Aliased.Game_BattleMap.handleDefeatedEnemy.call(this, defeatedTarget, caster);

  // determine whether to add to the destructibles count or regular count.
  if (defeatedTarget.isInanimate()) {
    // add to destructibles destroyed count.
    J.Base.Helpers.modVariable(J.CAMods.Tracking.DestructiblesDestroyed, 1);
  } else {
    // add to enemy defeated count.
    J.Base.Helpers.modVariable(J.CAMods.Tracking.EnemiesDefeated, 1);
  }
};

/**
 * Extends the handling of defeated players to track data.
 */
J.CAMods.Aliased.Game_BattleMap.handleDefeatedPlayer = Game_BattleMap.prototype.handleDefeatedPlayer;
Game_BattleMap.prototype.handleDefeatedPlayer = function() {
  J.Base.Helpers.modVariable(J.CAMods.Tracking.NumberOfDeaths, 1);
  J.CAMods.Aliased.Game_BattleMap.handleDefeatedPlayer.call(this);
};

/**
 * Extends the handling of skill execution to track data.
 * @param {JABS_Action} action The action being executed.
 * @param {JABS_Battler} target The target to apply skill effects against.
 */
J.CAMods.Aliased.Game_BattleMap.executeSkillEffects = Game_BattleMap.prototype.executeSkillEffects;
Game_BattleMap.prototype.executeSkillEffects = function(action, target) {
  const actionResult = J.CAMods.Aliased.Game_BattleMap.executeSkillEffects.call(this, action, target);
  if (target.isEnemy()) {
    this.trackAttackData(actionResult);
  } else if (target.isPlayer()) {
    this.trackDefensiveData(actionResult);
  }

  return actionResult;
};

/**
 * Tracks various attack-related data points and assigns them to variables.
 * @param {Game_ActionResult} actionResult The action result to analyze the data of.
 */
Game_BattleMap.prototype.trackAttackData = function(actionResult) {
  const { hpDamage, critical } = actionResult;
  if (hpDamage) {
    // count all damage dealt.
    J.Base.Helpers.modVariable(J.CAMods.Tracking.TotalDamageDealt, hpDamage);

    // track the highest damage dealt in a single hit.
    const highestDamage = $gameVariables.value(J.CAMods.Tracking.HighestDamageDealt);
    if (hpDamage > highestDamage) {
      $gameVariables.setValue(J.CAMods.Tracking.HighestDamageDealt, hpDamage);
    }

    if (critical) {
      // count of landed critical hits.
      J.Base.Helpers.modVariable(J.CAMods.Tracking.NumberOfCritsDealt, 1);

      // track the biggest critical hit landed.
      const biggestCrit = $gameVariables.value(J.CAMods.Tracking.BiggestCritDealt);
      if (hpDamage > biggestCrit) {
        $gameVariables.setValue(J.CAMods.Tracking.BiggestCritDealt, hpDamage);
      }
    }
  }
};

/**
 * Tracks various defensive-related data points and assigns them to variables.
 * @param {Game_ActionResult} actionResult The action result to analyze the data of.
 */
Game_BattleMap.prototype.trackDefensiveData = function(actionResult) {
  const { hpDamage, critical, parried, preciseParried } = actionResult;
  if (hpDamage) {
    // count all damage received.
    J.Base.Helpers.modVariable(J.CAMods.Tracking.TotalDamageTaken, hpDamage);

    // track the highest damage received in a single hit.
    const highestDamage = $gameVariables.value(J.CAMods.Tracking.HighestDamageTaken);
    if (hpDamage > highestDamage) {
      $gameVariables.setValue(J.CAMods.Tracking.HighestDamageTaken, hpDamage);
    }

    if (critical) {
      // count of landed critical hits.
      J.Base.Helpers.modVariable(J.CAMods.Tracking.NumberOfCritsTaken, 1);

      // track the biggest critical hit landed.
      const biggestCrit = $gameVariables.value(J.CAMods.Tracking.BiggestCritTaken);
      if (hpDamage > biggestCrit) {
        $gameVariables.setValue(J.CAMods.Tracking.BiggestCritTaken, hpDamage);
      }
    }

  } else if (parried) {
    // count of all types of successful parries.
    J.Base.Helpers.modVariable(J.CAMods.Tracking.NumberOfParries, 1);

    if (preciseParried) {
      // count of all types of successful parries.
      J.Base.Helpers.modVariable(J.CAMods.Tracking.NumberOfPreciseParries, 1);
    }
  }
};

/**
 * Extends the handling of action execution to track data.
 * @param {JABS_Battler} caster The battler executing the action.
 * @param {JABS_Action} action The action being executed.
 */
J.CAMods.Aliased.Game_BattleMap.executeMapAction = Game_BattleMap.prototype.executeMapAction;
Game_BattleMap.prototype.executeMapAction = function(caster, action) {
  J.CAMods.Aliased.Game_BattleMap.executeMapAction.call(this, caster, action);

  if (caster.isPlayer()) {
    this.trackActionData(action);
  }
};

/**
 * Tracks mainhand/offhand/skill usage data points and assigns them to variables.
 * @param {JABS_Action} action 
 */
Game_BattleMap.prototype.trackActionData = function(action) {
  const cooldownType = action.getCooldownType();
  switch (cooldownType) {
    case Game_Actor.JABS_MAINHAND:
      J.Base.Helpers.modVariable(J.CAMods.Tracking.MainhandSkillUsage, 1);
      break;
    case Game_Actor.JABS_OFFHAND:
      J.Base.Helpers.modVariable(J.CAMods.Tracking.OffhandSkillUsage, 1);
      break;
    default:
      J.Base.Helpers.modVariable(J.CAMods.Tracking.AssignedSkillUsage, 1);
      // any skills
      break;
  }
};
//#endregion Game_BattleMap

//#region Game_Map
/**
 * OVERWRITE Disables the ability to walk over tiles with the terrain ID of 1.
 * In practice, this prevents battlers from getting knocked into otherwise
 * unreachable locations, like what is supposed to be ceiling tiles.
 * @param {number} x The `x` coordinate.
 * @param {number} y The `y` coordinate.
 * @param {number} bit The bitwise operator being checked.
 * @returns {boolean} True if the tile can be walked on, false otherwise.
 */
Game_Map.prototype.checkPassage = function(x, y, bit) {
  const flags = this.tilesetFlags();
  const tiles = this.allTiles(x, y);
  for (const tile of tiles) {
      const flag = flags[tile];
      if ((flag & 0x10) !== 0) {
          // [*] No effect on passage
          continue;
      }
      if ((flag >> 12) === 1) { 
          // [Terrain 1] No effect on passage
          return false;
      }
      if ((flag & bit) === 0) {
          // [o] Passable
          return true;
      }
      if ((flag & bit) === bit) {
          // [x] Impassable
          return false;
      }
  }
  return false;
};
//#endregion Game_Map

//#region Game_Player
/**
 * Extends the distance the player can move per frame by 12%.
 * CA only.
 * @return {number} The modified distance per frame to move.
 */
J.CAMods.Aliased.Game_Player.distancePerFrame = Game_Player.prototype.distancePerFrame;
Game_Player.prototype.distancePerFrame = function() {
  const base = J.CAMods.Aliased.Game_Player.distancePerFrame.call(this);
  const caOnlyBonus = 1.12;
  return (base * caOnlyBonus);
};
//#endregion Game_Player
//#endregion Game objects

//#region Scene objects
//#region Scene_Map
/**
 * OVERWRITE Removes the buttons on the map/screen.
 */
Scene_Map.prototype.createButtons = function() { return; };
//#endregion Scene_Map
//#endregion Scene objects

//ENDFILE