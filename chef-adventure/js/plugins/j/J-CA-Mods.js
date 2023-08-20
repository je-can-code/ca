//region annotations
/*:
 * @target MZ
 * @plugindesc [CAMODS] JS Mods exclusive to Chef Adventure.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @help
 * ============================================================================
 * OVERVIEW:
 * These modifications of code are modifications against various components of
 * the core scripts. Additionally, plugins I've written are also modified here
 * in a way that I consider "not-mainstream enough" to be published as a part
 * of the original plugins.
 *
 * NOTE ABOUT USING THIS "PLUGIN":
 * While I do list below the various changes that are provided by this plugin
 * modifier, I do not intend to support this as a public plugin, so you should
 * probably not use this plugin unless you want 100% of the functionality
 * listed below, or are able to tweak/adjust the code yourself.
 *
 * This is also NOT a versioned plugin, and can potentially change without
 * any notification.
 *
 * Use with caution!
 *
 * ============================================================================
 * SYSTEM CHANGES:
 * - force devtools window to open on system boot
 * - variable assignment for tracking a wide variety of battle data points
 * - additional accessory for all actors (as accessory)
 * - "recover all" recovers TP too
 * - prevent passage on tileset terrain id 1
 * - random variable assignment for "rare/named enemies" on map transfer
 * - removal of touch buttons from base and map scenes
 *
 * ----------------------------------------------------------------------------
 * CA-UNIQUE CHANGES:
 * - loot drop x,y adjustment unique to CA
 * - anti-null elementIds hard-coded
 * - mini floor-damage system built with tags (TODO: replace with plugin?)
 * - drop sources for enemies modified to include states and party drop sources
 *
 * ============================================================================
 */
//endregion annotations

//region initialization
/**
 * The core where all of my extensions live = in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.CAMods = {};

/**
 * The `metadata` associated with this plugin; such as version.
 */
J.CAMods.Metadata = {};
J.CAMods.Metadata.Name = `J-CA-Mods`;
J.CAMods.Metadata.Version = '1.0.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.CAMods.PluginParameters = PluginManager.parameters(J.CAMods.Metadata.Name);

/**
 * A collection of data points being tracked for CA.
 * Each of these data points represent a variableId to track data within.
 */
J.CAMods.Tracking = {};
J.CAMods.Tracking.EnemiesDefeated = 101;
J.CAMods.Tracking.DestructiblesDestroyed = 102;
J.CAMods.Tracking.TotalDamageDealt = 103;
J.CAMods.Tracking.HighestDamageDealt = 104;
J.CAMods.Tracking.NumberOfCritsDealt = 105;
J.CAMods.Tracking.BiggestCritDealt = 106;
J.CAMods.Tracking.NumberOfParries = 107;
J.CAMods.Tracking.NumberOfPreciseParries = 108;
J.CAMods.Tracking.TotalDamageTaken = 109;
J.CAMods.Tracking.HighestDamageTaken = 110;
J.CAMods.Tracking.NumberOfCritsTaken = 111;
J.CAMods.Tracking.BiggestCritTaken = 112;
J.CAMods.Tracking.MainhandSkillUsage = 113;
J.CAMods.Tracking.OffhandSkillUsage = 114;
J.CAMods.Tracking.AssignedSkillUsage = 115;
J.CAMods.Tracking.DodgeSkillUsage = 116;
J.CAMods.Tracking.NumberOfDeaths = 117;

/**
 * A collection of all aliased methods for this plugin.
 */
J.CAMods.Aliased = {};
J.CAMods.Aliased.JABS_Battler = new Map();
J.CAMods.Aliased.JABS_Engine = new Map();
J.CAMods.Aliased.Game_Actor = new Map();
J.CAMods.Aliased.Game_BattlerBase = new Map();
J.CAMods.Aliased.Game_Enemy = new Map();
J.CAMods.Aliased.Game_Map = new Map();
J.CAMods.Aliased.Scene_Boot = new Map();
//endregion initialization

//region JABS_Battler
/**
 * Extends {@link #getTargetFrameText}.
 * If no text was provided for the target, instead autogenerate some text based on their traits.
 * The "traits" are defined by arbitrary CA-specific elements, so this can't live in the
 * target frame plugin, or the monsterpedia plugin.
 * @returns {string}
 */
