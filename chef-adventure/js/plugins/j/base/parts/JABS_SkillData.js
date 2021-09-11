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
class JABS_SkillData {
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta) {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
  };

  /**
   * Gets the duration of the delay for this action and whether or not it can be triggered
   * by colliding with it.
   * @returns {{duration: number, touchToTrigger: boolean}}
   */
  get delay() {
    let temp = [0, false];
    if (this._meta && this._meta[J.BASE.Notetags.Delay]) {
      temp = JSON.parse(this._meta[J.BASE.Notetags.Delay]);
    } else {
      const structure = /<delay:[ ]?(\[-?\d+,[ ]?(true|false))\]>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          temp = JSON.parse(RegExp.$1);
        }
      });
    }

    return { duration: parseInt(temp[0]) ?? 0, touchToTrigger: temp[1] };
  }

  /**
   * Gets the bonus aggro this skill generates.
   * @returns {number}
   */
  get bonusAggro() {
    let aggro = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Aggro]) {
      aggro = parseInt(this._meta[J.BASE.Notetags.Aggro]);
    } else {
      const structure = /<aggro:[ ]?(-?\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          aggro += parseInt(RegExp.$1);
        }
      })
    }

    return aggro;
  };

  /**
   * Gets the aggro multiplier that this skill performs.
   * Used for skills specifically that increase/decrease by a percent (or reset).
   * @returns {number}
   */
  get aggroMultiplier() {
    let multiplier = 1.0;
    if (this._meta && this._meta[J.BASE.Notetags.AggroMultiplier]) {
      multiplier = parseFloat(this._meta[J.BASE.Notetags.AggroMultiplier]);
    } else {
      const structure = /<aggroMultiply:[ ]?(\d+[.]?\d+)?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          multiplier += parseFloat(RegExp.$1);
        }
      });
    }

    return multiplier;
  };

  /**
   * Gets whether or not this skill is a direct-targeting skill.
   * @returns {boolean} True if it is a direct-targeting skill, false otherwise.
   */
  get direct() {
    let isDirect = false;
    if (this._meta && this._meta[J.BASE.Notetags.DirectSkill]) {
      isDirect = true;
    } else {
      const structure = /<direct>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          isDirect = true;
        }
      });
    }

    return isDirect;
  };

  /**
   * Gets the number of bonus hits this skill grants.
   * @returns {number} The number of bonus hits.
   */
  get bonusHits() {
    let bonusHits = 0;
    if (this._meta && this._meta[J.BASE.Notetags.BonusHits]) {
      bonusHits = parseInt(this._meta[J.BASE.Notetags.BonusHits]);
    } else {
      const structure = /<bonusHits:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          bonusHits = parseInt(RegExp.$1);
        }
      });
    }

    return bonusHits;
  };

  /**
   * Gets the amount of parry to ignore.
   * @type {number} The amount of parry to ignore; will be `-1` if should always ignores.
   */
  get ignoreParry() {
    let ignore = 0;
    if (this._meta && this._meta[J.BASE.Notetags.IgnoreParry]) {
      ignore = (typeof this._meta[J.BASE.Notetags.IgnoreParry] === "boolean")
        ? -1
        : parseInt(this._meta[J.BASE.Notetags.IgnoreParry]) || 0;
    } else {
      const structure = /<ignoreParry([:]?[ ]?((\d+)[%])?)?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          ignore = !RegExp.$1
            ? -1                    // if parameter left out, then always ignore parry.
            : parseInt(RegExp.$3);  // if parameter exists, use the number.
        }
      });
    }

    return ignore;
  }

  /**
   * Gets the amount of damage being reduced by guarding.
   * @returns {[number, boolean]} [damage reduction, true if reduction is %-based, false otherwise].
   */
  get guard() {
    let guard = [0, false];
    if (this._meta && this._meta[J.BASE.Notetags.Guard]) {
      guard = JSON.parse(this._meta[J.BASE.Notetags.Guard]);
    } else {
      const structure = /<guard:[ ]?(\[\d+,[ ]?\d+])>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          guard = JSON.parse(RegExp.$1);
        }
      });
    }

    return guard;
  }

  /**
   * Gets the number of frames that a precise-guard is available for.
   * @returns {number} The number of frames for precise-guard.
   */
  get parry() {
    let parry = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Parry]) {
      parry = parseInt(this._meta[J.BASE.Notetags.Parry]);
    } else {
      const structure = /<parry:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          parry = parseInt(RegExp.$1);
        }
      });
    }

    return parry;
  }

  /**
   * Gets the id of the skill to retaliate with when executing a precise-parry.
   * @returns {number} The skill id.
   */
  get counterParry() {
    let id = 0;
    if (this._meta && this._meta[J.BASE.Notetags.CounterParry]) {
      id = parseInt(this._meta[J.BASE.Notetags.CounterParry]);
    } else {
      const structure = /<counterParry:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          id = parseInt(RegExp.$1);
        }
      });
    }

    return id;
  }

  /**
   * Gets the id of the skill to retaliate with when guarding.
   * @returns {number} The skill id.
   */
  get counterGuard() {
    let id = 0;
    if (this._meta && this._meta[J.BASE.Notetags.CounterGuard]) {
      id = parseInt(this._meta[J.BASE.Notetags.CounterGuard]);
    } else {
      const structure = /<counterGuard:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          id = parseInt(RegExp.$1);
        }
      });
    }

    return id;
  }

  /**
   * Gets the animation id to show when executing a skill.
   * @returns {number} The animation id for casting (default = 1)
   */
  get casterAnimation() {
    let animationId = 0;
    if (this._meta && this._meta[J.BASE.Notetags.CastAnimation]) {
      animationId = parseInt(this._meta[J.BASE.Notetags.CastAnimation]);
    } else {
      const structure = /<castAnimation:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          animationId = parseInt(RegExp.$1);
        }
      });
    }

    return animationId;
  }

  /**
   * Gets the cast time for this skill.
   * @returns {number} The cast time in frames (default = 0).
   */
  get castTime() {
    let castTime = 1;
    if (this._meta && this._meta[J.BASE.Notetags.CastTime]) {
      castTime = parseInt(this._meta[J.BASE.Notetags.CastTime]) || 1;
    } else {
      const structure = /<castTime:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          castTime = parseInt(RegExp.$1);
        }
      });
    }

    return castTime;
  }

  /**
   * Gets the cooldown for this skill.
   * @returns {number} The cooldown in frames (default = 0).
   */
  get cooldown() {
    let cooldown = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Cooldown]) {
      cooldown = parseInt(this._meta[J.BASE.Notetags.Cooldown]) || 0;
    } else {
      const structure = /<cooldown:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          cooldown = parseInt(RegExp.$1);
        }
      });
    }

    return cooldown;
  }

  /**
   * Gets the cooldown for this skill when performed by AI.
   * If this is also an actor using the skill, the base cooldown will
   * still be applied to the cooldown slot.
   * @returns {number} The cooldown in frames (default = 0).
   */
  get aiCooldown() {
    let aiCooldown = -1;
    if (this._meta && this._meta[J.BASE.Notetags.AiCooldown]) {
      aiCooldown = parseInt(this._meta[J.BASE.Notetags.AiCooldown]);
    } else {
      const structure = /<aiCooldown:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          aiCooldown = parseInt(RegExp.$1);
        }
      });
    }

    return aiCooldown;
  }

  /**
   * Gets the range for this skill.
   * @returns {number} The range in tiles/spaces/squares (default = 0).
   */
  get range() {
    let range = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Range]) {
      range = parseInt(this._meta[J.BASE.Notetags.Range]) || 0;
    } else {
      const structure = /<range:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          range = parseInt(RegExp.$1);
        }
      });
    }

    return range;
  }

  /**
   * Gets the action id for this skill.
   * @returns {number} The action id (default = 1).
   */
  get actionId() {
    let actionId = 1;
    if (this._meta && this._meta[J.BASE.Notetags.ActionId]) {
      actionId = parseInt(this._meta[J.BASE.Notetags.ActionId]) || 1;
    } else {
      const structure = /<actionId:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          actionId = parseInt(RegExp.$1);
        }
      });
    }

    return actionId;
  }

  /**
   * Gets the duration this skill persists on the map.
   * @returns {number} The duration in frames (default = 60).
   */
  get duration() {
    let duration = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Duration]) {
      duration = parseInt(this._meta[J.BASE.Notetags.Duration]) || duration;
    } else {
      const structure = /<duration:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          duration = parseInt(RegExp.$1);
        }
      });
    }

    return duration;
  }

  /**
   * Gets the hitbox shape for this skill.
   * @returns {string} The hitbox shape (default = rhombus).
   */
  get shape() {
    let shape = 'rhombus';
    const possibleShapes = ['rhombus', 'square', 'frontsquare', 'line', 'arc', 'wall', 'cross'];
    if (this._meta && this._meta[J.BASE.Notetags.Shape]) {
      if (possibleShapes.includes(this._meta[J.BASE.Notetags.Shape].toLowerCase())) {
        shape = this._meta[J.BASE.Notetags.Shape].toLowerCase();
      } else {
        console.warn('invalid shape provided- defaulted to "rhombus".');
      }
    } else {
      const structure = /<shape:[ ]?(rhombus|square|frontsquare|line|arc|wall|cross)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          shape = RegExp.$1.toLowerCase();
        }
      });
    }

    return shape;
  }

  /**
   * Gets the number of projectiles for this skill.
   * @returns {string} The hitbox shape (default = rhombus).
   */
  get projectile() {
    let projectile = 1;
    const possible = [1, 2, 3, 4, 8];
    if (this._meta && this._meta[J.BASE.Notetags.Projectile]) {
      if (possible.includes(parseInt(this._meta[J.BASE.Notetags.Projectile]))) {
        projectile = parseInt(this._meta[J.BASE.Notetags.Projectile]);
      } else {
        console.warn('invalid projectile provided- defaulted to "1".');
      }
    } else {
      const structure = /<projectile:[ ]?([12348])>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          projectile = parseInt(RegExp.$1);
        }
      });
    }

    return projectile;
  }

  /**
   * Gets the piercing data for this skill.
   * @returns {[number, number]} The piercing data (default = [1, 0]).
   */
  get piercing() {
    let piercing = [1, 0];
    if (this._meta && this._meta[J.BASE.Notetags.Piercing]) {
      piercing = JSON.parse(this._meta[J.BASE.Notetags.Piercing]);
    } else {
      const structure = /<pierce:[ ]?(\[\d+,[ ]?\d+\])>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          piercing = JSON.parse(RegExp.$1);
        }
      });
    }

    return piercing;
  }

  /**
   * Gets the combo data for this skill.
   * @returns {[number, number]} The combo data (default = null).
   */
  get combo() {
    let combo = null;
    if (this._meta && this._meta[J.BASE.Notetags.Combo]) {
      combo = JSON.parse(this._meta[J.BASE.Notetags.Combo]);
    } else {
      const structure = /<combo:[ ]?(\[\d+,[ ]?\d+])>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          combo = JSON.parse(RegExp.$1);
        }
      });
    }

    return combo;
  }

  /**
   * Gets the free combo boolean for this skill. "Free Combo" skills do not
   * require the hit to land to continue combo-ing.
   * @returns {boolean} True if free combo, false otherwise.
   */
  get freeCombo() {
    let freeCombo = false;
    if (this._meta && this._meta[J.BASE.Notetags.FreeCombo]) {
      freeCombo = true;
    } else {
      const structure = /<freeCombo>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          freeCombo = true;
        }
      });
    }

    return freeCombo;
  }

  /**
   * Gets the proximity required for this skill.
   * @returns {number} The proximity (default = 1).
   */
  get proximity() {
    let proximity = 1;
    if (this._meta && this._meta[J.BASE.Notetags.Proximity]) {
      proximity = parseInt(this._meta[J.BASE.Notetags.Proximity]);
    } else {
      const structure = /<proximity:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          proximity = parseInt(RegExp.$1);
        }
      });
    }

    return proximity;
  }

  /**
   * Gets the knockback for this skill. Unlike many other numeric parameters,
   * if there is no knockback, the default is `null` instead of `0` because `0`
   * knockback will still knock up the battler.
   * @returns {number} The knockback (default = null).
   */
  get knockback() {
    let knockback = null;
    if (this._meta && this._meta[J.BASE.Notetags.Knockback]) {
      knockback = parseInt(this._meta[J.BASE.Notetags.Knockback]);
    } else {
      const structure = /<knockback:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          knockback = parseInt(RegExp.$1);
        }
      });
    }

    return knockback;
  }

  /**
   * Gets the animation id to show when executing a skill.
   * @returns {number} The animation id for casting.
   */
  get invincible() {
    let invincible = false;
    if (this._meta && this._meta[J.BASE.Notetags.Invincible]) {
      invincible = true;
    } else {
      const structure = /<invincible>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          invincible = true;
        }
      });
    }

    return invincible;
  }

  /**
   * Gets the unique cooldown boolean. Unique cooldown means that the skill
   * can be assigned to multiple slots and cooldowns are impacted independently
   * of one another.
   * @returns {boolean} True if this skill is unique, false otherwise.
   */
  get uniqueCooldown() {
    let uniqueCooldown = false;
    if (this._meta && this._meta[J.BASE.Notetags.UniqueCooldown]) {
      uniqueCooldown = true;
    } else {
      const structure = /<unique>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          uniqueCooldown = true;
        }
      });
    }

    return uniqueCooldown;
  }

  /**
   * Gets the animation id to show when executing a skill.
   * @returns {number} The animation id for casting.
   */
  get moveType() {
    let moveType = "forward";
    if (this._meta && this._meta[J.BASE.Notetags.MoveType]) {
      moveType = this._meta[J.BASE.Notetags.MoveType];
    } else {
      const structure = /<moveType:[ ]?(forward|backward|directional)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          moveType = RegExp.$1;
        }
      });
    }

    return moveType;
  }

  /**
   * Gets the action pose data for this skill.
   * @returns {[string, number, number]} The action pose data (default = null).
   */
  get poseSuffix() {
    let actionPoseData = null;
    if (this._meta && this._meta[J.BASE.Notetags.PoseSuffix]) {
      actionPoseData = JSON.parse(this._meta[J.BASE.Notetags.PoseSuffix]);
    } else {
      const structure = /<poseSuffix:[ ]?(\["[-_]?\w+",[ ]?\d+,[ ]?\d+])>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          actionPoseData = JSON.parse(RegExp.$1);
        }
      });
    }

    return actionPoseData;
  }
};
//ENDFILE