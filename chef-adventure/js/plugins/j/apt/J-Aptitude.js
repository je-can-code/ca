//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.1 APT] A plugin that grants the ability to learn by gaining points.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-LevelMaster
 * @orderAfter J-Log
 * @orderAfter J-TextPops
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin grants the ability to learn skills by gaining points.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; acquire points from enemy kills and skill executions.
 * - J-LevelMaster; considers level difference for an AP multiplier.
 * - J-Log; log all AP gained.
 * - J-TextPops; display popups for AP gained.
 *
 * ----------------------------------------------------------------------------
 * DETAILS
 * This plugin lets actors learn skills by gaining AP (Aptitude Points).
 * As actors earn AP, it flows into the currently-active sources
 * (like Class/Weapons/Armor/States/Actor), and when a requirement is met:
 * the skill is learned.
 * - Only active sources on the actor receive AP. Change gear/class/state?
 *   Active sources change too.
 * - Multiple sources can point at the same skill; progress is tracked per
 *   source and the moment any teaching crosses its requirement, the skill
 *   becomes learned for the actor.
 *
 * ============================================================================
 * TEACHABLES
 * Ever want to have skills “teach themselves” while you play? Well now you
 * can! By applying the appropriate tags across the various database locations,
 * your actors will soak up AP from adventures and unlock those skills.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Weapons
 * - Armor
 * - States
 *
 * TAG FORMAT:
 *  <aptitude:[SKILL_ID, REQUIRED_AP]>
 *    Where SKILL_ID is the database id of the skill to learn,
 *    Where REQUIRED_AP is how much AP that source needs to teach it.
 *
 * TAG EXAMPLES:
 *  <aptitude:[12, 150]>
 * This source enables learning skill of id 12 once the owner gains 150 AP.
 * ============================================================================
 * AP
 * Ever want to gain AP so that you could learn all those skills that various
 * sources teach. Well now you can! By applying the appropriate tags onto
 * enemies, you too can gain AP when chopping up enemies.
 *
 * NOTE ABOUT LEVEL DIFFERENCE
 * There is a limit by default that prevents AP from being gained when the
 * actor level is too far above the enemy level. This is a plugin parameter
 * for your convenience. If you set the plugin parameter to -1, the
 * functionality will be disabled.
 *
 * TAG USAGE:
 * - Enemies only.
 *
 * TAG FORMAT:
 *  <ap:[AMOUNT]>
 *    Where AMOUNT is the amount of AP to be gained.
 *
 * TAG EXAMPLES:
 *  <ap:6>
 * This enemy will yield 6 AP upon defeat.
 *
 * ============================================================================
 * TIPS
 * ----------------------------------------------------------------------------
 * - Stack learnings: You can define the same skill on multiple sources. The UI
 *   will aggregate per‑source progress for that skill so you can see total vs.
 *   source contributions.
 * - Source lifetime: Only currently active sources on the actor receive AP
 *   (ex: changing class/equipment/states changes the active set of sources).
 * - J-ABS synergy: Pair enemy <ap:...> rewards with your encounter balance to
 *   tune progression alongside EXP.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Added emergency initialization for existing saves.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @param parentConfig
 * @text SETUP
 *
 * @param menu-switch
 * @parent parentConfig
 * @type switch
 * @text Menu Switch ID
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 107
 *
 * @param levelConfig
 * @text LEVEL-RELATED SETUP
 *
 * @param max-level-threshold
 * @parent levelConfig
 * @type number
 * @text Max Level Threshold
 * @desc The max allowed difference in level between actor and enemy to gain AP from.
 * @min -1
 * @default 10
 *
 * @command mod-ap-all
 * @text Add/Remove AP (Party)
 * @desc Adds or removes a designated amount of AP from all members of the current party.
 * @arg points
 * @type number
 * @min -99999999
 * @max 99999999
 * @desc The amount of AP to modify by. Negative removes AP. Per-source never goes below 0.
 *
 * @command mod-ap
 * @text Add/Remove AP
 * @desc Adds or removes a designated amount of AP from an actor by its id.
 * @arg actorId
 * @type actor
 * @desc The id of the actor to modify AP for.
 * @arg points
 * @type number
 * @min -99999999
 * @max 99999999
 * @desc The amount of AP to modify by. Negative removes AP. Per-source never goes below 0.
 */
//endregion annotations

//region plugin metadata
class JAptitude_PluginMetadata
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

    // initialize this plugin from configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the metadata associated with this plugin.
   */
  initializeMetadata()
  {
    /**
     * The id of a switch that represents whether or not this system is accessible in the menu.
     * @type {number}
     */
    this.menuSwitchId = parseInt(this.parsedPluginParameters['menu-switch']);

    /**
     * The maximum level difference between actor and enemy that allows AP gain.
     * @type {number}
     */
    this.maxLevelThreshold = parseInt(this.parsedPluginParameters['max-level-threshold']);

    /**
     * Whether or not the level threshold limit is being used.
     * @type {boolean}
     */
    this.usingLevelThresholdLimit = this.maxLevelThreshold > -1;
  }
}

//endregion plugin metadata

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '3.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '4.5.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.APT = {};

/**
 * The plugin umbrella that governs all extensions related to the parent.
 */
J.APT.EXT ||= {};

/**
 * The metadata associated with this plugin.
 */
J.APT.Metadata = new JAptitude_PluginMetadata('J-Aptitude', '1.0.1');

/**
 * A collection of all aliased methods for this plugin.
 */
J.APT.Aliased = {};
J.APT.Aliased.BattleManager = new Map();
J.APT.Aliased.Game_Action = new Map();
J.APT.Aliased.Game_Actor = new Map();
J.APT.Aliased.JABS_Battler = new Map();
J.APT.Aliased.JABS_Engine = new Map();
J.APT.Aliased.Scene_Menu = new Map();
J.APT.Aliased.Window_MenuCommand = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.APT.RegExp = {};

/**
 * The structure of a learnable aptitude skill.
 *
 * <pre>
 * Structure:
 *  <aptitude:[SKILL_ID, REQUIRED_AP]>
 *
 * Example:
 *  <aptitude:[12, 150]>
 *
 * Translation:
 *  Skill Learned: 12
 *  Required AP  : 150
 * </pre>
 * @type {RegExp}
 */
J.APT.RegExp.AptitudeTeachable = /<aptitude:[ ]?(\[\d+,[ ]?\d+])>/gi;

/**
 * The AP reward an enemy yields on defeat.
 *
 * <pre>
 * Structure:
 *  <ap:AMOUNT>
 *
 * Example:
 *  <ap:12>
 *
 * Translation:
 *  AP gained: 12
 * </pre>
 * @type {RegExp}
 */
J.APT.RegExp.ApReward = /<ap: ?(\d+)>/i;

//endregion initialization

//region plugin commands
/**
 * Plugin command for modifying AP for all actors.
 */
PluginManager.registerCommand(
  J.APT.Metadata.name,
  'mod-ap-all',
  ({ points }) =>
  {
    // iterate over all members and gain the AP.
    $gameParty.members()
      .forEach(actor => ApManager.gainAp(actor, parseInt(points), 'plugin-command'));
  }
);

/**
 * Plugin command for modifying AP for a specific actor.
 */
PluginManager.registerCommand(
  J.APT.Metadata.name,
  'mod-ap',
  ({
    actorId,
    points
  }) =>
  {
    // grab the chosen actor.
    const actor = $gameActors.actor(parseInt(actorId));

    // gain the AP.
    ApManager.gainAp(actor, parseInt(points), 'plugin-command');
  }
);
//endregion plugin commands

//region AptitudeLearning
/**
 * The current state of a skill being learned.
 * @param {number} skillId The skill id to learn.
 * @param {number} requiredAp The required AP to achieve this learning.
 * @param {number} currentAp The current AP towards achieving this learning.
 * @constructor
 */
function AptitudeLearning(skillId, requiredAp, currentAp)
{
  this.initialize(skillId, requiredAp, currentAp);
}

AptitudeLearning.prototype = {};
AptitudeLearning.prototype.constructor = AptitudeLearning;

/**
 * Initializes the learning.
 * @param {number} skillId The skill id to learn.
 * @param {number} requiredAp The required AP to achieve this learning.
 * @param {number} currentAp The current AP towards achieving this learning.
 */
AptitudeLearning.prototype.initialize = function(skillId, requiredAp, currentAp)
{
  /**
   * The id of the skill learned when achieving this learning.
   * @type {number}
   */
  this.skillId = skillId;

  /**
   * The current AP towards achieving this learning.
   * @type {number}
   */
  this.currentAp = currentAp;

  /**
   * The required amount of AP to achieve this learning.
   * @type {number}
   */
  this.requiredAp = requiredAp;
};

/**
 * Gains AP towards achieving this learning.
 * @param {number} ap The amount of AP to gain.
 */
AptitudeLearning.prototype.gainAp = function(ap)
{
  this.currentAp += ap;
};

/**
 * Sets the current AP towards achieving this learning.
 * @param {number} ap The amount of AP to set.
 */
AptitudeLearning.prototype.setAp = function(ap)
{
  this.currentAp = ap;
}

/**
 * Whether or not this learning is achieved.
 * @returns {boolean} True if the learning is achieved, false otherwise.
 */
AptitudeLearning.prototype.isLearned = function()
{
  return this.currentAp >= this.requiredAp;
};
//endregion AptitudeLearning

//region AptitudeProgress
/**
 * The structure of an object and its potential {@link AptitudeLearning}s.
 * @param {string} key "type:id" unique key of the aptitude being learned.
 * @param {Record<number, AptitudeLearning>} aptitudeLearnings The current state of learnings.
 * @constructor
 */
function AptitudeProgress(key, aptitudeLearnings)
{
  this.initialize(key, aptitudeLearnings);
}

AptitudeProgress.prototype = {};
AptitudeProgress.prototype.constructor = AptitudeProgress;

/**
 * Initializes the learning.
 * @param {string} key "type:id" unique key of the aptitude being learned.
 * @param {Record<number, AptitudeLearning>} [aptitudeLearnings] The current state of learnings; defaults to nothing.
 */
AptitudeProgress.prototype.initialize = function(key, aptitudeLearnings = {})
{
  /**
   * The "type:id" unique key of the aptitude being learned.
   * @type {string}
   */
  this.key = key;

  /**
   * The current state of learnings.
   * @type {Record<number, AptitudeLearning>}
   */
  this._learnings = aptitudeLearnings;
};

/**
 * Gets the current progress for a skill.
 * @param {number} skillId The skill id to learn.
 * @returns {AptitudeLearning|null} The current learning for the skill, or null if it doesn't exist.
 */
AptitudeProgress.prototype.learningBySkillId = function(skillId)
{
  // get the current progress for the skill, or politely coalesce to null if it doesn't exist.
  return this._learnings[skillId] ?? null;
};

/**
 * Determines whether or not this aptitude progress has a learning for the given skill.
 * @param {number} skillId The skill id to check for.
 * @returns {boolean} True if the skill exists on this progress, false otherwise.
 */
AptitudeProgress.prototype.hasLearning = function(skillId)
{
  return this._learnings[skillId] !== undefined;
};

/**
 * Adds or updates a learning for this aptitude progress.
 * @param {number} skillId The skill id to learn.
 * @param {number} [amount] The current amount of AP for the learning; defaults to 0.
 */
AptitudeProgress.prototype.setLearning = function(skillId, amount = 0)
{
  // check if we have the learning already.
  if (this.hasLearning(skillId) === false) return;

  // we do, so just grab what exists.
  const learning = this.learningBySkillId(skillId);

  // update the AP for it.
  learning.setAp(amount);
};

/**
 * Creates a new learning for this aptitude progress.
 * @param {number} skillId The id of the skill for the learning.
 * @param {number} requiredAp The amount of AP required for the learning.
 * @param {number} [amount] The current amount of AP for the learning; defaults to 0.
 */
AptitudeProgress.prototype.initializeLearning = function(skillId, requiredAp, amount = 0)
{
  // we don't have it, so create a new one with this amount.
  this._learnings[skillId] = new AptitudeLearning(skillId, requiredAp, amount);
};

/**
 * Gets the current state of learnings for this aptitude progress tracker.
 * @returns {Record<number, AptitudeLearning>}
 */
AptitudeProgress.prototype.learnings = function()
{
  return this._learnings;
};
//endregion AptitudeProgress

//region AptitudeSkill
/**
 * The structure of an object and the skill that was learned.
 * @param {skillId} skillId The skill id that was learned.
 * @param {boolean} [learned] Whether or not the skill was learned; defaults to false.
 * @constructor
 */
function AptitudeSkill(skillId, learned = false)
{
  this.initialize(skillId, learned);
}

AptitudeSkill.prototype = {};
AptitudeSkill.prototype.constructor = AptitudeSkill;

/**
 * Initializes the learning.
 * @param {skillId} skillId The skill id that was learned.
 * @param {boolean} [learned] Whether or not the skill was learned; defaults to false.
 */
AptitudeSkill.prototype.initialize = function(skillId, learned = false)
{
  /**
   * The skill id that was learned.
   * @type {number}
   */
  this.skillId = skillId;

  /**
   * Whether or not this aptitude skill is learned.
   * @type {boolean}
   */
  this.learned = learned;

  /**
   * The "type:id" key of the aptitude that this skill was learned from.
   * @type {string}
   */
  this._learnedFrom = String.empty;
};

/**
 * Learns the skill.
 * @param {AptitudeProgress} learnedFrom The aptitude from which this skill was learned.
 */
