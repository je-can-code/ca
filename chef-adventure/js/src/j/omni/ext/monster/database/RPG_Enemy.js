//region RPG_Enemy
/**
 * Whether or not this enemy should be hidden from the monsterpedia.
 * @type {boolean} True if the enemy should be hidden, false otherwise.
 */
Object.defineProperty(RPG_Enemy.prototype, "hideFromMonsterpedia",
  {
    get: function()
    {
      return this.shouldHideFromMonsterpedia();
    },
  });

/**
 * Determines whether or not this enemy should be hidden from the monsterpedia.
 * @returns {boolean} True if the enemy should be hidden, false otherwise.
 */
RPG_Enemy.prototype.shouldHideFromMonsterpedia = function()
{
  return this.getBooleanFromNotesByRegex(J.OMNI.EXT.MONSTER.RegExp.HideFromMonsterpedia);
};

/**
 * The icon index of the monster family this enemy belongs to.
 * @type {number}
 */
Object.defineProperty(RPG_Enemy.prototype, "monsterFamilyIcon",
  {
    get: function()
    {
      return this.getMonsterFamilyIconIndex();
    },
  });

/**
 * Gets the icon index representing the monster family of this enemy.
 * @returns {number}
 */
RPG_Enemy.prototype.getMonsterFamilyIconIndex = function()
{
  return this.getNumberFromNotesByRegex(J.OMNI.EXT.MONSTER.RegExp.MonsterpediaFamilyIcon);
};

/**
 * The description of the enemy for the monsterpedia.
 * @type {string[]}
 */
Object.defineProperty(RPG_Enemy.prototype, "monsterpediaDescription",
  {
    get: function()
    {
      return this.getMonsterpediaDescription();
    },
  });

/**
 * Gets the description of this enemy for the monsterpedia.
 * @returns {string[]}
 */
RPG_Enemy.prototype.getMonsterpediaDescription = function()
{
  return this.getStringsFromNotesByRegex(J.OMNI.EXT.MONSTER.RegExp.MonsterpediaDescription);
};
//endregion RPG_Enemy