J.CAMods.Aliased.JABS_Battler.set('getTargetFrameText', JABS_Battler.prototype.getTargetFrameText);
JABS_Battler.prototype.getTargetFrameText = function()
{
  // perform original logic to get the target frame text.
  const originalTargetFrameText = J.CAMods.Aliased.JABS_Battler.get('getTargetFrameText').call(this);

  // if a target frame text was provided, then just use that.
  if (originalTargetFrameText !== String.empty) return originalTargetFrameText;

  // grab the battler to extract element data from.
  const battler = this.getBattler();

  // arbitrary CA elements that define the four "xTrait" elements.
  const isArmed = battler.elementRate(21) > 1;
  const isFlying = battler.elementRate(22) > 1;
  const isShielded = battler.elementRate(23) > 1;
  const hasAura = battler.elementRate(24) > 1;

  // a quick check to see if there even are any traits.
  const hasNoTraits = !([isArmed, isFlying, isShielded, hasAura].every(trait => !!trait));

  // if we have no traits, no need to do anymore work.
  if (hasNoTraits) return String.empty;

  // initialize the traits array here.
  const traits = [];

  // check if the target has a weapon.
  if (isArmed)
  {
    traits.push("Weaponized");
  }

  // check if the target is aerial.
  if (isFlying)
  {
    traits.push("Flying");
  }

  // check if the target has shields of some sort.
  if (isShielded)
  {
    traits.push("Shielded");
  }

  // check if the target bears some kind of aura.
  if (hasAura)
  {
    traits.push("Aural");
  }

  // join all the traits together to build the target frame text.
  const text = traits.join(", ");

  // and return it.
  return text;
};
//endregion JABS_Battler

//region JABS_Engine
/**
 * Fixes the weird problem where CA uniquely seems to want to move character sprites up
 * by 1 when generating loot.
 * @param {number} targetX The `x` coordiante where the loot will be dropped/placed.
 * @param {number} targetY The `y` coordinate where the loot will be dropped/placed.
 */
J.CAMods.Aliased.JABS_Engine.set('addLootDropToMap', JABS_Engine.prototype.addLootDropToMap);
JABS_Engine.prototype.addLootDropToMap = function(targetX, targetY, item)
{
  // move the Y up by one because CA is weird?
  const modifiedTargetY = targetY + 1;
  
  // perform original logic.
  J.CAMods.Aliased.JABS_Engine.get('addLootDropToMap').call(this, targetX, modifiedTargetY, item);
};

/**
 * Extends the handling of defeated enemies to track data.
 * @param {JABS_Battler} defeatedTarget The `JABS_Battler` that was defeated.
 * @param {JABS_Battler} caster The `JABS_Battler` that defeated the target.
 */
J.CAMods.Aliased.JABS_Engine.set('handleDefeatedEnemy', JABS_Engine.prototype.handleDefeatedEnemy);
JABS_Engine.prototype.handleDefeatedEnemy = function(defeatedTarget, caster)
{
  // perform original logic.
  J.CAMods.Aliased.JABS_Engine.get('handleDefeatedEnemy').call(this, defeatedTarget, caster);

  // determine whether to add to the destructibles count or regular count.
  if (defeatedTarget.isInanimate())
  {
    // add to destructibles destroyed count.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.DestructiblesDestroyed, 1);
  }
  else
  {
    // add to enemy defeated count.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.EnemiesDefeated, 1);
  }
};

/**
 * Extends {@link #handleDefeatedPlayer}.
 * Also tracks player defeated count.
 */
J.CAMods.Aliased.JABS_Engine.set('handleDefeatedPlayer', JABS_Engine.prototype.handleDefeatedPlayer);
JABS_Engine.prototype.handleDefeatedPlayer = function()
{
  // add to player defeated count.
  J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfDeaths, 1);

  // perform original logic.
  J.CAMods.Aliased.JABS_Engine.get('handleDefeatedPlayer').call(this);
};

/**
 * Extends {@link #postExecuteSkillEffects}.
 * Also tracks our combat data in variables.
 * @param {JABS_Action} action The action being executed.
 * @param {JABS_Battler} target The target to apply skill effects against.
 */
J.CAMods.Aliased.JABS_Engine.set('postExecuteSkillEffects', JABS_Engine.prototype.postExecuteSkillEffects);
JABS_Engine.prototype.postExecuteSkillEffects = function(action, target)
{
  // execute the original method so the result is on the target.
  J.CAMods.Aliased.JABS_Engine.get('postExecuteSkillEffects').call(this, action, target);

  // don't track these data points if its a tool.
  if (action.getCooldownType() !== JABS_Button.Tool)
  {
    // if the target is an enemy, track it as attack data.
    if (target.isEnemy())
    {
      this.trackAttackData(target);
    }
    // if the target is an actor, track it as defensive data.
    else if (target.isActor())
    {
      this.trackDefensiveData(target);
    }
  }
};