AptitudeSkill.prototype.learnSkill = function(learnedFrom)
{
  // flag the aptitude as learned.
  this.learned = true;

  // identify what aptitude it was learned from.
  this._learnedFrom = learnedFrom.key;
};

/**
 * Forgets the skill.
 */
AptitudeSkill.prototype.forgetSkill = function()
{
  // flag the aptitude as not learned.
  this.learned = false;

  // clear the aptitude that it was learned from.
  this._learnedFrom = String.empty;
};

/**
 * Gets the key of the aptitude that this skill was learned from.
 * @returns {string}
 */
AptitudeSkill.prototype.learnedFrom = function()
{
  // TODO: map this to something meaningful for output.
  return this._learnedFrom;
};
//endregion AptitudeSkill

// #region AptitudeSkillAggregate

/**
 * Represents one skill learned via aptitudes across all sources on an actor.
 * Holds per‑source progress and exposes convenience accessors for list/details UIs.
 */
class AptitudeSkillAggregate
{
  /**
   * The skill id.
   * @type {number}
   */
  #skillId = 0;

  /**
   * The database skill.
   * @type {RPG_Skill}
   */
  #skill = null;

  /**
   * The sources that this skill reside in.
   * @type {AptitudeSkillSourceProgress[]}
   */
  #sources = [];

  /**
   * @param {number} skillId The skill id.
   * @param {RPG_Skill} skillData The database skill for name/icon/desc.
   */
  constructor(skillId, skillData)
  {
    // store the skill id.
    this.#skillId = skillId;

    // store the database skill reference.
    this.#skill = skillData;

    // initialize the per‑source rows.
    this.#sources = [];
  }

  /**
   * Adds one per‑source progress row to this aggregate.
   * @param {AptitudeSkillSourceProgress} src The per‑source row.
   */
  addSource(src)
  {
    // push the source row into this aggregate.
    this.sources()
      .push(src);
  }

  /**
   * The skill id for this aggregate.
   * @returns {number}
   */
  skillId()
  {
    return this.#skillId;
  }

  /**
   * The database object for the skill.
   * @returns {RPG_Skill}
   */
  skill()
  {
    return this.#skill;
  }

  /**
   * The name of the skill.
   * @returns {string}
   */
  name()
  {
    return this.#skill.name;
  }

  /**
   * The icon index of the skill.
   * @returns {number}
   */
  iconIndex()
  {
    return this.#skill.iconIndex;
  }

  /**
   * The sources that this skill resides in.
   * @returns {AptitudeSkillSourceProgress[]}
   */
  sources()
  {
    return this.#sources;
  }

  /**
   * Whether or not this skill has been learned in any source.
   * @returns {boolean}
   */
  learnedAny()
  {
    return this.sources()
      .some(source => source.learned() === true);
  }

  /**
   * Finds the source with the minimum remaining AP among not‑yet‑learned sources.
   * If all sources are learned, returns the first source for display context.
   * @returns {AptitudeSkillSourceProgress|null}
   */
  cheapestSource()
  {
    // start with no cheapest found.
    let cheapest = null;

    const sources = this.sources();

    // iterate all sources.
    sources.forEach(s =>
    {
      // skip learned sources when searching cheapest remaining.
      if (s.learned() === true)
      {
        return;
      }

      // compute the remaining AP for this source.
      const remaining = s.remainingAp();

      // select if first or cheaper than previous.
      if (cheapest === null || remaining < cheapest.remainingAp())
      {
        cheapest = s;
      }
    });

    // if all sources were learned but we have sources, return the first.
    if (cheapest === null && sources.length > 0)
    {
      return sources[0];
    }

    // return the cheapest or null.
    return cheapest;
  }

  /**
   * Convenience: current AP of the cheapest path for list UI.
   * @returns {number}
   */
  currentAp()
  {
    // find the cheapest source.
    const cheapest = this.cheapestSource();

    // return its current AP, or 0 if none.
    return cheapest
      ? cheapest.currentAp()
      : 0;
  }

  /**
   * Convenience: required AP of the cheapest path for list UI.
   * @returns {number}
   */
  requiredAp()
  {
    // find the cheapest source.
    const cheapest = this.cheapestSource();

    // return its required AP, or 1 if none to prevent div‑by‑zero gauges.
    return cheapest
      ? cheapest.requiredAp()
      : 1;
  }
}

// #endregion AptitudeSkillAggregate

//region AptitudeSkillSourceProgress
/**
 * Represents per‑source progress for learning a skill via aptitudes.
 */
class AptitudeSkillSourceProgress
{
  /**
   * The source key (e.g., equipment/state/skill source id string).
   * @type {string}
   */
  #sourceKey = String.empty;

  /**
   * The skill id this source contributes AP toward.
   * @type {number}
   */
  #skillId = 0;

  /**
   * The current AP accumulated toward the skill.
   * @type {number}
   */
  #currentAp = 0;

  /**
   * The total AP required to learn the skill.
   * @type {number}
   */
  #requiredAp = 0;

  /**
   * Whether or not the skill has been learned from this source.
   * @type {boolean}
   */
  #learned = false;

  /**
   * Constructor.
   * @param {string} sourceKey - The source key (e.g., equipment/state/skill source id string).
   * @param {number} skillId - The skill id this source contributes AP toward.
   * @param {number} currentAp - The current AP accumulated for this source toward the skill.
   * @param {number} requiredAp - The total AP required to learn from this source.
   * @param {boolean} learned - Whether this source already granted the skill (complete).
   */
  constructor(sourceKey, skillId, currentAp, requiredAp, learned)
  {
    // store the source key.
    this.#sourceKey = sourceKey;

    this.#skillId = skillId;

    // store current AP.
    this.#currentAp = currentAp;

    // store required AP.
    this.#requiredAp = requiredAp;

    // store learned flag.
    this.#learned = learned === true;
  }

  /**
   * The key of the source.
   * @returns {string}
   */
  sourceKey()
  {
    return this.#sourceKey;
  }

  /**
   * The skill id this source contributes AP toward.
   * @returns {number}
   */
  skillId()
  {
    return this.#skillId;
  }

  /**
   * The current AP accumulated toward the skill.
   * @returns {number}
   */
  currentAp()
  {
    return this.#currentAp;
  }

  /**
   * The total AP required to learn the skill.
   * @returns {number}
   */
  requiredAp()
  {
    return this.#requiredAp;
  }

  /**
   * Whether or not the skill has been learned from this source.
   * @returns {boolean}
   */
  learned()
  {
    return this.#learned;
  }

  /**
   * The remaining AP needed to learn the skill.
   * @returns {number}
   */
  remainingAp()
  {
    // compute how much is left to reach required AP.
    return Math.max(0, this.requiredAp() - this.currentAp());
  }
}

//endregion AptitudeSkillSourceProgress

//region AptitudeTeachable
/**
 * The runtime shape of a learnable skill and its requirements.
 * @param {number} skillId The skill id to learn.
 * @param {number} requiredAp The required AP to learn the skill.
 * @constructor
 */
function AptitudeTeachable(skillId, requiredAp)
{
  this.initialize(skillId, requiredAp);
}

AptitudeTeachable.prototype = {};
AptitudeTeachable.prototype.constructor = AptitudeTeachable;

/**
 * Initializes the learning.
 * @param {number} skillId The skill id to learn.
 * @param {number} requiredAp The required AP to learn the skill.
 */
AptitudeTeachable.prototype.initialize = function(skillId, requiredAp)
{
  /**
   * The id of the skill to learn.
   * @type {number}
   */
  this.skillId = skillId;

  /**
   * The required AP to learn the skill.
   * @type {number}
   */
  this.requiredAp = requiredAp;
};
//endregion AptitudeTeachable

//region JABS_Battler
if (J.ABS)
{
  /**
   * Extends {@link #gainBasicRewards}.<br/>
   * Also includes AP when defeating an enemy.
   * @param {Game_Battler} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  J.APT.Aliased.JABS_Engine.set('gainBasicRewards', JABS_Engine.prototype.gainBasicRewards);
  JABS_Engine.prototype.gainBasicRewards = function(enemy, actor)
  {
    // perform original logic.
    J.APT.Aliased.JABS_Engine.get('gainBasicRewards')
      .call(this, enemy, actor);

    // grab the AP amount from the enemy.
    const ap = enemy.apPoints();

    // if there is no AP, do nothing.
    if (ap === 0) return;

    // gain the AP.
    this.gainAptitudeReward(ap, actor, enemy);
  };

  /**
   * Gains AP from battle rewards.
   * @param {number} ap The AP to gain.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   * @param {JABS_Battler} enemy The map battler that was defeated.
   */
  JABS_Engine.prototype.gainAptitudeReward = function(ap, actor, enemy)
  {
    // don't do anything if the enemy didn't grant any sdp points.
    if (ap === 0) return;

    // Award AP to the full party; per-actor distribution happens in ApManager.
    $gameParty.members()
      .filter(member => this.canGainAptitudeReward(member, enemy))
      .forEach(member =>
      {
        // identify the JABS battler that owns this member.
        const jabsBattler = JABS_AiManager.getBattlerByUuid(member.getUuid());

        // if somehow we have no battler here, then do nothing.
        if (!jabsBattler) return;

        // apply level scaling multiplier if applicable.
        const levelMultiplier = this.getRewardScalingMultiplier(enemy, jabsBattler);

        // round in favor of the player.
        const actualAp = Math.ceil(ap * levelMultiplier);

        // gain the applicable points.
        ApManager.gainAp(member, actualAp, 'on-kill');

        // generate the popup.
        this.generatePopAp(actualAp, jabsBattler.getCharacter());

        // create the log entry.
        this.createLogAp(actualAp, jabsBattler);
      });
  };

  /**
   * Determines whether or not the actor can gain AP from the enemy.
   * @param {Game_Actor} actor The map battler that defeated the target.
   * @param {Game_Enemy} enemy The map battler that was defeated.
   * @returns {boolean} True if the actor can gain AP, false otherwise.
   */
  JABS_Engine.prototype.canGainAptitudeReward = function(actor, enemy)
  {
    // check if we are using the level plugin.
    if (J.LEVEL && J.LEVEL.Metadata.enabled && J.APT.Metadata.usingLevelThresholdLimit === true)
    {
      // identify the level difference between the battlers.
      const levelDifference = actor.level - enemy.level;

      // if the level difference was too great, then no AP is gained.
      if (levelDifference > J.APT.Metadata.maxLevelThreshold) return false;
    }

    // gain that AP!
    return true;
  };

  /**
   * Generates a popup.
   * @param {number} apPoints The amount to display.
   * @param {Game_Character} character The character to show the popup on.
   */
  JABS_Engine.prototype.generatePopAp = function(apPoints, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const apPop = new TextPopBuilder(apPoints)
      .isAptitude()
      .build();

    // add the pop to the caster's tracking.
    character.addTextPop(apPop);
    character.requestTextPop();
  };

  /**
   * Creates the log entry.
   * @param {number} apPoints The AP gained.
   * @param {JABS_Battler} battler The battler gaining the AP.
   */
  JABS_Engine.prototype.createLogAp = function(apPoints, battler)
  {
    // if we are not logging, then don't do this.
    if (!J.LOG) return;

    // build the log entry.
    const apLog = new ActionLogBuilder()
      .setMessage(`\\C[16]${battler.battlerName()}\\C[0] gained \\C[29]\\*${apPoints}\\*\\C[0] AP.`)
      .build();

    // add the log to the action log manager.
    $actionLogManager.addLog(apLog);
  };
}
//endregion JABS_Battler

if (J.POPUPS)
{
  /**
   * The popup type of "ap", for displaying AP gain pops.
   */
  Map_TextPop.Types.Ap = 'ap';
}

if (J.POPUPS)
{
  /**
   * Add some convenient defaults for configuring AP points popups.
   * @returns {TextPopBuilder} The builder, for fluent chaining.
   */
  TextPopBuilder.prototype.isAptitude = function()
  {
    // set the popup type to be an AP point acquisition.
    this.setPopupType(Map_TextPop.Types.Ap);

    // set the text color to be lovely pink.
    this.setTextColorIndex(17);

    // set the icon index to the learned skill's icon.
    this.setIconIndex(86);

    // add no x variance when working with AP points.
    this.setXVariance(48);

    // add some y variance when working with AP points.
    this.setYVariance(96);

    // return the builder for fluent chaining.
    return this;
  };
}

//region RPG_Base
/**
 * Gets all {@link AptitudeTeachable}s associated with this database object.
 * @type {AptitudeTeachable[]}
 */
Object.defineProperty(RPG_Base.prototype, 'aptitudeTeachings', {
  get()
  {
    // extract the data from the notes- should be [skillId, requiredAp].
    const raw = RPGManager.getArraysFromNotesByRegex(this, J.APT.RegExp.AptitudeTeachable, true) ?? [];

    // map all the raw data to DTOs.
    return raw.map(([ skillId, requiredAp ]) => new AptitudeTeachable(skillId, requiredAp));
  },
});

//endregion RPG_Base

//region RPG_Enemy
/**
 * The number of AP this enemy will yield upon defeat.
 * @type {number}
 */
Object.defineProperty(RPG_Enemy.prototype, 'apPoints', {
  get()
  {
    // get the AP amount from this enemy's notes.
    return RPGManager.getNumberFromNoteByRegex(this, J.APT.RegExp.ApReward);
  },
});
//endregion RPG_Enemy

