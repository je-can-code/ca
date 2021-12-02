/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] JABS metadata for skills.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A component of JABS that lives with the base plugin.
 * This class represents the metadata used by JABS that is parsed and
 * managed by the BASE plugin. All custom feature flags from JABS related to
 * items can typically be found in this object.
 * ============================================================================
 */

/**
 * A class that contains all custom feature flags for JABS skills.
 *
 * This class was created because skills do not inherently have a class to hook into
 * for extensions, like `Game_Actor` or `Game_Map`.
 */
function JABS_SkillData()
{
  this.initialize(...arguments);
}

JABS_SkillData.prototype = {};
JABS_SkillData.prototype.constructor = JABS_SkillData;

/**
 * @constructor
 * @param {string} notes The raw note box as a string.
 * @param {any} meta The `meta` object containing prebuilt note metadata.
 */
JABS_SkillData.prototype.initialize = function(notes, meta)
{
  this._notes = notes.split(/[\r\n]+/);
  this._meta = meta;
};

/**
 * OVERWRITE Rewrites the way this object is deserialized when being stringified.
 * @returns {JABS_SkillData}
 */
JABS_SkillData.prototype.toJSON = function()
{
  const jsonObj = Object.assign({}, this);
  const proto = Object.getPrototypeOf(this);
  for (const key of Object.getOwnPropertyNames(proto))
  {
    const desc = Object.getOwnPropertyDescriptor(proto, key);
    const hasGetter = desc && typeof desc.get === 'function';
    if (hasGetter)
    {
      jsonObj[key] = this[key];
    }
  }

  return jsonObj;
};

/**
 * Gets the duration of the delay for this action and whether or not it can be triggered
 * by colliding with it.
 * @returns {{duration: number, touchToTrigger: boolean}}
 */
JABS_SkillData.prototype.delay = function()
{
  let temp = [0, false];
  const structure = /<delay:[ ]?(\[-?\d+,[ ]?(true|false)])>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      temp = JSON.parse(RegExp.$1);
    }
  });

  return {duration: parseInt(temp[0]) ?? 0, touchToTrigger: temp[1]};
};

/**
 * Gets the bonus aggro this skill generates.
 * @returns {number}
 */
JABS_SkillData.prototype.bonusAggro = function()
{
  let aggro = 0;
  const structure = /<aggro:[ ]?(-?\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      aggro += parseInt(RegExp.$1);
    }
  })

  return aggro;
};

/**
 * Gets the aggro multiplier that this skill performs.
 * Used for skills specifically that increase/decrease by a percent (or reset).
 * @returns {number}
 */
JABS_SkillData.prototype.aggroMultiplier = function()
{
  let multiplier = 1.0;
  const structure = /<aggroMultiply:[ ]?(\d+[.]?\d+)?>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      multiplier += parseFloat(RegExp.$1);
    }
  });

  return multiplier;
};

/**
 * Gets whether or not this skill is a direct-targeting skill.
 * @returns {boolean} True if it is a direct-targeting skill, false otherwise.
 */
JABS_SkillData.prototype.direct = function()
{
  let isDirect = false;
  const structure = /<direct>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      isDirect = true;
    }
  });

  return isDirect;
};

/**
 * Gets the number of bonus hits this skill grants.
 * @returns {number} The number of bonus hits.
 */
JABS_SkillData.prototype.getBonusHits = function()
{
  let bonusHits = 0;
  const structure = /<bonusHits:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      bonusHits = parseInt(RegExp.$1);
    }
  });

  return bonusHits;
};

/**
 * Gets the amount of parry to ignore.
 * @type {number} The amount of parry to ignore; will be `-1` if should always ignore.
 */
JABS_SkillData.prototype.ignoreParry = function()
{
  let ignore = 0;
  const structure = /<ignoreParry([:]?[ ]?((\d+)[%])?)?>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      ignore = !RegExp.$1
        ? -1                    // if parameter left out, then always ignore parry.
        : parseInt(RegExp.$3);  // if parameter exists, use the number.
    }
  });

  return ignore;
};