/**
 * Tracks various attack-related data points and assigns them to variables.
 * @param {JABS_Battler} target The target to analyze.
 */
JABS_Engine.prototype.trackAttackData = function(target)
{
  // extract the data points from the battler's action result.
  const {hpDamage, critical} = target.getBattler().result();

  // check if it was hp-related.
  if (hpDamage > 0)
  {
    // count all damage dealt.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.TotalDamageDealt, hpDamage);

    // track the highest damage dealt in a single hit.
    const highestDamage = $gameVariables.value(J.CAMods.Tracking.HighestDamageDealt);
    if (hpDamage > highestDamage)
    {
      $gameVariables.setValue(J.CAMods.Tracking.HighestDamageDealt, hpDamage);
    }

    // check if the hit was critical.
    if (critical)
    {
      // count of landed critical hits.
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfCritsDealt, 1);

      // track the biggest critical hit landed.
      const biggestCrit = $gameVariables.value(J.CAMods.Tracking.BiggestCritDealt);
      if (hpDamage > biggestCrit)
      {
        $gameVariables.setValue(J.CAMods.Tracking.BiggestCritDealt, hpDamage);
      }
    }
  }
};

/**
 * Tracks various defensive-related data points and assigns them to variables.
 * @param {JABS_Battler} target The target to analyze.
 */
JABS_Engine.prototype.trackDefensiveData = function(target)
{
  const {hpDamage, critical, parried, preciseParried} = target.getBattler().result();
  if (hpDamage)
  {
    // count all damage received.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.TotalDamageTaken, hpDamage);

    // track the highest damage received in a single hit.
    const highestDamage = $gameVariables.value(J.CAMods.Tracking.HighestDamageTaken);
    if (hpDamage > highestDamage)
    {
      $gameVariables.setValue(J.CAMods.Tracking.HighestDamageTaken, hpDamage);
    }

    if (critical)
    {
      // count of landed critical hits.
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfCritsTaken, 1);

      // track the biggest critical hit landed.
      const biggestCrit = $gameVariables.value(J.CAMods.Tracking.BiggestCritTaken);
      if (hpDamage > biggestCrit)
      {
        $gameVariables.setValue(J.CAMods.Tracking.BiggestCritTaken, hpDamage);
      }
    }

  }
  else if (parried)
  {
    // count of all types of successful parries.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfParries, 1);

    if (preciseParried)
    {
      // count of all types of successful parries.
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfPreciseParries, 1);
    }
  }
};

/**
 * Extends {@link #executeMapAction}.
 * Also tracks action execution data.
 * @param {JABS_Battler} caster The battler executing the action.
 * @param {JABS_Action} action The action being executed.
 * @param {number?} targetX The target's `x` coordinate, if applicable.
 * @param {number?} targetY The target's `y` coordinate, if applicable.
 */
J.CAMods.Aliased.JABS_Engine.set('executeMapAction', JABS_Engine.prototype.executeMapAction);
JABS_Engine.prototype.executeMapAction = function(caster, action, targetX, targetY)
{
  // perform original logic.
  J.CAMods.Aliased.JABS_Engine.get('executeMapAction').call(this, caster, action, targetX, targetY);

  // validate the caster is a player before tracking.
  if (caster.isPlayer())
  {
    // track the data for the player.
    this.trackActionData(action);
  }
};

/**
 * Tracks mainhand/offhand/skill usage data points and assigns them to variables.
 * @param {JABS_Action} action
 */
JABS_Engine.prototype.trackActionData = function(action)
{
  // check which cooldown this is associated with.
  const cooldownType = action.getCooldownType();

  // pivot on the slot type.
  switch (cooldownType)
  {
    case JABS_Button.Mainhand:
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.MainhandSkillUsage, 1);
      break;
    case JABS_Button.Offhand:
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.OffhandSkillUsage, 1);
      break;
    default:
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.AssignedSkillUsage, 1);
      // any skills
      break;
  }
};
//endregion JABS_Engine

//region Game_Action
/**
 * Implements {@link #getAntiNullElementIds}.
 * In CA, these elementIds define tools, which should be considered regardless.
 */
Game_Action.prototype.getAntiNullElementIds = function()
{
  return [25, 26, 27, 28];
};
//endregion Game_Action