//region ApManager
class ApManager
{
  /**
   * Awards AP to the given actor, distributing to all active APT sources
   * and resolving any skill learns that cross their thresholds.
   * @param {Game_Actor} actor The actor gaining AP.
   * @param {number} amount The amount of AP awarded.
   * @param {string} cause A short label describing the cause (ex: 'victory').
   */
  static gainAp(actor, amount, cause = 'victory')
  {
    // don't bother if the AP gained is zero.
    if (this.canGainAp(actor, amount) === false) return;

    // build the list of active sources for this actor.
    const teachableSources = this.#activeTeachables(actor);

    // iterate each active source to apply AP.
    teachableSources.forEach(source =>
    {
      // deconstruct the source for readability.
      const {
        key,
        teachables
      } = source;

      // apply the AP to this source's taught skills.
      this.#applyApToSource(actor, key, teachables, amount, cause);
    });
  }

  /**
   * Determines whether the actor can gain AP.
   * @param {Game_Actor} actor The actor to evaluate.
   * @param {number} amount The amount of AP to check.
   * @returns {boolean} True if the actor can gain AP, false otherwise.
   */
  static canGainAp(actor, amount)
  {
    // dead actors cannot gain AP.
    if (actor.isDead()) return false;

    // zero AP cannot be gained.
    if (amount === 0) return false;

    // gain the AP!
    return true;
  }

  /**
   * Derives a stable key for a source.
   * @param {RPG_Base} source The source to derive a key for.
   * @returns {string} The stable key.
   */
  static deriveKey(source)
  {
    return `${source.implementationType()}:${source.id}`;
  }

  /**
   * Resolves a `sourceKey` (as produced by {@link ApManager.deriveKey}) back to the
   * concrete RPG object currently contributing aptitude teachables for the actor.
   *
   * Notes:
   * - This searches the actor’s current aptitude sources and matches by the same
   *   `deriveKey(source)` used during AP distribution, guaranteeing a stable pair.
   * - If the matched source is a skill, this returns the actor’s live skill entry
   *   (`actor.skill(id)`) to mirror the behavior in `#activeTeachables`.
   *
   * @param {Game_Actor} actor - The actor whose sources are searched.
   * @param {string} sourceKey - The stable key (e.g., "@base:usable:skill:17").
   * @returns {RPG_Actor|RPG_Class|RPG_Skill|RPG_Weapon|RPG_Armor|RPG_State|null} - The found source object.
   */
  static resolveSourceByKey(actor, sourceKey)
  {
    // guard against missing inputs.
    if (!actor) return null;

    // gather all current aptitude sources from the actor.
    const sources = actor.getAptitudeSources();

    // iterate the sources to find a matching key.
    for (let i = 0; i < sources.length; i++)
    {
      // grab the candidate source.
      const candidate = sources[i];

      // re-derive the stable key from this source.
      const key = this.deriveKey(candidate);

      // if the key matches, we have our source.
      if (key === sourceKey)
      {
        // if this is a skill, resolve to the actor's live skill entry.
        if (candidate.isSkill() === true)
        {
          // return the actor's known version of the database skill.
          return actor.skill(candidate.id);
        }

        // otherwise, return the source as-is.
        return candidate;
      }
    }

    // no matching source was found.
    return null;
  }

  /**
   * Resolves a `sourceKey` into a database object (ignores actor state).
   * @param {string} sourceKey
   * @returns {RPG_Actor|RPG_Class|RPG_Skill|RPG_Weapon|RPG_Armor|RPG_State|RPG_Item|null}
   */
  static resolveStaticSourceByKey(sourceKey)
  {
    const parsed = this.parseKey(sourceKey);
    if (!parsed || Number.isFinite(parsed.id) === false) return null;
    const {
      types,
      id
    } = parsed;
    const terminal = types[types.length - 1];
    switch (terminal)
    {
      case 'skill':
        return $dataSkills[id] || null;
      case 'weapon':
        return $dataWeapons[id] || null;
      case 'armor':
        return $dataArmors[id] || null;
      case 'state':
        return $dataStates[id] || null;
      case 'class':
        return $dataClasses[id] || null;
      case 'actor':
        return $dataActors[id] || null;
      case 'item':
        return $dataItems[id] || null;
      default:
        return null;
    }
  }

  static isSourceActive(actor, sourceKey)
  {
    if (!actor) return false;
    // Build a set of current keys once per call; S is usually small.
    const sources = actor.getAptitudeSources();
    for (let i = 0; i < sources.length; i++)
    {
      const key = this.deriveKey(sources[i]);
      if (key === sourceKey) return true;
    }
    return false;
  }

  /**
   * Resolves a list of `sourceKey`s into their concrete source objects.
   *
   * @param {Game_Actor} actor - The actor whose sources are searched.
   * @param {string[]} sourceKeys - The list of stable keys to resolve.
   * @returns {(RPG_Base|null)[]} - Array of resolved sources (null where missing).
   */
  static resolveAllSourcesByKeys(actor, sourceKeys)
  {
    // coalesce an empty list if none provided.
    const keys = Array.isArray(sourceKeys)
      ? sourceKeys
      : [];

    // map each key through the single-key resolver.
    const resolved = keys.map(key => this.resolveSourceByKey(actor, key));

    // return the resolved list.
    return resolved;
  }

  /**
   * Parses a `sourceKey` produced by {@link ApManager.deriveKey}.
   *
   * A key looks like: "@base:traited:equip:weapon:12" or "@base:usable:skill:17".
   * The final segment is always the numeric id; all preceding segments are the
   * type chain assembled via `implementationType()` across the inheritance stack.
   *
   * @param {string} sourceKey - The stable key to parse.
   * @returns {{ types: string[], id: number }} - The parsed components.
   */
  static parseKey(sourceKey)
  {
    // split on ':' to separate type chain and id.
    const parts = String(sourceKey)
      .split(':');

    // if we don't have at least type+id, return a minimal shape.
    if (parts.length < 2)
    {
      // provide a safe fallback.
      return {
        types: [],
        id: NaN
      };
    }

    // extract the id (final segment).
    const idText = parts[parts.length - 1];

    // parse into a number.
    const id = Number(idText);

    // everything before the id is the type chain.
    const types = parts.slice(0, parts.length - 1);

    // return the parsed structure.
    return {
      types,
      id
    };
  }

  /**
   * Builds the list of currently active APT sources for the actor.
   * Each source contains a stringy `key` and a {@link AptitudeTeachable[]} `teachables`.
   * @param {Game_Actor} actor The actor to evaluate.
   * @returns {{ key: string, teachables: AptitudeTeachable[] }[]} The active teachable sources.
   */
  static #activeTeachables(actor)
  {
    // acquire all potential sources.
    const sources = actor.getAptitudeSources();

    // draw up a set for keys to prevent dupes.
    const foundKeys = new Set();

    // all the results with teachables.
    const results = [];

    // iterate once; conditionally add entries that matter.
    sources.forEach(source =>
    {
      // derive stable key like 'equip:weapon:5'.
      const key = this.deriveKey(source);

      // skip duplicate sources.
      if (foundKeys.has(key)) return;

      // this might be a skill requiring extension.
      let trueSource = source;

      // check if the source is a skill.
      if (source.isSkill())
      {
        // get the full skill.
        trueSource = actor.skill(source.id);
      }

      // grab all the teachables.
      const teachables = trueSource.aptitudeTeachings;

      // only include if there is at least one teachable.
      if (teachables.length === 0) return;

      // flag this key as found to prevent dupes.
      foundKeys.add(key);

      // record this source for downstream AP application.
      results.push({
        key,
        teachables
      });
    });

    // Return only meaningful sources.
    return results;
  }

  /**
   * Applies AP to all relevant skill tracks for a single source, then resolves learns.
   * @param {Game_Actor} actor The actor gaining AP.
   * @param {string} sourceKey The stable key for this source.
   * @param {AptitudeTeachable[]} teachables The skills this source teaches.
   * @param {number} amount The AP awarded for this tick.
   * @param {string} cause The cause string for debugging/toasts.
   */
  static #applyApToSource(actor, sourceKey, teachables, amount, cause)
  {
    // iterate each teachable to add progress and check thresholds.
    teachables.forEach(teachable =>
    {
      // destructure the teachable for readability.
      const {
        skillId,
        requiredAp
      } = teachable;

      // skip if already learned permanently.
      if (actor.hasLearnedAptitudeSkill(skillId)) return;

      // validate the progress exists on the actor.
      if (actor.hasAptitudeProgress(sourceKey) === false)
      {
        // initialize the progress for this source.
        actor.initializeAptitudeProgress(sourceKey, skillId, requiredAp, 0);
      }

      // Get current progress for this skill from this source.
      const aptitudeProgress = actor.getAptitudeProgress(sourceKey);

      // validate the learning exists on the progress.
      if (aptitudeProgress.hasLearning(skillId) === false)
      {
        // initialize the learning.
        aptitudeProgress.initializeLearning(skillId, requiredAp, 0);
      }

      // grab the learning from the progress.
      const aptitudeLearning = aptitudeProgress.learningBySkillId(skillId);

      // the previous amount of AP acquired.
      const before = aptitudeLearning.currentAp;

      // Calculate updated progress.
      const unclamped = before + amount;
      const after = Math.max(0, Math.min(unclamped, requiredAp));

      // Persist the updated progress.
      actor.setAptitudeProgress(sourceKey, skillId, after);

      // Check if the threshold was crossed this tick.
      if (aptitudeLearning.isLearned())
      {
        // Resolve the learn and emit feedback.
        this.#resolveLearn(actor, sourceKey, skillId, cause);
      }
    });
  }

  /**
   * Resolves learning the skill permanently and emits any feedback.
   * @param {Game_Actor} actor The actor learning a skill.
   * @param {string} sourceKey The source that triggered the learn.
   * @param {number} skillId The id of the learned skill.
   * @param {string} cause A short label describing why this occurred.
   */
  // eslint-disable-next-line no-unused-vars
  static #resolveLearn(actor, sourceKey, skillId, cause)
  {
    // Mark the skill as learned in the actor's APT data.
    actor.learnAptitudeSkill(skillId, sourceKey);

    // Learn it in the engine if not already known.
    if (actor.isLearnedSkill(skillId) === false)
    {
      // Add the skill to the actor's known skills.
      actor.learnSkill(skillId);
    }

    // Emit a toast or other UI feedback via your popups integration (hook later).
    // Example idea (pseudo): J.POPUPS.pushLearnedSkill(actor, skillId, sourceKey, cause);
  }
}

//endregion ApManager

//region BattleManager
/**
 * Extends {@link #makeRewards}.<br/>
 * Also includes the aptitude AP earned.
 */
J.APT.Aliased.BattleManager.set('makeRewards', BattleManager.makeRewards);
BattleManager.makeRewards = function()
{
  // Perform original logic.
  J.APT.Aliased.BattleManager.get('makeRewards')
    .call(this);

  // Extend the rewards to include AP.
  this._rewards = {
    ...this._rewards,
    aptitudeAp: $gameTroop.aptitudeApTotal(),
  };
};

/**
 * Extends {@link #gainRewards}.<br/>
 * Also awards the aptitude AP to party members via ApManager.
 */
J.APT.Aliased.BattleManager.set('gainRewards', BattleManager.gainRewards);
BattleManager.gainRewards = function()
{
  // Perform original logic.
  J.APT.Aliased.BattleManager.get('gainRewards')
    .call(this);

  // Also gain the APT AP rewards.
  this.gainAptitudeApRewards();
};

/**
 * Performs the AP award for all members of the party after battle.
 */
BattleManager.gainAptitudeApRewards = function()
{
  // Extract the AP that was earned.
  const { aptitudeAp } = this._rewards;

  // If there was no AP, then there is nothing to do.
  if (!aptitudeAp) return;

  // Iterate over each current party member and award AP.
  $gameParty.members()
    .forEach(actor => ApManager.gainAp(actor, aptitudeAp, 'victory'));
};

/**
 * Extends {@link #displayRewards}.<br/>
 * Also displays the AP victory text.
 */
J.APT.Aliased.BattleManager.set('displayRewards', BattleManager.displayRewards);
BattleManager.displayRewards = function()
{
  // Also display AP rewards first.
  this.displayAptitudeAp();

  // Perform original logic.
  J.APT.Aliased.BattleManager.get('displayRewards')
    .call(this);
};

/**
 * Displays the AP victory text in the victory log.
 */
BattleManager.displayAptitudeAp = function()
{
  // Extract the AP that was earned.
  const { aptitudeAp } = this._rewards;

  // If no AP was earned, do not display anything.
  if (!aptitudeAp) return;

  // Define the message to add (tune to taste or i18n).
  const text = `\\. ${aptitudeAp} AP gained`;

  // Add it to the victory log.
  $gameMessage.add(text);
};
//endregion BattleManager

//region Game_Actor
/**
 * Extends {@link #initMembers}.<br/>
 * Also initializes aptitude members.
 */
J.APT.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.APT.Aliased.Game_Actor.get('initMembers')
    .call(this);

  // also initialize aptitude members.
  this.initAptitudeMembers();
};

/**
 * Initializes the aptitude members.
 */
Game_Actor.prototype.initAptitudeMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with this plugin.
   */
  this._j._aptitude ||= {};

  /**
   * A collection of all aptitudes that are presently being learned.
   * @type {Record<string, AptitudeProgress>}
   */
  this._j._aptitude._progress = {};

  /**
   * The aptitude skills for this actor.
   * @type {Record<number, AptitudeSkill>}
   */
  this._j._aptitude._learned = {};
};

/**
 * Gets all aptitude progress for this actor.
 * @returns {Record<string, AptitudeProgress>}
 */
