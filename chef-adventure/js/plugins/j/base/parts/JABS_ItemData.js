/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] JABS metadata for items.
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
 * A class that contains all custom data for JABS items.
 * 
 * This class was created because items do not inherently have a class to hook into
 * for extensions, like `Game_Actor` or `Game_Map`.
 */
class JABS_ItemData {
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
   * Gets the skill id associated with this item/tool.
   * @returns {number} The skill id, or `0` if none is present.
   */
  get skillId() {
    let skillId = 0;
    if (this._meta && this._meta[J.BASE.Notetags.SkillId]) {
      skillId = parseInt(this._meta[J.BASE.Notetags.SkillId]) || 0;
    } else {
      const structure = /<skillId:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          skillId = parseInt(RegExp.$1);
        }
      })
    }

    return skillId;
  };

  /**
   * Gets the cooldown for this item.
   * @returns {number} The cooldown in frames (default = 0).
   */
  get cooldown() {
    let cooldown = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Cooldown]) {
      cooldown = parseInt(this._meta[J.BASE.Notetags.Cooldown]);
    } else {
      const structure = /<cooldown:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          cooldown = parseInt(RegExp.$1);
        }
      });
    }

    return cooldown;
  };

  /**
   * Gets whether or not this item will be used instantly on-pickup.
   * @returns {boolean} True if this is an instant-use item, false otherwise.
   */
  get useOnPickup() {
    let useOnPickup = false;
    if (this._meta && this._meta[J.BASE.Notetags.UseOnPickup]) {
      useOnPickup = true;
    } else {
      const structure = /<useOnPickup>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          useOnPickup = true;
        }
      });
    }

    return useOnPickup;
  };

  /**
   * Gets the duration in frames of how long this loot will persist on the map.
   * If none is specified, the default will be used.
   * @returns {number}
   */
  get expires() {
    let expires = 0;
    if (this._meta && this._meta[J.BASE.Notetags.LootExpiration]) {
      expires = parseInt(this._meta[J.BASE.Notetags.LootExpiration]);
    } else {
      const structure = /<expires:[ ]?(\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          expires = parseInt(RegExp.$1);
        }
      });
    }

    return expires;
  };
};
//ENDFILE