//region Game_Actor
/**
 * Extends {@link #equipSlots}.
 * Adds a duplicate of the 5th type (accessory).
 */
J.CAMods.Aliased.Game_Actor.set("equipSlots", Game_Actor.prototype.equipSlots);
Game_Actor.prototype.equipSlots = function()
{
  // perform original logic to determine the base slots.
  const baseSlots = J.CAMods.Aliased.Game_Actor.get("equipSlots").call(this);

  // add a copy of the 5th equip type at the end of the list.
  baseSlots.push(5);

  // return the updated equip slots.
  return baseSlots;
};

/**
 * Overwrites {@link #performMapDamage}.
 * Forces the map damage flash to always happen because JABS is always in-battle.
 * Also shows an animation on the player when they take damage.
 */
Game_Actor.prototype.performMapDamage = function()
{
  // always flash the screen if taking damage.
  $gameScreen.startFlashForDamage();

  // always show an animation if taking damage.
  // TODO: add a tag for this when you need non-poison floors, ex: lava.
  $gamePlayer.requestAnimation(59);
};

/**
 * Extends {@link #basicFloorDamage}.
 * Replaces logic if there is a $dataMap available with calculated damage instead.
 */
J.CAMods.Aliased.Game_Actor.set("basicFloorDamage", Game_Actor.prototype.basicFloorDamage);
Game_Actor.prototype.basicFloorDamage = function()
{
  if (!$dataMap || !$dataMap.meta)
  {
    return J.CAMods.Aliased.Game_Actor.get("basicFloorDamage").call(this);
  }
  else
  {
    return this.calculateFloorDamage();
  }
};

/**
 * Calculates the amount of damage received from stepping on damage floors.
 * @returns {number}
 */
Game_Actor.prototype.calculateFloorDamage = function()
{
  // initialize damage to 0.
  let damage = 0;

  // grab all sources to get damage rates from.
  const objectsToCheck = this.floorDamageSources();

  // iterate over each of the sources to add to the damage.
  objectsToCheck.forEach(obj => damage += this.extractFloorDamageRate(obj));

  // return the calculated amount.
  return damage;
};

/**
 * Extracts the damage this object yields for floor damage.
 * @param {RPG_BaseItem} referenceData The database object to extract from.
 * @returns {number}
 */
Game_Actor.prototype.extractFloorDamageRate = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return 0;

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure1 = /<damageFlat:[ ]?([\d]+)>/i;
  const structure2 = /<damagePerc:[ ]?([\d]+)>/i;
  let damage = 0;
  notedata.forEach(line =>
  {
    // if we have flat damage, add that to the mix.
    if (line.match(structure1))
    {
      const flatDamage = parseInt(RegExp.$1);
      damage += flatDamage;
    }

    // if we have percent damage, calculate it and add it to the mix.
    if (line.match(structure2))
    {
      const percentDamage = (parseInt(RegExp.$1) / 100) * this.mhp;
      damage += percentDamage;
    }
  });

  return damage;
};

/**
 * Gets all sources that can possibly yield damage by stepping.
 * Open for extension.
 * @returns {*[]}
 */
Game_Actor.prototype.floorDamageSources = function()
{
  // start with no sources.
  const sources = [];

  // add the datamap as a source.
  sources.push($dataMap);

  // return the source collection.
  return sources;
};

/**
 * Refreshes all auto-equippable skills available to this battler.
 */
Game_Actor.prototype.refreshAutoEquippedSkills = function()
{
  const allSlots = this.getAllEquippedSkills();

  // iterate over each of the skills and auto-assign/equip them where applicable.
  this.skills().forEach(skill =>
  {
    // extract the skill id.
    const skillId = skill.id;

    // don't autoassign the same skill if a slot already has it somehow.
    if (allSlots.some(slot => slot.id === skillId)) return;

    // process the learned skill!
    this.jabsProcessLearnedSkill(skill.id);
  }, this);
};
//endregion Game_Actor

//region Game_BattlerBase
/**
 * Extends {@link #recoverAll}.
 * Using the event command for "Recover All" also restores all TP to the battler.
 */
J.CAMods.Aliased.Game_BattlerBase.set('recoverAll', Game_BattlerBase.prototype.recoverAll);
Game_BattlerBase.prototype.recoverAll = function()
{
  // perform original logic.
  J.CAMods.Aliased.Game_BattlerBase.get('recoverAll').call(this);

  // also set current TP to max.
  this._tp = this.maxTp();
};
//endregion Game_BattlerBase