Game_Actor.prototype.getAllAptitudeProgresses = function()
{
  // emergency initialize for existing saves.
  if (!this._j._aptitude) this.initAptitudeMembers();

  return this._j._aptitude._progress;
};

/**
 * Gets all learned aptitude skills for this actor.
 * @returns {Record<number, AptitudeSkill>}
 */
Game_Actor.prototype.getAllAptitudeSkillsLearned = function()
{
  // emergency initialize for existing saves.
  if (!this._j._aptitude) this.initAptitudeMembers();

  return this._j._aptitude._learned;
};

/**
 * Builds per‑skill aptitude aggregates across all current sources on this actor.
 * Each aggregate contains the database skill and all per‑source progress rows.
 * @returns {AptitudeSkillAggregate[]} The list of aggregates, one per skill id.
 */
Game_Actor.prototype.getAptitudeSkillAggregates = function()
{
  // acquire all aptitude progresses keyed by source.
  const progresses = this.getAllAptitudeProgresses();

  // build index keyed by skillId.
  /** @type {{ [skillId: string]: AptitudeSkillAggregate }} */
  const perSkill = {};

  // iterate each source → progress.
  Object.entries(progresses)
    .forEach(([ sourceKey, progress ]) =>
    {
      // iterate each learning under this progress.
      Object.entries(progress.learnings())
        .forEach(([ skillId, learning ]) =>
        {
          // create the aggregate if not present.
          if (!perSkill[skillId])
          {
            // retrieve the database skill for name/icon/desc.
            const skillData = this.skill(skillId);

            // initialize the aggregate bucket.
            perSkill[skillId] = new AptitudeSkillAggregate(skillId, skillData);
          }

          // build the per‑source row for this skill (now includes skillId).
          const row = new AptitudeSkillSourceProgress(
            sourceKey,
            skillId,
            learning.currentAp,
            learning.requiredAp,
            learning.isLearned()
          );

          // add this source row into the aggregate.
          perSkill[skillId].addSource(row);
        });
    });

  // return the aggregates as an array in numeric skillId order by default.
  return Object.values(perSkill)
    .sort((a, b) => a.skillId() - b.skillId());
};

/**
 * Gets the aptitude progress for the given key.
 * @param {string} key The key to get the progress for.
 * @returns {AptitudeProgress|null} The aptitude progress for the given key.
 */
Game_Actor.prototype.getAptitudeProgress = function(key)
{
  // emergency initialize for existing saves.
  if (!this._j._aptitude) this.initAptitudeMembers();

  // get the progress, or coalesce politely to null if it doesn't exist.
  return this._j._aptitude._progress[key] ?? null;
};

/**
 * Determines whether or not the actor has a progress for the given key.
 * @param {string} key The key to check for progress.
 * @returns {boolean} True if the actor has progress for the key, false otherwise.
 */
Game_Actor.prototype.hasAptitudeProgress = function(key)
{
  return this._j._aptitude._progress[key] !== undefined;
};

/**
 * Sets the aptitude progress for the given key, skill id, and current AP.
 * @param {string} key The key to set the progress for.
 * @param {number} skillId The skill id to learn.
 * @param {number} [currentAp] The current AP for the learning; defaults to 0.
 */
Game_Actor.prototype.setAptitudeProgress = function(key, skillId, currentAp = 0)
{
  // check if the progress exists.
  if (this.hasAptitudeProgress(key) === false) return;

  // grab the progress of the key.
  const progress = this.getAptitudeProgress(key);

  // update the progress with the new learning.
  progress.setLearning(skillId, currentAp);
};

/**
 * Initializes the aptitude progress for the given key, skill id, and current AP.
 * @param {string} key The key to create the progress for.
 * @param {number} skillId The skill id to learn.
 * @param {number} requiredAp The amount of AP required for the learning.
 * @param {number} currentAp The current AP for the learning.
 */
Game_Actor.prototype.initializeAptitudeProgress = function(key, skillId, requiredAp, currentAp = 0)
{
  // we don't have one, so create a new progress.
  const newProgress = this.createAptitudeProgress(key, skillId, requiredAp, currentAp);

  // update the mapping with the new progress.
  this._j._aptitude._progress[key] = newProgress;
};

/**
 * Creates a new aptitude progress for the given key and skill id.
 * @param {string} key The key to create the progress for.
 * @param {number} skillId The skill id to learn.
 * @param {number} requiredAp The amount of AP required for the learning.
 * @param {number} initialAp The initial AP to set for the learning.
 * @returns {AptitudeProgress} The created aptitude progress.
 */
Game_Actor.prototype.createAptitudeProgress = function(key, skillId, requiredAp, initialAp)
{
  // we don't have one, so create a new progress.
  const newProgress = new AptitudeProgress(key);

  // add the new learning to this progress with the initial AP.
  newProgress.setLearning(skillId, requiredAp, initialAp);

  // return the built aptitude progress.
  return newProgress;
};

/**
 * Gets the aptitude learning for the given key and skill id.
 * @param {string} key The key to get the learning for.
 * @param {number} skillId The skill id to learn.
 * @returns {AptitudeLearning|null} The aptitude learning for the given key and skill id, or null if it doesn't exist.
 */
Game_Actor.prototype.getAptitudeLearning = function(key, skillId)
{
  // check if we have an aptitude progress for the key.
  if (this.hasAptitudeProgress(key) === false) return null;

  // grab the progress of the key.
  const progress = this.getAptitudeProgress(key);

  // if its null, then the key didn't map to anything.
  if (progress.hasLearning(skillId) === false) return null;

  // return the learning.
  return progress.learningBySkillId(skillId);
};

/**
 * Gets all aptitude sources for this actor.
 * This is typed as {@link RPG_Base}, but can yield many of its subclasses.
 * @returns {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]}
 */
Game_Actor.prototype.getAptitudeSources = function()
{
  // get literally everything.
  return this.getAllNotes()
    // exclude skills since we are learning skills.
    .filter(obj => obj.isSkill() === false);
};

/**
 * Gets whether or not this actor has the aptitude skill registered.
 * @param {number} skillId The skill id to check.
 * @returns {boolean} True if the actor has the aptitude skill registered, false otherwise.
 */
Game_Actor.prototype.hasAptitudeSkill = function(skillId)
{
  return this._j._aptitude._learned[skillId] !== undefined;
};

/**
 * Gets the aptitude skill for the given skill id.
 * @param {number} skillId The skill id to check.
 * @returns {AptitudeSkill|null} The aptitude skill for the given skill id, or null if it doesn't exist.
 */
Game_Actor.prototype.getAptitudeSkill = function(skillId)
{
  return this._j._aptitude._learned[skillId];
};

/**
 * Sets the aptitude skill for the given skill id.
 * @param {number} skillId The skill id to set.
 * @param {AptitudeSkill} aptitudeSkill The aptitude skill to set.
 */
Game_Actor.prototype.setAptitudeSkill = function(skillId, aptitudeSkill)
{
  // set the aptitude.
  this._j._aptitude._learned[skillId] = aptitudeSkill;
};

/**
 * Gets whether or not this actor has learned the given skill from an aptitude.
 * @param {number} skillId The skill id to check.
 * @returns {boolean} True if the actor has learned the skill, false otherwise.
 */
Game_Actor.prototype.hasLearnedAptitudeSkill = function(skillId)
{
  // if we don't have the aptitude skill, then we can't possibly have learned it.
  if (this.hasAptitudeSkill(skillId) === false) return false;

  // grab the aptitude skill.
  const aptitudeSkill = this.getAptitudeSkill(skillId);

  // return whether or not the skill is learned.
  return aptitudeSkill.learned === true;
};

/**
 * Marks the given skill as learned from an aptitude.
 * @param {number} skillId The skill id to mark as learned.
 * @param {string} sourceKey The source key for the aptitude.
 */
Game_Actor.prototype.learnAptitudeSkill = function(skillId, sourceKey)
{
  // don't process the learning if we already learned it.
  if (this.hasLearnedAptitudeSkill(skillId)) return;

  // check if we're missing the aptitude skill.
  if (this.hasAptitudeSkill(skillId) === false)
  {
    // create a new aptitude skill.
    const newAptitudeSkill = this.createAptitudeSkill(skillId);

    // set the aptitude skill.
    this.setAptitudeSkill(skillId, newAptitudeSkill);
  }

  // grab the aptitude skill.
  const aptitudeSkill = this.getAptitudeSkill(skillId);

  // grab the progress of the source key.
  const aptitudeProgress = this.getAptitudeProgress(sourceKey);

  // stamp the skill as learned with the given progress.
  aptitudeSkill.learnSkill(aptitudeProgress);
};

/**
 * Creates a new aptitude skill for the given skill id.
 * @param {number} skillId The skill id to create the skill for.
 * @param {boolean} [isLearned] Whether or not the skill is already learned; defaults to false.
 * @returns {AptitudeSkill} The created aptitude skill.
 */
Game_Actor.prototype.createAptitudeSkill = function(skillId, isLearned = false)
{
  // generate the new aptitude skill.
  return new AptitudeSkill(skillId, isLearned);
};
//endregion Game_Actor

//region Game_Battler
/**
 * Gets the AP points this battler yields upon defeat..
 * @returns {number}
 */
Game_Battler.prototype.apPoints = function()
{
  return this.databaseData().apPoints;
};

//endregion Game_Battler

//region Game_Troop (APT)
/**
 * Gets the amount of AP earned from all defeated enemies in the troop.
 * @returns {number}
 */
Game_Troop.prototype.aptitudeApTotal = function()
{
  // Initialize the total to zero.
  let ap = 0;

  // Sum the AP from all dead enemies in this troop.
  this.deadMembers()
    .forEach(enemy => ap += enemy.apPoints);

  // Return the summed AP.
  return ap;
};
//endregion Game_Troop (APT)

//region Scene_Aptitude
/**
 * The scene for viewing aptitude progress.
 */