/**
 * Gets the amount of damage being reduced by guarding.
 * @returns {[number, number]} `[flat, percent]`.
 */
JABS_SkillData.prototype.guard = function()
{
  let guard = [0, false];
  const structure = /<guard:[ ]?(\[-?\d+,[ ]?-?\d+])>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      guard = JSON.parse(RegExp.$1);
    }
  });

  return guard;
};

/**
 * Gets the number of frames that a precise-guard is available for.
 * @returns {number} The number of frames for precise-guard.
 */
JABS_SkillData.prototype.parry = function()
{
  let parry = 0;
  const structure = /<parry:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      parry = parseInt(RegExp.$1);
    }
  });

  return parry;
};

/**
 * Gets the id of the skill to retaliate with when executing a precise-parry.
 * @returns {number} The skill id.
 */
JABS_SkillData.prototype.counterParry = function()
{
  let id = 0;
  const structure = /<counterParry:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      id = parseInt(RegExp.$1);
    }
  });

  return id;
};

/**
 * Gets the id of the skill to retaliate with when guarding.
 * @returns {number} The skill id.
 */
JABS_SkillData.prototype.counterGuard = function()
{
  let id = 0;
  const structure = /<counterGuard:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      id = parseInt(RegExp.$1);
    }
  });

  return id;
};

/**
 * Gets the animation id to show when executing a skill.
 * @returns {number} The animation id for casting (default = 1)
 */
JABS_SkillData.prototype.casterAnimation = function()
{
  let animationId = 0;
  const structure = /<castAnimation:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      animationId = parseInt(RegExp.$1);
    }
  });

  return animationId;
};

/**
 * Gets the cast time for this skill.
 * @returns {number} The cast time in frames (default = 0).
 */
JABS_SkillData.prototype.castTime = function()
{
  let castTime = 1;
  const structure = /<castTime:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      castTime = parseInt(RegExp.$1);
    }
  });

  return castTime;
};

/**
 * Gets the cooldown for this skill.
 * @returns {number} The cooldown in frames (default = 0).
 */
JABS_SkillData.prototype.cooldown = function()
{
  let cooldown = 0;
  const structure = /<cooldown:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      cooldown = parseInt(RegExp.$1);
    }
  });

  return cooldown;
};

/**
 * Gets the cooldown for this skill when performed by AI.
 * If this is also an actor using the skill, the base cooldown will
 * still be applied to the cooldown slot.
 * @returns {number} The cooldown in frames (default = 0).
 */
JABS_SkillData.prototype.aiCooldown = function()
{
  let aiCooldown = -1;
  const structure = /<aiCooldown:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      aiCooldown = parseInt(RegExp.$1);
    }
  });

  return aiCooldown;
};

/**
 * Gets the range for this skill.
 * @returns {number} The range in tiles/spaces/squares (default = 0).
 */
JABS_SkillData.prototype.range = function()
{
  let range = 0;
  const structure = /<range:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      range = parseInt(RegExp.$1);
    }
  });

  return range;
};

/**
 * Gets the action id for this skill.
 * @returns {number} The action id (default = 1).
 */
JABS_SkillData.prototype.actionId = function()
{
  let actionId = 1;
  const structure = /<actionId:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      actionId = parseInt(RegExp.$1);
    }
  });

  return actionId;
};

/**
 * Gets the duration this skill persists on the map.
 * @returns {number} The duration in frames (default = 60).
 */
JABS_SkillData.prototype.duration = function()
{
  let duration = 0;
  const structure = /<duration:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      duration = parseInt(RegExp.$1);
    }
  });

  return duration;
};

/**
 * Gets the hitbox shape for this skill.
 * @returns {string} The hitbox shape (default = rhombus).
 */
JABS_SkillData.prototype.shape = function()
{
  let shape = 'rhombus';
  const structure = /<shape:[ ]?(rhombus|square|frontsquare|line|arc|wall|cross)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      shape = RegExp.$1.toLowerCase();
    }
  });

  return shape;
};

/**
 * Gets the number of projectiles for this skill.
 * @returns {number}
 */