//region Game_Enemy
/**
 * Extends the drop sources to include passive skill states.
 * This isn't a flavor everyone might like, so this is personal functionality instead.
 * @returns {RPG_BaseItem[]}
 */
J.CAMods.Aliased.Game_Enemy.set("dropSources", Game_Enemy.prototype.dropSources);
Game_Enemy.prototype.dropSources = function()
{
  // perform original logic to determine base drop sources.
  const sources = J.CAMods.Aliased.Game_Enemy.get("dropSources").call(this);

  // also add all the passive states applied to oneself.
  sources.push(...this.allStates());

  // also add all the passive states associated with the party.
  sources.push(...$gameParty.extraDropSources());

  // return the updated collection.
  return sources;
};
//endregion Game_Enemy

//region Game_Map
/**
 * Overwrites {@link #checkPassage}.
 * Disables the ability to walk over tiles with the terrain ID of 1.
 * In practice, this prevents battlers from getting knocked into otherwise
 * unreachable locations, like what is supposed to be ceiling tiles.
 * @param {number} x The `x` coordinate.
 * @param {number} y The `y` coordinate.
 * @param {number} bit The bitwise operator being checked.
 * @returns {boolean} True if the tile can be walked on, false otherwise.
 */
Game_Map.prototype.checkPassage = function(x, y, bit)
{
  // grab all the flags for the tileset.
  const flags = this.tilesetFlags();

  // grab all the tiles available at the designated location.
  const tiles = this.allTiles(x, y);

  // iterate over each tile represented at these coordinates.
  for (const tile of tiles)
  {
    // grab the flag for this tile.
    const flag = flags[tile];

    // represents [*] No effect on passage.
    if ((flag & 0x10) !== 0)
    {
      continue;
    }

    // represents [Terrain 1] blocks passage.
    if ((flag >> 12) === 1)
    {
      return false;
    }

    // represents [o] Passable.
    if ((flag & bit) === 0)
    {
      return true;
    }

    // represents [x] Impassable.
    if ((flag & bit) === bit)
    {
      return false;
    }
  }

  // this tile cannot be passed.
  return false;
};

/**
 * Extends {@link #setup}.
 * Upon map initialization, assigns a random integer between 1-100 to an arbitrary variable.
 * In CA, this value is used to determine the presence of "rare/named" monsters on the map.
 */
J.CAMods.Aliased.Game_Map.set('setup', Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId)
{
  // perform original logic.
  J.CAMods.Aliased.Game_Map.get('setup').call(this, mapId);

  // update rare/named enemy variable.
  $gameVariables.setValue(13, Math.randomInt(100) + 1);
};
//endregion Game_Map

//region Game_Party
/**
 * Gets any additional sources to scan for drops when determining a drop item list on
 * an enemy. In this case, we are including passive skill states to potentially add
 * new items to every enemy.
 * @returns {RPG_BaseItem[]}
 */
Game_Party.prototype.extraDropSources = function()
{
  const extraSources = [];

  // grab all passive skill states from all the members in the party.
  $gameParty.battleMembers()
    .forEach(member => extraSources.push(...member.allStates()));

  return extraSources;
};
//endregion Game_Party

//region Scene_Base
/**
 * Overwrites {@link #buttonAreaHeight}.
 * Sets the button height to 0- they are not used in CA.
 * @returns {number}
 */
Scene_Base.prototype.buttonAreaHeight = function()
{
  return 0;
};

/**
 * Overwrites {@link #createButtons}.
 * Removes logic for button creation- they are not used in CA.
 */
Scene_Base.prototype.createButtons = function()
{
};
//endregion Scene_Base

//region Scene_Boot
/**
 * Extends {@link #start}.
 * Also shows the devtools window because I need that to do dev things.
 */
J.CAMods.Aliased.Scene_Boot.set('start', Scene_Boot.prototype.start);
Scene_Boot.prototype.start = function()
{
  // perform original logic.
  J.CAMods.Aliased.Scene_Boot.get('start').call(this);

  // show the dev tools automatically.
  SceneManager.showDevTools();

  // set a timer for after the devtools has loaded to focus the game window.
  setTimeout(() => nw.Window.get().focus(), 1000);
};
//endregion Scene_Boot

//region Scene_Map
/**
 * Overwrites {@link #createButtons}.
 * Removes logic for button creation- they are not used in CA.
 */
Scene_Map.prototype.createButtons = function()
{
};
//endregion Scene_Map