//region JAFTING_Trait
/**
 * A class representing a single trait on a piece of equipment that can be potentially
 * transferred by means of JAFTING's refinement mode.
 */
function JAFTING_Trait()
{
  this.initialize(...arguments);
}
JAFTING_Trait.prototype = {};
JAFTING_Trait.prototype.constructor = JAFTING_Trait;

/**
 * Initializes the members of this class.
 * @param {number} code The code of the trait.
 * @param {number} dataId The dataId of the trait.
 * @param {number} value The value of the trait.
 */
JAFTING_Trait.prototype.initialize = function(code, dataId, value)
{
  this._code = code;
  this._dataId = dataId;
  this._value = value;
};

/**
 * The defacto of what JAFTING considers a "divider" trait.
 * All traits defined AFTER this trait are considered transferable.
 * @returns {RPG_Trait}
 */
JAFTING_Trait.divider = function()
{
  return RPG_Trait.fromValues(J.BASE.Traits.NO_DISAPPEAR, 3, 1);
};

/**
 * Gets a standardized concatenation of the name and value for a given trait.
 * @returns {string}
 */
Object.defineProperty(JAFTING_Trait.prototype, "nameAndValue", {
  get()
  {
    return `${this.name} ${this.value}`;
  },
  configurable: true,
});

/**
 * Gets the friendly name of the trait based on the trait code.
 * @returns {string}
 */
Object.defineProperty(JAFTING_Trait.prototype, "name", {
  get()
  {
    switch (this._code)
    {
      // first tab.
      case 11:
        return `${$dataSystem.elements[this._dataId]} dmg`;
      case 12:
        return `${TextManager.param(this._dataId)} debuff rate`;
      case 13:
        return `${$dataStates[this._dataId].name} resist`;
      case 14:
        return `Immune to`;

      // second tab.
      case 21:
        return `${TextManager.param(this._dataId)}`;
      case 22:
        return `${TextManager.xparam(this._dataId)}`;
      case 23:
        return `${TextManager.sparam(this._dataId)}`;

      // third tab.
      case 31:
        return `Attack Element:`;
      case 32:
        return `${$dataStates[this._dataId].name} on-hit`;
      case 33:
        return `Skill Speed`;
      case 34:
        return `Times`;
      case 35:
        return `Basic Attack w/`;

      // fourth tab.
      case 41:
        return `Unlock:`;
      case 42:
        return `Lock:`;
      case 43:
        return `Learn:`;
      case 44:
        return `Seal:`;

      // fifth tab.
      case 51:
        return `${$dataSystem.weaponTypes[this._dataId]}`;
      case 52:
        return `${$dataSystem.armorTypes[this._dataId]}`;
      case 53:
        return `${$dataSystem.equipTypes[this._dataId]}`;
      case 54:
        return `${$dataSystem.equipTypes[this._dataId]}`;
      case 55:
        return `${this._dataId ? "Enable" : "Disable"}`;

      // sixth tab.
      case 61:
        return `Another turn chance:`;
      case 62:
        return `${this.translateSpecialFlag()}`;
      case 64:
        return `${this.translatePartyAbility()}`;

      case 63:
        return `TRANSFERABLE TRAITS`;
      default:
        return "All traits were implemented,";
    }
  },
  configurable: true,
});

/**
 * Gets the friendly value of the trait based on the trait code and value.
 * @returns {string}
 */
Object.defineProperty(JAFTING_Trait.prototype, "value", {
  get()
  {
    switch (this._code)
    {
      // first tab.
      case 11:
        const calculatedElementalRate = Math.round(100 - (this._value * 100));
        return `${calculatedElementalRate > 0 ? "-" : "+"}${calculatedElementalRate}%`;
      case 12:
        const calculatedDebuffRate = Math.round((this._value * 100) - 100);
        return `${calculatedDebuffRate > 0 ? "+" : "-"}${calculatedDebuffRate}%`;
      case 13:
        const calculatedStateRate = Math.round(100 - (this._value * 100));
        return `${calculatedStateRate > 0 ? "+" : "-"}${calculatedStateRate}%`;
      case 14:
        return `${$dataStates[this._dataId].name}`;

      // second tab.
      case 21:
        const calculatedBParam = Math.round((this._value * 100) - 100);
        return `${calculatedBParam >= 0 ? "+" : ""}${calculatedBParam}%`;
      case 22:
        const calculatedXParam = Math.round((this._value * 100));
        return `${calculatedXParam >= 0 ? "+" : ""}${calculatedXParam}%`;
      case 23:
        const calculatedSParam = Math.round((this._value * 100) - 100);
        return `${calculatedSParam >= 0 ? "+" : ""}${calculatedSParam}%`;

      // third tab.
      case 31:
        return `${$dataSystem.elements[this._dataId]}`;
      case 32:
        return `${(this._value * 100)}%`;
      case 33:
        return `${this._value > 0 ? "+" : "-"}${this._value}`;
      case 34:
        return `${this._value > 0 ? "+" : "-"}${this._value}`;
      case 35:
        return `${$dataSkills[this._value].name}`;

      // fourth tab.
      case 41:
        return `${$dataSystem.skillTypes[this._dataId]}`;
      case 42:
        return `${$dataSystem.skillTypes[this._dataId]}`;
      case 43:
        return `${$dataSkills[this._dataId].name}`;
      case 44:
        return `${$dataSkills[this._dataId].name}`;

      // fifth tab.
      case 51:
        return `proficiency`;
      case 52:
        return `proficiency`;
      case 53:
        return `is locked`;
      case 54:
        return `is sealed`;
      case 55:
        return `Dual-wield`;

      // sixth tab.
      case 61:
        return `${Math.round(this._value * 100)}%`;
      case 62:
        return ``;
      case 64:
        return ``;
      case 63:
        return ``;
      default:
        return "is this a custom trait?";
    }
  },
  configurable: true,
});

/**
 * Translates the data id of the trait into what it represents according to RMMZ.
 * @returns {string}
 */
JAFTING_Trait.prototype.translateSpecialFlag = function()
{
  switch (this._dataId)
  {
    case 0:
      return `Autobattle`;
    case 1:
      return `Empowered Guard`;
    case 2:
      return `Cover/Substitute`;
    case 3:
      return `Preserve TP`;
  }
};

/**
 * Translates the data id of the trait into what it represents according to RMMZ.
 * @returns {string}
 */
JAFTING_Trait.prototype.translatePartyAbility = function()
{
  switch (this._dataId)
  {
    case 0:
      return `Encounter Half`;
    case 1:
      return `Encounter None`;
    case 2:
      return `Prevent Surprise`;
    case 3:
      return `Frequent Pre-emptive`;
    case 4:
      return `Gold Dropped 2x`;
    case 5:
      return `Item Drop Chance 2x`;
  }
};

/**
 * Gets the original RM trait associated with this JAFTING trait.
 * @returns {RPG_Trait}
 */
JAFTING_Trait.prototype.convertToRmTrait = function()
{
  return RPG_Trait.fromValues(this._code, this._dataId, this._value);
};
//endregion JAFTING_Trait