class Scene_Aptitude
  extends Scene_MenuBase
{
  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  /**
   * The available view modes for the aptitude windows.
   */
  static viewMode = {
    /**
     * The view mode for viewing aggregates of aptitudes.
     */
    AGGREGATE: 'aggregate',

    /**
     * The view mode for viewing aptitude sources.
     */
    SOURCE: 'source'
  };

  //region init
  /**
   * Extends {@link #initMembers}.<br/>
   * Also initializes the aptitude members.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    // initialize the core aptitude namespace.
    this.initCoreMembers();

    // initialize the primary members for the scene.
    this.initPrimaryMembers();
  }

  /**
   * Initializes the core aptitude members.
   */
  initCoreMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * A grouping of all properties associated with the aptitude system.
     */
    this._j._aptitude = {};
  }

  /**
   * Initializes the primary members for the scene.
   */
  initPrimaryMembers()
  {
    /**
     * The last index tracked in the aggregate list window, per-actor.
     * Keyed by actorId → number.
     * @type {{[actorId:number]: number}}
     */
    this._j._aptitude._lastAggregateIndexByActor = {};

    /**
     * The last index tracked in the source list window, per-actor.
     * Keyed by actorId → number.
     * @type {{[actorId:number]: number}}
     */
    this._j._aptitude._lastSourceIndexByActor = {};

    /**
     * The current view mode for the aptitude windows.
     * Toggle between "aggregate" and "source" views.
     * @type {string}
     */
    this._j._aptitude._viewMode = Scene_Aptitude.viewMode.AGGREGATE;

    /**
     * The aptitude aggregates for the current actor.
     * @type {AptitudeSkillAggregate[]}
     */
    this._j._aptitude._aggregates = [];

    /**
     * The aptitude sources for the current actor.
     * @type {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]}
     */
    this._j._aptitude._sources = [];

    /**
     * A grouping of all windows for this scene.
     */
    this._j._aptitude._windows = {};

    /**
     * The ribbon window to display the actor and their name.
     * @type {Window_AptitudeRibbon|null}
     */
    this._j._aptitude._windows._ribbon = null;

    /**
     * The list window that displays the per-skill aggregates.
     * @type {Window_AptitudeAggregateList|null}
     */
    this._j._aptitude._windows._aggregateList = null;

    /**
     * The list window that displays the actor's sources.
     * @type {Window_AptitudeSourceList|null}
     */
    this._j._aptitude._windows._sourceList = null;

    /**
     * The details window that displays all sources and respective progress towards learning the skill.
     * @type {Window_AptitudeAggregateDetails|null}
     */
    this._j._aptitude._windows._aggregateDetails = null;

    /**
     * The details window that displays what this aptitude source is teaching.
     * @type {Window_AptitudeSourceDetails|null}
     */
    this._j._aptitude._windows._sourceDetails = null;
  }

  //endregion init

  //region accessors
  /**
   * Gets the last index tracked in the aggregate list window for the current actor.
   * @returns {number}
   */
  lastAggregateIndex()
  {
    // get the current actor id.
    const actorId = this.actor().actorId();

    // pull from the map; default to 0 if not yet set.
    const map = this._j._aptitude._lastAggregateIndexByActor;
    if (map[actorId] === undefined)
    {
      map[actorId] = 0;
    }

    // return the remembered index.
    return map[actorId];
  }

  /**
   * Sets the last index tracked in the aggregate list window for the current actor.
   * @param {number} index - The new index to track.
   */
  setLastAggregateIndex(index)
  {
    // get the current actor id.
    const actorId = this.actor().actorId();

    // update the remembered index for this actor.
    this._j._aptitude._lastAggregateIndexByActor[actorId] = index;
  }

  /**
   * Gets the last index tracked in the source list window for the current actor.
   * @returns {number}
   */
  lastSourceIndex()
  {
    // get the current actor id.
    const actorId = this.actor().actorId();

    // pull from the map; default to 0 if not yet set.
    const map = this._j._aptitude._lastSourceIndexByActor;
    if (map[actorId] === undefined)
    {
      map[actorId] = 0;
    }

    // return the remembered index.
    return map[actorId];
  }

  /**
   * Sets the last index tracked in the source list window for the current actor.
   * @param {number} index - The new index to track.
   */
  setLastSourceIndex(index)
  {
    // get the current actor id.
    const actorId = this.actor().actorId();

    // update the remembered index for this actor.
    this._j._aptitude._lastSourceIndexByActor[actorId] = index;
  }

  /**
   * Ensures selection tracker indices exist for the current actor without overwriting them.
   * This initializes to 0 only if the current actor does not yet have entries.
   */
  resetSelectionTrackers()
  {
    // get the current actor id.
    const actorId = this.actor().actorId();

    // ensure aggregate index exists.
    const aggMap = this._j._aptitude._lastAggregateIndexByActor;
    if (aggMap[actorId] === undefined)
    {
      aggMap[actorId] = 0;
    }

    // ensure source index exists.
    const srcMap = this._j._aptitude._lastSourceIndexByActor;
    if (srcMap[actorId] === undefined)
    {
      srcMap[actorId] = 0;
    }
  }

  /**
   * Gets the cached list of per‑skill aggregates for the current actor.
   * @returns {AptitudeSkillAggregate[]}
   */
  aggregates()
  {
    // return the cached aggregates.
    return this._j._aptitude._aggregates;
  }

  /**
   * Rebuilds the aggregates cache for the current actor.
   */
  rebuildAggregatesForActor()
  {
    // compute new aggregates from the actor.
    const next = this.actor()
      .getAptitudeSkillAggregates();

    // replace the cache.
    this._j._aptitude._aggregates = next;
  }

  /**
   * Gets the aptitude sources for the current actor.
   * @returns {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]}
   */
  sources()
  {
    return this._j._aptitude._sources;
  }

  /**
   * Sets the aptitude sources for the current actor.
   * @param {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]} sources The new sources.
   */
  setSources(sources)
  {
    this._j._aptitude._sources = sources;
  }

  /**
   * Rebuilds the sources cache for the current actor.
   */
  rebuildSourcesForActor()
  {
    // compute new sources from the actor.
    const next = this.actor()
      .getAptitudeSources();

    // replace the cache.
    this._j._aptitude._sources = next;
  }

  /**
   * Gets the current view mode for the aptitude windows.
   * Should be one of {@link Scene_Aptitude.viewMode}.
   * @returns {string}
   */
  viewMode()
  {
    return this._j._aptitude._viewMode;
  }

  /**
   * Sets the current view mode to the aggregate view.
   */
  setViewModeToAggregate()
  {
    this._j._aptitude._viewMode = Scene_Aptitude.viewMode.AGGREGATE;

    this.aptitudeRibbonWindow()
      .setToggleHintTarget('the sources');
  }

  /**
   * Sets the current view mode to the source view.
   */
  setViewModeToSource()
  {
    this._j._aptitude._viewMode = Scene_Aptitude.viewMode.SOURCE;

    this.aptitudeRibbonWindow()
      .setToggleHintTarget('your skills');
  }

  /**
   * Gets the current active list window for the view mode.
   * @returns {Window_AptitudeAggregateList|Window_AptitudeSourceList|null} - The active list window.
   */
  currentListWindow()
  {
    // return the list window based on the current view mode.
    if (this.viewMode() === Scene_Aptitude.viewMode.AGGREGATE)
    {
      return this.aptitudeAggregateListWindow();
    }
    else if (this.viewMode() === Scene_Aptitude.viewMode.SOURCE)
    {
      return this.aptitudeSourceListWindow();
    }

    return null;
  }

  /**
   * Gets the currently inactive list window for the view mode.
   * @returns {Window_AptitudeAggregateList|Window_AptitudeSourceList|null} - The inactive list window.
   */
  inactiveListWindow()
  {
    // return the opposite list window based on the current view mode.
    if (this.viewMode() === Scene_Aptitude.viewMode.AGGREGATE)
    {
      return this.aptitudeSourceListWindow();
    }
    else if (this.viewMode() === Scene_Aptitude.viewMode.SOURCE)
    {
      return this.aptitudeAggregateListWindow();
    }

    return null;
  }

  /**
   * Gets the current active details window for the view mode.
   * @returns {Window_AptitudeAggregateDetails|Window_AptitudeSourceDetails|null} - The active details window.
   */
  currentDetailsWindow()
  {
    // return the details window based on the current view mode.
    if (this.viewMode() === Scene_Aptitude.viewMode.AGGREGATE)
    {
      return this.aptitudeAggregateDetailsWindow();
    }
    else if (this.viewMode() === Scene_Aptitude.viewMode.SOURCE)
    {
      return this.aptitudeSourceDetailsWindow();
    }

    return null;
  }

  //endregion accessors

  //region create
  /**
   * Initialize all resources required for this scene.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create the various display objects on the screen.
    this.createDisplayObjects();
  }

  /**
   * Creates the display objects for this scene.
   */
  createDisplayObjects()
  {
    // create all our windows.
    this.createAllWindows();
  }

  /**
   * Creates all windows for this scene.
   */
  createAllWindows()
  {
    // rebuild aggregates once for the initial actor.
    this.rebuildAggregatesForActor();

    // rebuild sources once for the initial actor.
    this.rebuildSourcesForActor();

    // create the ribbon window.
    this.createAptitudeRibbonWindow();

    // create the list window for aptitudes aggregations.
    this.createAptitudeAggregateListWindow();

    // create the list window for aptitudes sources.
    this.createAptitudeSourceListWindow();

    // create the details window that responds to aggregate selection.
    this.createAptitudeAggregateDetailsWindow();

    // create the details window that responds to source selection.
    this.createAptitudeSourceDetailsWindow();
  }

  //region ribbon
  /**
   * Creates the aptitude ribbon window.
   */
  createAptitudeRibbonWindow()
  {
    // define the rectangle.
    const rect = this.aptitudeRibbonRect();

    // build the window.
    const win = new Window_AptitudeRibbon(rect);

    // initialize the actor.
    win.setActor(this.actor());

    // assign the view mode for the toggle hint.
    win.setToggleHintTarget('the sources');

    // assign the window.
    this._j._aptitude._windows._ribbon = win;

    // add the window to the scene.
    this.addWindow(win);
  }

  /**
   * Gets the rectangle for the aptitude ribbon window.
   * @returns {Rectangle}
   */
  aptitudeRibbonRect()
  {
    // compute the centered container width (~66% of the screen width).
    const containerW = Math.floor(Graphics.boxWidth * this.containerWidthPercent());

    // compute the x offset to center the container.
    const containerX = Math.floor((Graphics.boxWidth - containerW) / 2);

    // place the ribbon at the top of the container.
    const x = containerX;
    const y = 0;

    // keep ribbon width proportional to list column (25% of container width).
    const w = Math.floor(containerW * 0.25);

    // keep the same visual height used previously for ribbon rows.
    const height = (36 * 3);

    // return the rectangle for the ribbon window.
    return new Rectangle(x, y, w, height);
  }

  /**
   * Gets the aptitude ribbon window.
   * @returns {Window_AptitudeRibbon|null}
   */
  aptitudeRibbonWindow()
  {
    return this._j._aptitude._windows._ribbon;
  }

  //endregion ribbon

  //region aggregate list
  /**
   * Creates the aptitude aggregate list window.
   */
  createAptitudeAggregateListWindow()
  {
    // build the rectangle for the list window.
    const rect = this.aptitudeAggregateListWindowRect();

    // create the list window instance.
    const win = new Window_AptitudeAggregateList(rect);

    // set the actor for the list.
    win.setActor(this.actor());

    // provide the prebuilt aggregates.
    win.setAggregates(this.aggregates());

    // wire basic handlers.
    win.setHandler('ok', this.onListOk.bind(this));
    win.setHandler('cancel', this.popScene.bind(this));
    win.setHandler('more', this.toggleViewMode.bind(this));

    // also wire page navigation keys (Q/W or shoulder buttons).
    win.setHandler('pageup', this.onCycleActorLeft.bind(this));
    win.setHandler('pagedown', this.onCycleActorRight.bind(this));

    // store and add to the scene.
    this._j._aptitude._windows._aggregateList = win;
    this.addWindow(win);
  }

  /**
   * Builds the rectangle for the aptitude aggregate list window.
   * @returns {Rectangle}
   */
  aptitudeAggregateListWindowRect()
  {
    // compute the centered container width (~66% of the screen width).
    const containerW = Math.floor(Graphics.boxWidth * this.containerWidthPercent());

    // compute the x offset to center the container.
    const containerX = Math.floor((Graphics.boxWidth - containerW) / 2);

    // grab some data from the ribbon window.
    const {
      y: ribbonY,
      height: ribbonHeight
    } = this.aptitudeRibbonRect();

    // compute the top of the list to sit directly under the ribbon.
    const wy = ribbonY + ribbonHeight;

    // use the main area height for window height.
    const wh = Graphics.boxHeight - ribbonHeight;

    // keep the list width at 25% of the container width.
    const listW = Math.floor(containerW * 0.25);

    // return the rectangle for the list on the left of the container.
    return new Rectangle(containerX, wy, listW, wh);
  }

  /**
   * Gets the aptitude aggregate list window.
   * @returns {Window_AptitudeAggregateList|null}
   */
  aptitudeAggregateListWindow()
  {
    // return the list window or null.
    return this._j._aptitude._windows._aggregateList;
  }

  //endregion aggregate list

  //region source list
  /**
   * Creates the aptitude source list window.
   */
  createAptitudeSourceListWindow()
  {
    // build the rectangle for the list window.
    const rect = this.aptitudeSourceListWindowRect();

    // create the list window instance.
    const win = new Window_AptitudeSourceList(rect);

    // set the actor for the list.
    win.setActor(this.actor());

    // provide the prebuilt sources.
    win.setSources(this.sources());

    // wire basic handlers.
    win.setHandler('ok', this.onListOk.bind(this));
    win.setHandler('cancel', this.popScene.bind(this));
    win.setHandler('more', this.toggleViewMode.bind(this));

    // also wire page navigation keys (Q/W or shoulder buttons).
    win.setHandler('pageup', this.onCycleActorLeft.bind(this));
    win.setHandler('pagedown', this.onCycleActorRight.bind(this));

    // hide this window initially.
    win.hide();
    win.deactivate();

    // store and add to the scene.
    this._j._aptitude._windows._sourceList = win;
    this.addWindow(win);
  }

  /**
   * Builds the rectangle for the aptitude source list window.
   * @returns {Rectangle}
   */
  aptitudeSourceListWindowRect()
  {
    return this.aptitudeAggregateListWindowRect();
  }

  /**
   * Gets the aptitude source list window.
   * @returns {Window_AptitudeSourceList|null}
   */
  aptitudeSourceListWindow()
  {
    return this._j._aptitude._windows._sourceList;
  }

  //endregion source list

  //region aggregate details
  /**
   * Creates the aptitude aggregate details window.
   */
  createAptitudeAggregateDetailsWindow()
  {
    // build the rectangle for the details window.
    const rect = this.aptitudeAggregateDetailsWindowRect();

    // create the details window instance.
    const win = new Window_AptitudeAggregateDetails(rect);

    // set the actor for the details window.
    win.setActor(this.actor());

    // store and add to the scene.
    this._j._aptitude._windows._aggregateDetails = win;
    this.addWindow(win);
  }

  /**
   * Builds the rectangle for the aptitude aggregate details window.
   * @returns {Rectangle}
   */
  aptitudeAggregateDetailsWindowRect()
  {
    // compute the centered container width (~66% of the screen width).
    const containerW = Math.floor(Graphics.boxWidth * this.containerWidthPercent());

    // compute the x offset to center the container.
    const containerX = Math.floor((Graphics.boxWidth - containerW) / 2);

    // use the same main area vertical bounds.
    const wy = this.mainAreaTop();
    const wh = Graphics.boxHeight;

    // split container 25/75 between list and details (same proportions as before).
    const listW = Math.floor(containerW * 0.25);
    const detailsW = containerW - listW;

    // place details immediately to the right of the list.
    const dx = containerX + listW;

    // return the rectangle for the details window.
    return new Rectangle(dx, wy, detailsW, wh);
  }

  /**
   * Gets the aptitude aggregate details window.
   * @returns {Window_AptitudeAggregateDetails|null}
   */
  aptitudeAggregateDetailsWindow()
  {
    // return the details window or null.
    return this._j._aptitude._windows._aggregateDetails;
  }

  //endregion aggregate details

  //region source details
  /**
   * Creates the aptitude source details window.
   */
  createAptitudeSourceDetailsWindow()
  {
    // build the rectangle for the details window.
    const rect = this.aptitudeSourceDetailsWindowRect();

    // create the details window instance.
    const win = new Window_AptitudeSourceDetails(rect);

    // set the actor for the details window.
    win.setActor(this.actor());

    // hide this window initially.
    win.hide();

    // store and add to the scene.
    this._j._aptitude._windows._sourceDetails = win;
    this.addWindow(win);
  }

  /**
   * Builds the rectangle for the aptitude source details window.
   * @returns {Rectangle}
   */
  aptitudeSourceDetailsWindowRect()
  {
    return this.aptitudeAggregateDetailsWindowRect();
  }

  /**
   * Gets the aptitude source details window.
   * @returns {Window_AptitudeSourceDetails|null}
   */
  aptitudeSourceDetailsWindow()
  {
    return this._j._aptitude._windows._sourceDetails;
  }

  //endregion source details

  containerWidthPercent()
  {
    return 0.90;
  }

  containerHeightPercent()
  {
    return 0.80;
  }

  //endregion create

  //region update
  /**
   * Extends {@link #update}.<br/>
   * Also updates the details window when the list selection changes.
   */
  update()
  {
    // grab the previous view mode.
    const previousViewMode = this.viewMode();

    // perform original logic.
    super.update();

    // if the list is not present, do nothing.
    const list = this.aptitudeAggregateListWindow();
    if (!list) return;

    // manage the details content based on whether or not the list index changed.
    this.updateDetails();

    // manage visibility based on view mode.
    this.updateVisibility(previousViewMode);
  }

  /**
   * Updates the aptitude details window based on the current list selection.
   */
  updateDetails()
  {
    switch (this.viewMode())
    {
      case Scene_Aptitude.viewMode.AGGREGATE:
      {
        const previousIndex = this.lastAggregateIndex();
        this.updateAggregateDetails(previousIndex);
        break;
      }
      case Scene_Aptitude.viewMode.SOURCE:
      {
        const previousIndex = this.lastSourceIndex();
        this.updateSourceDetails(previousIndex);
        break;
      }
    }
  }

  /**
   * Updates the aptitude aggregate details window.
   * @param {number} previousIndex The previous index of the list.
   */
  updateAggregateDetails(previousIndex)
  {
    // grab the list window.
    const listWindow = this.aptitudeAggregateListWindow();

    // if the index has not changed, do nothing.
    if (previousIndex === listWindow.index()) return;

    // acquire the selected entry if available.
    const aggregate = listWindow.currentExt();

    // update the details window context.
    const details = this.aptitudeAggregateDetailsWindow();

    // update both actor and entry for completeness.
    details.setActor(this.actor());
    details.setAggregate(aggregate);

    // update our tracker.
    this.setLastAggregateIndex(listWindow.index());
  }

  /**
   * Updates the aptitude source details window.
   * @param {number} previousIndex The previous index of the list.
   */
  updateSourceDetails(previousIndex)
  {
    // grab the list window.
    const listWindow = this.aptitudeSourceListWindow();

    // if the index has not changed, do nothing.
    if (previousIndex === listWindow.index()) return;

    // grab the source from the list window.
    const source = listWindow.currentExt();

    // update the details window context.
    const details = this.aptitudeSourceDetailsWindow();
    details.setActor(this.actor());
    details.setSource(source);

    // update our tracker.
    this.setLastSourceIndex(listWindow.index());
  }

  /**
   * Updates the visibility of the aptitude windows based on the current view mode.
   * @param {string} previousViewMode The previous view mode.
   */
  updateVisibility(previousViewMode)
  {
    // grab the current view mode.
    const currentViewMode = this.viewMode();

    // if the view mode hasn't changed, do nothing.
    if (currentViewMode === previousViewMode) return;

    // pivot on the current view mode to display the appropriate windows.
    switch (currentViewMode)
    {
      case Scene_Aptitude.viewMode.AGGREGATE:
        this.hideSourceWindows();
        this.showAggregateWindows();
        break;
      case Scene_Aptitude.viewMode.SOURCE:
        this.hideAggregateWindows();
        this.showSourceWindows();
        break;
    }
  }

  /**
   * Shows the aptitude aggregate windows.
   * Also refreshes the list and details windows with the current actor.
   */
  showAggregateWindows()
  {
    const list = this.aptitudeAggregateListWindow();
    const details = this.aptitudeAggregateDetailsWindow();

    this.rebuildAggregatesForActor();

    list.show();
    list.setActor(this.actor());
    list.setAggregates(this.aggregates());
    list.select(this.lastAggregateIndex());
    list.activate();

    details.show();
    details.setActor(this.actor());
    list.currentExt()
      ? details.setAggregate(list.currentExt())
      : details.setAggregate(null);
  }

  /**
   * Hides the aptitude aggregate windows.
   */
  hideAggregateWindows()
  {
    const list = this.aptitudeAggregateListWindow();
    const details = this.aptitudeAggregateDetailsWindow();

    list.hide();
    list.deactivate();
    details.hide();
  }

  /**
   * Shows the aptitude source windows.
   * Also refreshes the list and details windows with the current actor.
   */
  showSourceWindows()
  {
    const list = this.aptitudeSourceListWindow();
    const details = this.aptitudeSourceDetailsWindow();

    list.show();
    list.setActor(this.actor());
    list.setSources(this.sources());
    list.select(this.lastSourceIndex());
    list.activate();

    details.show();
    details.setActor(this.actor());
    list.currentExt()
      ? details.setSource(list.currentExt())
      : details.setSource(null);
  }

  /**
   * Hides the aptitude source windows.
   */
  hideSourceWindows()
  {
    const list = this.aptitudeSourceListWindow();
    const details = this.aptitudeSourceDetailsWindow();

    list.hide();
    list.deactivate();
    details.hide();
  }

  //endregion update

  //region actions
  /**
   * Cycles to the previous actor.
   */
  onCycleActorLeft()
  {
    // move to the previous actor.
    this.previousActor();
  }

  /**
   * Cycles to the next actor.
   */
  onCycleActorRight()
  {
    // move to the next actor.
    this.nextActor();
  }

  /**
   * Handles the "more" action- aka the shift key/square button from the either list.
   */
  toggleViewMode()
  {
    switch (this.viewMode())
    {
      case Scene_Aptitude.viewMode.AGGREGATE:
        this.setViewModeToSource();
        break;
      case Scene_Aptitude.viewMode.SOURCE:
        this.setViewModeToAggregate();
        break;
      default:
        throw new Error(`Invalid view mode: ${this.viewMode()}`);
    }
  }

  /**
   * Extends {@link #onActorChange}.<br/>
   * Also refreshes the aptitude windows when the actor changes.
   */
  onActorChange()
  {
    // perform original logic.
    super.onActorChange();

    // rebuild the cached aggregates for the new actor.
    this.rebuildAggregatesForActor();

    // rebuild the cached sources for the new actor.
    this.rebuildSourcesForActor();

    // get the updated actor reference.
    const updatedActor = this.actor();

    // rebind all windows to the new actor (ribbon, lists, details).
    this.rebindAllWindowsToActor(updatedActor);

    // refresh the list contents for the new actor (aggregates/sources).
    this.refreshListsForActor();

    // reset the per-view selection trackers back to the first index.
    this.resetSelectionTrackers();

    // choose the remembered index for the active view.
    const startIndex = this.viewMode() === Scene_Aptitude.viewMode.AGGREGATE
      ? this.lastAggregateIndex()
      : this.lastSourceIndex();

    // select and activate the current view, and push selection into details.
    this.refreshSelectionForCurrentView(startIndex);
  }

  /**
   * Rebinds all scene windows to the provided actor.
   * @param {Game_Actor} actor - The actor to bind to all windows.
   */
  rebindAllWindowsToActor(actor)
  {
    // update the ribbon window with the new actor.
    this.aptitudeRibbonWindow()
      .setActor(actor);

    // update both list windows with the new actor.
    this.aptitudeAggregateListWindow()
      .setActor(actor);
    this.aptitudeSourceListWindow()
      .setActor(actor);

    // update both details windows with the new actor.
    this.aptitudeAggregateDetailsWindow()
      .setActor(actor);
    this.aptitudeSourceDetailsWindow()
      .setActor(actor);
  }

  /**
   * Refreshes the list contents for the currently bound actor.
   * This pulls from the scene’s cached aggregates and sources.
   */
  refreshListsForActor()
  {
    // refresh the aggregate list with the current aggregates cache.
    this.aptitudeAggregateListWindow()
      .setAggregates(this.aggregates());

    // refresh the source list with the current sources cache.
    this.aptitudeSourceListWindow()
      .setSources(this.sources());
  }

  /**
   * Selects and activates the current list view and updates its details.
   * @param {number} startIndex - The index to select in the active list.
   */
  refreshSelectionForCurrentView(startIndex)
  {
    // grab the active and inactive list windows.
    const activeList = this.currentListWindow();
    const inactiveList = this.inactiveListWindow();

    // select the desired index on the active list.
    activeList.select(startIndex);

    // activate the active list to accept input.
    activeList.activate();

    // deactivate the other list to avoid input conflicts.
    inactiveList.deactivate();

    // push the active list’s current selection into the correct details window.
    this.setDetailsFromCurrentSelection();
  }

  /**
   * Applies the active list selection to the corresponding details window.
   */
  setDetailsFromCurrentSelection()
  {
    // check what view we are currently in.
    switch (this.viewMode())
    {
      case Scene_Aptitude.viewMode.AGGREGATE:
      {
        // grab the aggregate list/details windows.
        const list = this.aptitudeAggregateListWindow();
        const details = this.aptitudeAggregateDetailsWindow();

        // update the details window with the selected aggregate or null.
        const selected = list.currentExt();
        if (selected)
        {
          details.setAggregate(selected);
        }
        else
        {
          details.setAggregate(null);
        }
        break;
      }
      case Scene_Aptitude.viewMode.SOURCE:
      {
        // grab the source list/details windows.
        const list = this.aptitudeSourceListWindow();
        const details = this.aptitudeSourceDetailsWindow();

        // update the details window with the selected source or null.
        const selected = list.currentExt();
        if (selected)
        {
          details.setSource(selected);
        }
        else
        {
          details.setSource(null);
        }
        break;
      }
      default:
      {
        // an invalid view mode was encountered.
        throw new Error(`Invalid view mode: ${this.viewMode()}`);
      }
    }
  }

  /**
   * Handles the OK action from the aptitude list.
   * (Reserved for future behaviors; currently a no‑op.)
   */
  onListOk()
  {
    // no special OK behavior in v1; just play a sound.
    SoundManager.playOk();

    // reselect the list to ensure it remains active.
    this.aptitudeAggregateListWindow()
      .activate();
  }

  //endregion actions

}

