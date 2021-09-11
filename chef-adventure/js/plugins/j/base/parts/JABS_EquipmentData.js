/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] JABS metadata for equipment.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A component of JABS that lives with the base plugin.
 * This class represents the metadata used by JABS that is parsed and
 * managed by the BASE plugin. All custom feature flags from JABS related to
 * equipment can typically be found in this object.
 * ============================================================================
 */

/**
 * A class that contains all custom data for JABS equipment.
 * 
 * This class was created because equipment does not inherently have a class to hook into
 * for extensions, like `Game_Actor` or `Game_Map`.
 */
class JABS_EquipmentData {
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta) {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
    this.skillId = this.skillId();
    this.speedBoost = this.speedBoost();
    this.bonusHits = this.bonusHits();
  }

  /**
   * Gets the skill id associated with this piece of equipment.
   * @returns {number} The skill id.
   */
  skillId() {
    let skillId = 0;
    if (this._meta && this._meta[J.BASE.Notetags.SkillId]) {
      skillId = parseInt(this._meta[J.BASE.Notetags.SkillId]) || 0;
    } else {
      const structure = /<skillId:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          skillId = parseInt(RegExp.$1);
        }
      });
    }

    return skillId;
  };

  /**
   * Gets the speed boost value associated with this piece of equipment.
   * @returns {number} The speed boost value.
   */
  speedBoost() {
    let speedBoost = 0;
    if (this._meta && this._meta[J.BASE.Notetags.SpeedBoost]) {
      speedBoost = parseInt(this._meta[J.BASE.Notetags.SpeedBoost]) || 0;
    } else {
      const structure = /<speedBoost:[ ]?([-]?\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          speedBoost = parseInt(RegExp.$1);
        }
      });
    }

    return speedBoost;
  };

  /**
   * Gets the number of bonus hits this skill grants.
   * @returns {number} The number of bonus hits.
   */
  bonusHits() {
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
};
//ENDFILE