JABS_SkillData.prototype.projectile = function()
{
  let projectile = 1;
  const structure = /<projectile:[ ]?([12348])>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      projectile = parseInt(RegExp.$1);
    }
  });

  return projectile;
};

/**
 * Gets the piercing data for this skill.
 * @returns {[number, number]} The piercing data (default = [1, 0]).
 */
JABS_SkillData.prototype.piercing = function()
{
  let piercing = [1, 0];
  const structure = /<pierce:[ ]?(\[\d+,[ ]?\d+])>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      piercing = JSON.parse(RegExp.$1);
    }
  });

  return piercing;
};

/**
 * Gets the combo data for this skill.
 * @returns {[number, number]} The combo data (default = null).
 */
JABS_SkillData.prototype.combo = function()
{
  let combo = null;
  const structure = /<combo:[ ]?(\[\d+,[ ]?\d+])>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      combo = JSON.parse(RegExp.$1);
    }
  });

  return combo;
};

/**
 * Gets the free combo boolean for this skill. "Free Combo" skills do not
 * require the hit to land to continue combo-ing.
 * @returns {boolean} True if free combo, false otherwise.
 */
JABS_SkillData.prototype.freeCombo = function()
{
  let freeCombo = false;
  const structure = /<freeCombo>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      freeCombo = true;
    }
  });

  return freeCombo;
};

/**
 * Gets the proximity required for this skill.
 * @returns {number} The proximity (default = 1).
 */
JABS_SkillData.prototype.proximity = function()
{
  let proximity = 1;
  const structure = /<proximity:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      proximity = parseInt(RegExp.$1);
    }
  });

  return proximity;
};

/**
 * Gets the knockback for this skill. Unlike many other numeric parameters,
 * if there is no knockback, the default is `null` instead of `0` because `0`
 * knockback will still knock up the battler.
 * @returns {number} The knockback (default = null).
 */
JABS_SkillData.prototype.knockback = function()
{
  let knockback = null;
  const structure = /<knockback:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      knockback = parseInt(RegExp.$1);
    }
  });

  return knockback;
};

/**
 * Gets whether or not this battler is invincible due to this skill.
 * @returns {boolean}
 */
JABS_SkillData.prototype.invincible = function()
{
  let invincible = false;
  const structure = /<invincible>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      invincible = true;
    }
  });

  return invincible;
};

/**
 * Gets the unique cooldown boolean. Unique cooldown means that the skill
 * can be assigned to multiple slots and cooldowns are impacted independently
 * of one another.
 * @returns {boolean} True if this skill is unique, false otherwise.
 */
JABS_SkillData.prototype.uniqueCooldown = function()
{
  let uniqueCooldown = false;
  const structure = /<unique>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      uniqueCooldown = true;
    }
  });

  return uniqueCooldown;
};

/**
 * Gets the type of movement this skill executes (for dodge skills).
 * @returns {string}
 */
JABS_SkillData.prototype.moveType = function()
{
  let moveType = "forward";
  const structure = /<moveType:[ ]?(forward|backward|directional)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      moveType = RegExp.$1;
    }
  });

  return moveType;
};

/**
 * Gets the action pose data for this skill.
 * @returns {[string, number, number]} The action pose data (default = null).
 */
JABS_SkillData.prototype.poseSuffix = function()
{
  let actionPoseData = null;
  const structure = /<poseSuffix:[ ]?(\["[-_]?\w+",[ ]?\d+,[ ]?\d+])>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      actionPoseData = JSON.parse(RegExp.$1);
    }
  });

  return actionPoseData;
};

/**
 * Gets the animation id to execute on oneself instead of on the target.
 *
 * This doubles as both an indicator, and also retrieves the animation id.
 * @returns {number}
 */
JABS_SkillData.prototype.selfAnimationId = function()
{
  let selfAnimationId = 0;
  const structure = /<animationOnSelf:([ ]?\d+)?>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      selfAnimationId = parseInt(RegExp.$1);
    }
  });

  return selfAnimationId;
};
//ENDFILE