//endregion Scene_Aptitude

//region Scene_Menu (APT)
/**
 * Extends {@link #createCommandWindow}.</br>
 * Adds a handler for the Aptitude menu command.
 */
J.APT.Aliased.Scene_Menu.set('createCommandWindow', Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function()
{
  // perform original logic.
  J.APT.Aliased.Scene_Menu.get('createCommandWindow')
    .call(this);

  // set the handler for our custom command.
  this._commandWindow.setHandler('aptitude', this.commandAptitude.bind(this));
};

/**
 * Opens the Aptitude scene.
 */
Scene_Menu.prototype.commandAptitude = function()
{
  // push the new scene onto the stack.
  Scene_Aptitude.callScene();
};
//endregion Scene_Menu (APT)

//region Window_AptitudeDetails
/**
 * The window containing the details of an aptitude skill aggregate.
 */
class Window_AptitudeAggregateDetails
  extends Window_Base
{
  //region properties
  /**
   * The actor bound to this window.
   * @type {Game_Actor|null}
   */
  _actor = null;

  /**
   * The selected entry for display.
   * @type {AptitudeSkillAggregate|null}
   */
  _aggregate = null;

  /**
   * The y position of the next block to draw.
   * @type {number}
   */
  _nextY = 0;

  //endregion properties

  // region init
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle to draw the window in.
   */
  constructor(rect)
  {
    // call parent ctor.
    super(rect);

    // initialize members.
    this.initMembers();

    // draw initial contents.
    this.refresh();
  }

  /**
   * Initializes the members of this window.
   */
  initMembers()
  {
    // initialize the actor.
    this._actor = null;

    // initialize the aggregate.
    this._aggregate = null;

    // initialize the next y position.
    this._nextY = 0;
  }

  //endregion init

  //region accessors
  /**
   * The actor bound to this window.
   * @returns {Game_Actor|null}
   */
  actor()
  {
    return this._actor;
  }

  /**
   * Sets the actor for this window.
   * @param {Game_Actor} actor The actor to bind.
   */
  setActor(actor)
  {
    // do nothing if the actor is unchanged.
    if (this.actor() === actor) return;

    // update the actor.
    this._actor = actor;

    // refresh the contents for the new actor.
    this.refresh();
  }

  /**
   * The selected aggregate for display.
   * @returns {AptitudeSkillAggregate|null}
   */
  aggregate()
  {
    return this._aggregate;
  }

  /**
   * Sets the selected aggregate for display.
   * @param {AptitudeSkillAggregate|null} aggregate The selected aggregate or null to clear.
   */
  setAggregate(aggregate)
  {
    // do nothing if unchanged.
    if (this.aggregate() === aggregate) return;

    // update the entry.
    this._aggregate = aggregate;

    // refresh the contents for the new aggregate.
    this.refresh();
  }

  /**
   * The y position of the next block to draw.
   * @returns {number}
   */
  nextY()
  {
    return this._nextY || 0;
  }

  /**
   * Sets the next y position for drawing.
   * @param {number} y The y position to set.
   */
  setNextY(y)
  {
    this._nextY = y;
  }

  //endregion accessors

  //region draw
  /**
   * Implements {@link #drawContent}.<br/>
   * Draws the details for the selected aggregate.
   */
  drawContent()
  {
    // if we do not have an entry or actor to work with, show a friendly hint.
    if (!this.aggregate() || !this.actor())
    {
      // render a default hint.
      this.resetTextColor();
      this.drawText('Select a skill from the list.', 0, 0, this.contentsWidth());
      return;
    }

    // reset the next y position.
    this.setNextY(0);

    // draw the header.
    this.drawHeader();

    // draw the per‑source breakdown table.
    this.drawSources();
  }

  /**
   * Draws the header containing the icon+name and learned badge.
   */
  drawHeader()
  {
    // grab the aggregate data.
    const aggregate = this.aggregate();

    // derive the skill data for icon+name.
    const skill = this.actor()
      .skill(aggregate.skillId());

    // y anchor for the header.
    let y = this.nextY();

    // draw the icon if present.
    if (skill.iconIndex > 0)
    {
      // draw the icon at the far left.
      this.drawIcon(skill.iconIndex, 0, y);
    }

    // compute a left indent if we drew an icon.
    const left = (skill.iconIndex > 0)
      ? 36
      : 0;

    // draw the name.
    this.changeTextColor(this.systemColor());
    this.drawText(`${skill.name}`, left, y, this.contentsWidth() - left);

    // if learned, render a badge at the right.
    if (aggregate.learnedAny() === true)
    {
      // draw learned badge.
      this.resetTextColor();
      this.drawText('[LEARNED]', 0, y, this.contentsWidth(), 'right');
    }

    // advance y.
    y += this.lineHeight();

    // draw the description.
    this.changeTextColor(ColorManager.normalColor());
    const wrappedText = this.modFontSizeForText(-4, skill.description);
    this.drawTextEx(wrappedText, 0, y, this.contentsWidth());

    // add some spacing below the description.
    y += this.lineHeight() * 2;

    // set the next block anchor.
    this.setNextY(y);
  }

  /**
   * Draws the sources for the selected entry.
   */
  drawSources()
  {
    // grab the aggregate data.
    const aggregate = this.aggregate();

    // establish a y anchor somewhat below the gauges.
    const baseY = this.nextY() + this.lineHeight();

    // header label for the section.
    this.changeTextColor(this.systemColor());
    this.drawTextEx('\\I[86]\\C[16]Sources\\C[0]', 0, baseY, this.contentsWidth());

    // compute the starting y for rows.
    const updatedY = baseY + this.lineHeight();
    this.setNextY(updatedY);

    // iterate and draw each source row.
    aggregate.sources()
      .forEach(this.drawSource, this);
  }

  /**
   * Draws a single source row.
   * @param {AptitudeSkillSourceProgress} sourceProgress - The per-source progress to draw for this skill.
   */
  drawSource(sourceProgress)
  {
    // capture the current y position for this row.
    const y = this.nextY();

    // calculate the left column width for the icon+label.
    const leftW = Math.floor(this.contentsWidth() * 0.60);

    // resolve the database object for the display (icon/name) using the key.
    const databaseSource = ApManager.resolveStaticSourceByKey(sourceProgress.sourceKey());

    // don't render none-sourced rows.
    if (!databaseSource) return;

    // determine whether this source is currently active on the actor.
    const isActive = ApManager.isSourceActive(this.actor(), sourceProgress.sourceKey());

    // extract the icon index from the database object if available.
    let { iconIndex } = databaseSource;

    // actors don't normally have an icon index, so lets give em one.
    if (databaseSource.isActor())
    {
      iconIndex = 2727;
    }
    // classes also don't normally have an icon index, so lets give em one.
    else if (databaseSource.isClass())
    {
      iconIndex = 2694;
    }

    // extract the label from the database object if available, else fallback to the raw key.
    let { name } = databaseSource;
    let activityColorIndex = 0;

    if (isActive === false)
    {
      activityColorIndex = 7;
      name += ' (inactive)';
    }

    // draw the icon + label on the left side of the row.
    this.drawTextEx(`\\C[${activityColorIndex}]\\I[${iconIndex}]${name}\\C[0]`, 0, y, leftW);

    // determine learned state for this specific source.
    const learned = sourceProgress.learned() === true;

    // determine if the actor already knows the skill via some other source.
    const knownElsewhere = learned === false &&
      sourceProgress.currentAp() < sourceProgress.requiredAp() &&
      this.actor()
        .hasSkill(sourceProgress.skillId());

    // decide the right-side text content.
    let rightText = '';
    if (learned === true)
    {
      // if learned from this source, show DONE.
      rightText = 'DONE';
    }
    else if (knownElsewhere === true)
    {
      // if not learned from this source but the actor already knows the skill, show KNOWN.
      rightText = 'KNOWN';
    }
    else
    {
      // otherwise, show the current/required AP counts.
      rightText = `${sourceProgress.currentAp()}/${sourceProgress.requiredAp()}`;
    }

    // decide the right-side color index.
    let rightColor = 7; // gray by default
    if (learned === true)
    {
      // green when learned.
      rightColor = 11;
    }
    else if (sourceProgress.currentAp() > 0)
    {
      // yellow when in-progress.
      rightColor = isActive
        ? 6
        : 7;
    }

    // apply the right-side color and draw the right-aligned status text.
    this.changeTextColor(ColorManager.textColor(rightColor));
    const rightW = this.contentsWidth() - leftW;
    this.drawText(rightText, 0, y, rightW, Window_Base.TextAlignments.Right);

    // Only draw a gauge if the skill is neither DONE nor KNOWN.
    const shouldDrawGauge = learned === false && knownElsewhere === false;
    if (shouldDrawGauge === true)
    {
      // compute the gauge rectangle centered vertically within the row.
      const gaugeX = Math.floor(this.contentsWidth() * 0.40);
      const gaugeY = y + Math.round(this.lineHeight() / 2) - Math.round(this.gaugeHeight() / 2);
      const rect = new Rectangle(gaugeX, gaugeY, this.gaugeWidth(), this.gaugeHeight());

      // compute the rate between 0..1 for the gauge.
      const progressRate = Math.max(0, Math.min(sourceProgress.currentAp() / sourceProgress.requiredAp(), 1));

      // build the gauge options with a dynamic segment count and colors.
      const leftGaugeColor = isActive
        ? this.gaugeColor1()
        : this.inactiveColor1();
      const rightGaugeColor = isActive
        ? this.gaugeColor2()
        : this.inactiveColor2();
      const segOpts = WindowGaugeOptions.Builder()
        .gaugeType(Window_Base.GAUGE_TYPES.Segmented)
        .segments(Math.max(1, Math.ceil(sourceProgress.requiredAp() / this.segmentValue())))
        .gap(2)
        .leftGradientColor(leftGaugeColor)
        .rightGradientColor(rightGaugeColor)
        .build();

      // draw the segmented gauge.
      this.drawGauge(rect, progressRate, segOpts);
    }

    // advance to the next row position.
    this.setNextY(y + this.lineHeight());
  }

  //endregion draw

  //region helpers
  /**
   * The width of the gauges in this window.
   * @returns {number}
   */
  gaugeWidth()
  {
    return 256;
  }

  /**
   * The height of the gauges in this window.
   * @returns {number}
   */
  gaugeHeight()
  {
    return 12;
  }

  /**
   * The back color of the gauges in this window.
   * @returns {string}
   */
  gaugeBackColor()
  {
    return 'rgba(255, 255, 255, 0.1)';
  }

  /**
   * The color to gradient from.
   * Defaults to blue.
   * @returns {string}
   */
  gaugeColor1()
  {
    return 'rgba(179, 89, 0, 1)';
  }

  /**
   * The color to gradient into.
   * Defaults to green.
   * @returns {string}
   */
  gaugeColor2()
  {
    return 'rgba(255, 166, 77, 1)';
  }

  inactiveColor1()
  {
    return 'rgba(77, 77, 77, 1)';
  }

  inactiveColor2()
  {
    return 'rgba(153, 153, 153, 1)';
  }

  /**
   * The amount that one segment represents.
   * @returns {number}
   */
  segmentValue()
  {
    return 10;
  }

  //endregion helpers
}

//endregion Window_AptitudeDetails

//region Window_AptitudeList
/**
 * The window containing the list of aptitude skill aggregations for an actor.
 */
class Window_AptitudeAggregateList
  extends Window_Command
{
  //region properties
  /**
   * The actor bound to this window.
   * @type {Game_Actor|null}
   */
  _actor = null;

  /**
   * The list of aggregates bound to this window.
   * @type {AptitudeSkillAggregate[]}
   */
  _aggregates = [];

  //endregion properties

  //region init
  constructor(rect)
  {
    // call parent ctor.
    super(rect);

    // initialize members.
    this.initMembers();
  }

  /**
   * Initializes the members of this window.
   */
  initMembers()
  {
    // initialize members.
    this._actor = null;

    // initialize the aggregates bucket.
    this._aggregates = [];
  }

  //endregion init

  //region accessors
  /**
   * Gets the actor that is bound to this window.
   * @returns {Game_Actor|null}
   */
  actor()
  {
    return this._actor;
  }

  /**
   * Sets the actor for this window.
   * @param {Game_Actor} actor The actor to bind.
   */
  setActor(actor)
  {
    // do nothing if the actor is unchanged.
    if (this._actor === actor) return;

    // update the actor reference.
    this._actor = actor;

    // rebuild the command list.
    // TODO: update this to be handled from the scene.
    this.refresh();
  }

  /**
   * Get the list of aggregates that are bound to this window.
   * @returns {AptitudeSkillAggregate[]}
   */
  aggregates()
  {
    return this._aggregates || [];
  }

  /**
   * Sets the prebuilt aggregates for rendering.
   * @param {AptitudeSkillAggregate[]} aggregates The list of aggregates to render.
   */
  setAggregates(aggregates)
  {
    // assign and refresh.
    this._aggregates = aggregates || [];

    // rebuild command list.
    this.refresh();
  }

  //endregion accessors

  //region commands
  /**
   * Rebuilds the command list for the current actor.
   */
  makeCommandList()
  {
    // if we don’t have an actor, there is nothing to build.
    if (this.actor() === null) return;

    // build all commands for this window.
    const commands = this.buildCommands();

    // add all built commands to this window.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // grab all the aggregates to build commands for.
    const aggregates = this.aggregates();

    // if no aggregates, nothing to render.
    if (aggregates.length === 0) return [];

    // build each command based on the aggregate.
    const commands = aggregates.map(this.buildCommand, this);

    // return the built command set.
    return commands;
  }

  /**
   * Builds a single command for the given aggregate.
   * @param {AptitudeSkillAggregate} aggregate The aggregate to build a command for.
   * @returns {BuiltWindowCommand}
   */
  buildCommand(aggregate)
  {
    // compute right text.
    const learned = aggregate.learnedAny();
    const rightText = learned === true
      ? 'DONE'
      : `${aggregate.currentAp()}/${aggregate.requiredAp()}`;

    // compute right color index.
    let rightColor = 7; // gray default
    if (learned === true)
    {
      rightColor = 11; // green learned
    }
    else if (aggregate.currentAp() > 0)
    {
      rightColor = 6; // yellow in‑progress
    }

    // build the command for this skill.
    const builtWindowCommand = new WindowCommandBuilder(aggregate.name())
      .setSymbol(`skill:${aggregate.skillId()}`)
      .setExtensionData(aggregate)
      .setIconIndex(aggregate.iconIndex())
      .setRightText(rightText)
      .setRightColorIndex(rightColor)
      .setEnabled(learned === false)
      .build();

    // add to list.
    return builtWindowCommand;
  }

  //endregion commands
}

//endregion Window_AptitudeList

//region Window_AptitudeRibbon
/**
 * The ribbon window for the Aptitude scene.
 */
class Window_AptitudeRibbon
  extends Window_ActorRibbon
{
  //region properties
  /**
   * The target to show a hint for when the view is toggled.
   * @type {string}
   */
  _toggleHintTarget = String.empty;

  //endregion properties

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle to draw the ribbon in.
   */
  constructor(rect)
  {
    super(rect);
  }

  //region accessors
  /**
   * Gets the target to show a hint for when the view is toggled.
   * @returns {string}
   */
  toggleHintTarget()
  {
    return this._toggleHintTarget;
  }

  /**
   * Sets the target to show a hint for when the view is toggled.
   * @param {string} target The target to show a hint for.
   */
  setToggleHintTarget(target)
  {
    // store the target.
    this._toggleHintTarget = target;

    // also refresh the contents.
    this.refresh();
  }

  //endregion accessors

  /**
   * Extends {@link #initMembers}.<br/>
   * Adds the toggle hint target.
   */
  initMembers()
  {
    // initialize the original members.
    super.initMembers();

    // initialize our own members.
    this._toggleHintTarget = String.empty;
  }

  //region draw
  /**
   * Draws the actor face in the ribbon.
   */
  drawActorRibbon()
  {
    // perform original logic.
    super.drawActorRibbon();

    // also draw the actor's name.
    this.drawActorName();

    // also draw the view-toggle hint if we have a target.
    this.drawHint();
  }

  /**
   * Draws the actor's name.
   */
  drawActorName()
  {
    // grab the actor.
    const actor = this.actor();

    // grab the coordinates of the face.
    const [ x, y ] = this.faceCoordinates();

    // grab the size of the face.
    const [ w ] = this.faceSize();

    // identify the name of the actor.
    const name = actor.name();

    // calculate the position.
    const nameX = x + w + 16;
    const nameWidth = this.contents.measureTextWidth(name);

    // draw the name.
    this.drawText(name, nameX, y, nameWidth);
  }

  /**
   * Draws the hint for the current view.
   */
  drawHint()
  {
    // also draw the view-toggle hint if we have a target.
    const target = this.toggleHintTarget();

    // build the hint string using your icon indices.
    const hint = `\\I[2450]/\\I[2434]: see ${target}.`;

    // compute the width available to the right of the face.
    const textW = this.contents.measureTextWidth(hint);

    // grab the coordinates and size of the face to anchor our text.
    const [ x, y ] = this.faceCoordinates();
    const [ w, h ] = this.faceSize();

    // compute the starting x for text to the right of the face.
    const textX = x + 64;

    // compute the y such that it sits beneath the name, inside the ribbon.
    const textY = y + h;

    // draw the hint using textEx so icons render correctly.
    this.drawTextEx(hint, textX, textY, textW);
  }

  //endregion draw
}

//endregion Window_AptitudeRibbon

//region Window_AptitudeSourceDetails
/**
 * A window displaying details about a specific aptitude source.
 */
class Window_AptitudeSourceDetails
  extends Window_Base
{
  //region properties
  /**
   * The actor bound to this window.
   * @type {Game_Actor|null}
   */
  _actor = null;

  /**
   * The source bound to this window.
   * @type {RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State|null}
   */
  _source = null;

  /**
   * The y position of the next block to draw.
   * @type {number}
   */
  _nextY = 0;

  //endregion properties

  //region init
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle to draw the window in.
   */
  constructor(rect)
  {
    // call parent ctor.
    super(rect);

    // initialize members.
    this.initMembers();

    // draw initial contents.
    this.refresh();
  }

  /**
   * Initializes the members of this window.
   */
  initMembers()
  {
    // initialize the actor.
    this._actor = null;

    // initialize the source.
    this._source = null;

    // initialize the next y position.
    this._nextY = 0;
  }

  //endregion init

  //region accessors
  /**
   * Gets the actor that is bound to this window.
   * @returns {Game_Actor|null}
   */
  actor()
  {
    return this._actor;
  }

  /**
   * Sets the actor for this window.
   * @param {Game_Actor} actor The actor to bind.
   */
  setActor(actor)
  {
    this._actor = actor;
  }

  /**
   * Gets the source that is bound to this window.
   * @returns {RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State|null}
   */
  source()
  {
    return this._source;
  }

  /**
   * Sets the source for this window.
   * @param {RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State} source The new source.
   */
  setSource(source)
  {
    // do nothing if the source is unchanged.
    if (this.source() === source) return;

    // update the source.
    this._source = source;

    // refresh the contents for the new source.
    this.refresh();
  }

  /**
   * The y position of the next block to draw.
   * @returns {number}
   */
  nextY()
  {
    return this._nextY || 0;
  }

  /**
   * Sets the next y position for drawing.
   * @param {number} y The y position to set.
   */
  setNextY(y)
  {
    this._nextY = y;
  }

  //endregion accessors

  //region draw
  /**
   * Implements {@link #drawContent}.<br/>
   * Draws the details for the selected source.
   */
  drawContent()
  {
    if (!this.source() || !this.actor())
    {
      // render a default hint.
      this.resetTextColor();
      this.drawText('Select a source from the list.', 0, 0, this.contentsWidth());
      return;
    }

    // reset the next y position.
    this.setNextY(0);

    // draw the header.
    this.drawHeader();

    // draw the learnable skills from the source.
    this.drawDetails();
  }

  /**
   * Draws the header containing the icon and name.
   */
  drawHeader()
  {
    // grab the source data.
    const source = this.source();

    // y anchor for the header.
    let y = this.nextY();

    if (source.iconIndex > 0)
    {
      this.drawIcon(source.iconIndex, 0, y);
    }

    // compute a left indent if we drew an icon.
    const left = (source.iconIndex > 0)
      ? 36
      : 0;

    // draw the name of the source.
    this.changeTextColor(this.systemColor());
    this.drawText(`${source.name}`, left, y, this.contentsWidth() - left);

    // advance y.
    y += this.lineHeight();

    // default the description to an empty string.
    let description = String.empty;

    // actors use their profile as the description.
    if (source.isActor())
    {
      description = source.profile;
    }
    // classes simply don't have a description.
    else if (source.isClass())
    {
      description = 'The class applied to the current actor.';
    }
    // states also don't have a description.
    else if (source.isState())
    {
      description = 'A state applied to the actor.';
    }
    // the rest of the possibilities do, though.
    else
    {
      ({ description } = source);
    }

    // render the description.
    const wrappedText = this.modFontSizeForText(-4, description);
    this.drawTextEx(wrappedText, 0, y, this.contentsWidth());

    // update the nextY coordinate.
    y += this.lineHeight() * 3;
    this.setNextY(y);
  }

  drawDetails()
  {
    // grab the source data.
    const source = this.source();

    // establish a y anchor somewhat below the gauges.
    const baseY = this.nextY();

    // header label for the section.
    this.drawTextEx(`\\I[79]\\C[16]Skills\\C[0]`, 0, baseY, this.contentsWidth());

    // compute the starting y for rows.
    const updatedY = baseY + this.lineHeight();
    this.setNextY(updatedY);

    // extract all the teachables for this source.
    const teachables = source.aptitudeTeachings;

    // check if we are lacking in teachables.
    if (teachables.length === 0)
    {
      // render a friendly hint.
      this.resetTextColor();
      this.drawText('No teachable skills available.', 0, this.nextY(), this.contentsWidth());

      // stop processing.
      return;
    }

    // grab the actor.
    const actor = this.actor();

    // derive the key from the source.
    const sourceKey = ApManager.deriveKey(source);

    // iterate over the teachables and draw the details for each.
    teachables.forEach(teachable =>
    {
      // default with 0 for the x coordinate.
      const x = 0;

      // start with the nextY.
      const nextY = this.nextY();

      // calculate the left column width for the icon+label.
      const leftW = Math.floor(this.contentsWidth() * 0.60);

      // extract the AP required to learn this skill.
      const { requiredAp, skillId } = teachable;

      // identify the skill.
      const skill = actor.skill(skillId);

      // determine if the actor is learning this teachable.
      const learning = actor.getAptitudeLearning(sourceKey, skillId);

      // identify if the learning exists or not.
      const hasLearning = learning !== null;

      // render the learnable skill name.
      this.drawTextEx(`\\I[${skill.iconIndex}]${skill.name}`, x, nextY, this.contentsWidth());

      // determine the current AP count for this skill.
      const currentAp = hasLearning
        ? learning.currentAp
        : 0;

      // determine learned state for this specific source.
      const learned = hasLearning && learning.isLearned() === true;

      // determine if the actor already knows the skill via some other source.
      const knownElsewhere = (learned === false) &&
        this.actor()
          .hasSkill(skillId);

      // decide the right-side text content.
      let rightText = '';
      if (learned === true)
      {
        // if learned from this source, show DONE.
        rightText = 'DONE';
      }
      else if (knownElsewhere === true)
      {
        // if not learned from this source but the actor already knows the skill, show KNOWN.
        rightText = 'KNOWN';
      }
      else
      {
        // otherwise, show the current/required AP counts.
        rightText = `${currentAp}/${requiredAp}`;
      }

      // decide the right-side color index.
      let rightColor = 7; // gray by default
      if (learned === true)
      {
        // green when learned.
        rightColor = 11;
      }
      else if (currentAp > 0)
      {
        // yellow when in-progress.
        rightColor = 6;
      }

      // apply the right-side color and draw the right-aligned status text.
      this.changeTextColor(ColorManager.textColor(rightColor));
      const rightW = this.contentsWidth() - leftW;
      this.drawText(rightText, 0, nextY, rightW, Window_Base.TextAlignments.Right);

      // Only draw a gauge if the skill is neither DONE nor KNOWN.
      const shouldDrawGauge = learned === false && knownElsewhere === false;
      if (shouldDrawGauge === true)
      {
        // compute the gauge rectangle centered vertically within the row.
        const gaugeX = Math.floor(this.contentsWidth() * 0.40);
        const gaugeY = nextY + Math.round(this.lineHeight() / 2) - Math.round(this.gaugeHeight() / 2);
        const rect = new Rectangle(gaugeX, gaugeY, this.gaugeWidth(), this.gaugeHeight());

        // compute the rate between 0..1 for the gauge.
        const progressRate = Math.max(0, Math.min(currentAp / requiredAp, 1));

        // build the gauge options with a dynamic segment count and colors.
        const segOpts = WindowGaugeOptions.Builder()
          .gaugeType(Window_Base.GAUGE_TYPES.Segmented)
          .segments(Math.max(1, Math.ceil(requiredAp / this.segmentValue())))
          .gap(2)
          .leftGradientColor(this.gaugeColor1())
          .rightGradientColor(this.gaugeColor2())
          .build();

        // draw the segmented gauge.
        this.drawGauge(rect, progressRate, segOpts);
      }

      // and add a line for the next row.
      this.setNextY(nextY + this.lineHeight());
    });
  }

  //endregion draw

  //region helpers
  /**
   * The width of the gauges in this window.
   * @returns {number}
   */
  gaugeWidth()
  {
    return 256;
  }

  /**
   * The height of the gauges in this window.
   * @returns {number}
   */
  gaugeHeight()
  {
    return 12;
  }

  /**
   * The back color of the gauges in this window.
   * @returns {string}
   */
  gaugeBackColor()
  {
    return 'rgba(255, 255, 255, 0.1)';
  }

  /**
   * The color to gradient from.
   * Defaults to blue.
   * @returns {string}
   */
  gaugeColor1()
  {
    return 'rgba(179, 89, 0, 1)';
  }

  /**
   * The color to gradient into.
   * Defaults to green.
   * @returns {string}
   */
  gaugeColor2()
  {
    return 'rgba(255, 166, 77, 1)';
  }

  inactiveColor1()
  {
    return 'rgba(77, 77, 77, 1)';
  }

  inactiveColor2()
  {
    return 'rgba(153, 153, 153, 1)';
  }

  /**
   * The amount that one segment represents.
   * @returns {number}
   */
  segmentValue()
  {
    return 10;
  }

  //endregion helpers
}

//endregion Window_AptitudeSourceDetails

//region Window_AptitudeSourceList
/**
 * A window listing all aptitude sources currently applied to the actor.
 */
class Window_AptitudeSourceList
  extends Window_Command
{
  //region properties
  /**
   * The actor bound to this window.
   * @type {Game_Actor|null}
   */
  _actor = null;

  /**
   * The list of sources bound to this window.
   * @type {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]}
   */
  _sources = [];

  //endregion properties

  //region init
  constructor(rect)
  {
    // call parent ctor.
    super(rect);

    // initialize members.
    this.initMembers();
  }

  /**
   * Initializes the members of this window.
   */
  initMembers()
  {
    // initialize the actor.
    this._actor = null;

    // initialize the sources bucket.
    this._sources = [];
  }

  //endregion init

  //region accessors
  /**
   * Gets the actor that is bound to this window.
   * @returns {Game_Actor|null}
   */
  actor()
  {
    return this._actor;
  }

  /**
   * Sets the actor for this window.
   * @param {Game_Actor} actor The actor to bind.
   */
  setActor(actor)
  {
    this._actor = actor;
  }

  /**
   * The
   * @returns {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]}
   */
  sources()
  {
    return this._sources || [];
  }

  /**
   * Sets the sources for this window.
   * @param {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]} sources The new sources.
   */
  setSources(sources)
  {
    // assign the sources.
    this._sources = sources;

    // rebuild the command list with the new data.
    this.refresh();
  }

  //endregion accessors

  /**
   * Rebuilds the command list for the current actor.
   */
  makeCommandList()
  {
    // if we don’t have an actor, there is nothing to build.
    if (this.actor() === null) return;

    // build all commands for this window.
    const commands = this.buildCommands();

    // add all built commands to this window.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // grab all the sources to build commands for.
    const sources = this.sources();

    // if no sources, nothing to render.
    if (sources.length === 0) return [];

    // build each command based on the source.
    const commands = sources.map(this.buildCommand, this);

    // return the built command set.
    return commands;
  }

  /**
   * Builds a single command for the given source.
   * @param {RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State} source The source.
   * @returns {BuiltWindowCommand}
   */
  buildCommand(source)
  {
    let { iconIndex } = source;

    // actors don't normally have an icon index, so lets give em one.
    if (source.isActor())
    {
      iconIndex = 2727;
    }
    // classes also don't normally have an icon index, so lets give em one.
    else if (source.isClass())
    {
      iconIndex = 2694;
    }

    const builtWindowCommand = new WindowCommandBuilder(source.name)
      .setSymbol(`source:${source.implementationType()}`)
      .setExtensionData(source)
      .setIconIndex(iconIndex)
      .build();

    return builtWindowCommand;
  }
}

//endregion Window_AptitudeSourceList

//region Window_MenuCommand
/**
 * Extends {@link #addOriginalCommands}.</br>
 * Adds the Aptitude menu command if enabled via plugin parameter.
 */
J.APT.Aliased.Window_MenuCommand.set('addOriginalCommands', Window_MenuCommand.prototype.addOriginalCommands);
Window_MenuCommand.prototype.addOriginalCommands = function()
{
  // perform original logic.
  J.APT.Aliased.Window_MenuCommand.get('addOriginalCommands')
    .call(this);

  // add the APT menu command if enabled via plugin parameter.
  const switchId = J.APT.Metadata.menuSwitchId;

  // if no switch configured or the switch is ON, show the command.
  if (switchId === 0 || $gameSwitches.value(switchId))
  {
    // build the command.
    const builtCommand = new WindowCommandBuilder('Aptitude')
      .setSymbol('aptitude')
      .setIconIndex(186)
      .build();

    // add the command to the menu.
    this.addBuiltCommand(builtCommand);
  }
};
//endregion Window_MenuCommand