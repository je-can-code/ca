/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Data structure of a equipped skill for JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This class contains the data associated with a skill that is equipped.
 * 
 * Plugin Developer Notes:
 * The equipped skill is separate from a cooldown, though they are related.
 * ============================================================================
 */

class JABS_EquippedSkill {
  constructor(key, skillId) {
    this.key = key;
    this.id = skillId;
    this.initMembers();
  }

  initMembers() {
    this.locked = false;
  };

  setSkillId(skillId) {
    this.id = skillId;
  };

  isUsable() {
    return this.id > 0;
  };

  isLocked() {
    return this.locked;
  };

  lock() {
    this.locked = true;
  };

  unlock() {
    this.locked = false;
  };

  clear() {
    this.id = 0;
    this.unlock();
  };
}