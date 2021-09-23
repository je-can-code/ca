/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] JABS metadata for states.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A component of JABS that lives with the base plugin.
 * This class represents the metadata used by JABS that is parsed and
 * managed by the BASE plugin. All custom feature flags from JABS related to
 * states can typically be found in this object.
 * ============================================================================
 */

/**
* A class that contains all custom data for JABS states.
* 
* This class was created because states do not inherently have a class to hook into
* for extensions, like `Game_Actor` or `Game_Map`.
*/
class JABS_StateData {
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

  /**
   * Gets whether or not this state is identified as a "negative" state.
   * @returns {boolean}
   */
  get negative() {
    let negative = false;
    if (this._meta && this._meta[J.BASE.Notetags.NegativeState]) {
      negative = true;
    } else {
      const structure = /<negative>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          negative = true;
        }
      })
    }

    return negative;
  };

  /**
   * Gets whether or not this state locks aggro modification.
   * @returns {boolean}
   */
  get aggroLock() {
    let aggroLocked = false;
    if (this._meta && this._meta[J.BASE.Notetags.AggroLock]) {
      aggroLocked = true;
    } else {
      const structure = /<aggroLock>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          aggroLocked = true;
        }
      })
    }

    return aggroLocked;
  };

  /**
   * Gets the aggro dealt amp multiplier bonus for this state.
   * @returns {number}
   */
  get aggroOutAmp() {
    let aggroOutAmp = 1.0;
    if (this._meta && this._meta[J.BASE.Notetags.AggroOutAmp]) {
      aggroOutAmp = parseFloat(this._meta[J.BASE.Notetags.AggroOutAmp]);
    } else {
      const structure = /<aggroOutAmp:[ ]?[+]?([-]?\d+[.]?\d+)?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          aggroOutAmp = parseFloat(RegExp.$1);
        }
      })
    }

    return aggroOutAmp;
  };

  /**
   * Gets the aggro received amp multiplier bonus for this state.
   * @returns {number}
   */
  get aggroInAmp() {
    let aggroInAmp = 1.0;
    if (this._meta && this._meta[J.BASE.Notetags.AggroInAmp]) {
      aggroInAmp = parseFloat(this._meta[J.BASE.Notetags.AggroInAmp]);
    } else {
      const structure = /<aggroInAmp:[ ]?[+]?([-]?\d+[.]?\d+)?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          aggroInAmp = parseFloat(RegExp.$1);
        }
      })
    }

    return aggroInAmp;
  };

  /**
   * Gets whether or not this state inflicts JABS paralysis.
   * @returns {boolean} True if it inflicts JABS paralysis, false otherwise.
   */
  get paralyzed() {
    let paralyzed = false;
    if (this._meta && this._meta[J.BASE.Notetags.Paralyzed]) {
      paralyzed = true;
    } else {
      const structure = /<paralyzed>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          paralyzed = true;
        }
      })
    }

    return paralyzed;
  };

  /**
   * Gets whether or not this state inflicts JABS root.
   * @returns {boolean} True if it inflicts JABS root, false otherwise.
   */
  get rooted() {
    let rooted = false;
    if (this._meta && this._meta[J.BASE.Notetags.Rooted]) {
      rooted = true;
    } else {
      const structure = /<rooted>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          rooted = true;
        }
      })
    }

    return rooted;
  };

  /**
   * Gets whether or not this state inflicts JABS mute.
   * @returns {boolean} True if it inflicts JABS mute, false otherwise.
   */
  get muted() {
    let muted = false;
    if (this._meta && this._meta[J.BASE.Notetags.Muted]) {
      muted = true;
    } else {
      const structure = /<muted>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          muted = true;
        }
      })
    }

    return muted;
  };

  /**
   * Gets whether or not this state inflicts JABS disable.
   * @returns {boolean} True if it inflicts JABS disable, false otherwise.
   */
  get disabled() {
    let disabled = false;
    if (this._meta && this._meta[J.BASE.Notetags.Disabled]) {
      disabled = true;
    } else {
      const structure = /<disabled>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          disabled = true;
        }
      })
    }

    return disabled;
  };

  /**
   * Gets the formula for hp5 of this state.
   * 
   * This formula is a string, intended to be `eval`-ed, which is absolutely unsafe, so
   * use with the utmost caution (as with any eval).
   * @returns {string} the formula to be dynamically executed.
   */
  get slipHpFormula() {
    let formula = "";
    const structure = /<slip:hp:\[([\+\-\*\/ \(\)\.\w]+)\]>/gmi;
    this._notes.forEach(note => {
      if (note.match(structure)) {
        formula = RegExp.$1;
      }
    });

    return formula;
  };

  /**
   * Gets the flat hp5 for this state.
   * @returns {number} The flat hp5.
   */
  get slipHpFlat() {
    let hpFlat = 0;
    if (this._meta && this._meta[J.BASE.Notetags.HpFlat]) {
      hpFlat = parseInt(this._meta[J.BASE.Notetags.HpFlat]);
    } else {
      const structure = /<hpFlat:[ ]?([-]?\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          hpFlat = parseInt(RegExp.$1);
        }
      });
    }

    return hpFlat;
  };

  /**
   * Gets the percentage hp5 for this state.
   * @returns {number} The percentage hp5.
   */
  get slipHpPerc() {
    let hpPerc = 0;
    if (this._meta && this._meta[J.BASE.Notetags.HpPerc]) {
      hpPerc = parseFloat(this._meta[J.BASE.Notetags.HpPerc]);
    } else {
      const structure = /<hpPerc:[ ]?([-]?\d+)[%]?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          hpPerc = parseFloat(RegExp.$1);
        }
      });
    }

    return hpPerc;
  };

  /**
   * Gets the formula for mp5 of this state.
   * 
   * This formula is a string, intended to be `eval`-ed, which is absolutely unsafe, so
   * use with the utmost caution (as with any eval).
   * @returns {string} the formula to be dynamically executed.
   */
  get slipMpFormula() {
    let formula = "";
    const structure = /<slip:mp:\[([\+\-\*\/ \(\)\.\w]+)\]>/gmi;
    this._notes.forEach(note => {
      if (note.match(structure)) {
        formula = RegExp.$1;
      }
    });

    return formula;
  };

  /**
   * Gets the flat mp5 for this state.
   * @returns {number} The flat mp5.
   */
  get slipMpFlat() {
    let mpFlat = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MpFlat]) {
      mpFlat = parseInt(this._meta[J.BASE.Notetags.MpFlat]);
    } else {
      const structure = /<mpFlat:[ ]?([-]?\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          mpFlat = parseInt(RegExp.$1);
        }
      });
    }

    return mpFlat;
  };

  /**
   * Gets the percentage mp5 for this state.
   * @returns {number} The percentage mp5.
   */
  get slipMpPerc() {
    let mpPerc = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MpPerc]) {
      mpPerc = parseFloat(this._meta[J.BASE.Notetags.MpPerc]);
    } else {
      const structure = /<mpPerc:[ ]?([-]?\d+)[%]?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          mpPerc = parseFloat(RegExp.$1);
        }
      });
    }

    return mpPerc;
  };

  /**
   * Gets the formula for mp5 of this state.
   * 
   * This formula is a string, intended to be `eval`-ed, which is absolutely unsafe, so
   * use with the utmost caution (as with any eval).
   * @returns {string} the formula to be dynamically executed.
   */
  get slipTpFormula() {
    let formula = "";
    const structure = /<slip:tp:\[([\+\-\*\/ \(\)\.\w]+)\]>/gmi;
    this._notes.forEach(note => {
      if (note.match(structure)) {
        formula = RegExp.$1;
      }
    });

    return formula;
  };

  /**
   * Gets the flat tp5 for this state.
   * @returns {number} The flat tp5.
   */
  get slipTpFlat() {
    let tpFlat = 0;
    if (this._meta && this._meta[J.BASE.Notetags.TpFlat]) {
      tpFlat = parseInt(this._meta[J.BASE.Notetags.TpFlat]);
    } else {
      const structure = /<tpFlat:[ ]?([-]?\d+)>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          tpFlat = parseInt(RegExp.$1);
        }
      });
    }

    return tpFlat;
  };

  /**
   * Gets the percentage tp5 for this state.
   * @returns {number} The percentage tp5.
   */
  get slipTpPerc() {
    let tpPerc = 0;
    if (this._meta && this._meta[J.BASE.Notetags.TpPerc]) {
      tpPerc = parseFloat(this._meta[J.BASE.Notetags.TpPerc]);
    } else {
      const structure = /<tpPerc:[ ]?([-]?\d+)[%]?>/i;
      this._notes.forEach(note => {
        if (note.match(structure)) {
          tpPerc = parseFloat(RegExp.$1);
        }
      });
    }

    return tpPerc;
  };
};
//ENDFILE