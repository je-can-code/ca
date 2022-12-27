//region Game_Enemy
/**
 * Gets the extra text from this enemy for the target frame.
 * @returns {string}
 */
Game_Enemy.prototype.targetFrameText = function()
{
  // extract the target frame extra text from this enemy.
  const extraText = this.extractTargetFrameText(this.enemy());

  // return it.
  return extraText ?? String.empty;
};

/**
 * Extracts the extratext out of this enemy.
 * @param {RPG_Enemy} referenceData The database data for this enemy.
 * @returns {string}
 */
Game_Enemy.prototype.extractTargetFrameText = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return String.empty;

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure = J.HUD.EXT.TARGET.RegExp.TargetFrameText;
  let extraText = String.empty;
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      extraText = RegExp.$1;
    }
  });

  return extraText;
};

/**
 * Gets the icon index of the target frame icon.
 * If none are present or valid, then the default will be 0 (no icon).
 * @returns {number}
 */
Game_Enemy.prototype.targetFrameIcon = function()
{
  // extract the target icon from this enemy.
  const targetIcon = this.extractTargetFrameIcon(this.enemy());

  // return it.
  return targetIcon;
};

/**
 * Extracts the target icon out of this enemy.
 * @param {RPG_Enemy} referenceData The database data for this enemy.
 * @returns {number}
 */
Game_Enemy.prototype.extractTargetFrameIcon = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return String.empty;

  // translate the tags from notes into an array of strings for easy parsing.
  const notedata = referenceData.note.split(/[\r\n]+/);

  // the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.TargetFrameIcon;

  // start with the default icon index of 0.
  let targetFrameIcon = 0;

  // check all the tags from the notes.
  notedata.forEach(line =>
  {
    // check if any tag matches the structure.
    if (structure.test(line))
    {
      // parse the found tag.
      targetFrameIcon = parseInt(RegExp.$1);
    }
  });

  // return the found icon if any.
  return targetFrameIcon;
};

/**
 * Gets whether or not the battler can show the target frame.
 * The default is to show.
 * @returns {boolean}
 */
Game_Enemy.prototype.showTargetFrame = function()
{
  // extract whether or not to show the target HP for this enemy.
  const showTargetFrame = this.extractShowTargetFrame(this.enemy());

  // return it.
  return showTargetFrame;
};

/**
 * Extracts whether or not to show the target frame for this enemy.
 * @param {RPG_Enemy} referenceData The database data for this enemy.
 * @returns {boolean}
 */
Game_Enemy.prototype.extractShowTargetFrame = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return true;

  // translate the tags from notes into an array of strings for easy parsing.
  const notedata = referenceData.note.split(/[\r\n]+/);

  // the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetFrame;

  // start with the default of true
  let showTargetFrame = true;

  // check all the tags from the notes.
  notedata.forEach(line =>
  {
    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide the target frame.
      showTargetFrame = false;
    }
  });

  // return the truth.
  return showTargetFrame;
};

/**
 * Gets whether or not the battler can show its mp bar.
 * The default is to show.
 * @returns {boolean}
 */
Game_Enemy.prototype.showTargetHpBar = function()
{
  // extract whether or not to show the target HP for this enemy.
  const showHpBar = this.extractShowHpBar(this.enemy());

  // return it.
  return showHpBar;
};

/**
 * Extracts whether or not to show the hp bar for this target.
 * @param {RPG_Enemy} referenceData The database data for this enemy.
 * @returns {boolean}
 */
Game_Enemy.prototype.extractShowHpBar = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return true;

  // translate the tags from notes into an array of strings for easy parsing.
  const notedata = referenceData.note.split(/[\r\n]+/);

  // the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetHP;

  // start with the default of true
  let showHpBar = true;

  // check all the tags from the notes.
  notedata.forEach(line =>
  {
    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide the target frame.
      showHpBar = false;
    }
  });

  // return the truth.
  return showHpBar;
};

/**
 * Gets whether or not the battler can show its mp bar.
 * The default is to show.
 * @returns {boolean}
 */
Game_Enemy.prototype.showTargetMpBar = function()
{
  // extract whether or not to show the target MP for this enemy.
  const showMpBar = this.extractShowMpBar(this.enemy());

  // return it.
  return showMpBar;
};

/**
 * Extracts whether or not to show the mp bar for this enemy.
 * @param {RPG_Enemy} referenceData The database data for this enemy.
 * @returns {boolean}
 */
Game_Enemy.prototype.extractShowMpBar = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return true;

  // translate the tags from notes into an array of strings for easy parsing.
  const notedata = referenceData.note.split(/[\r\n]+/);

  // the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetMP;

  // start with the default of true
  let showMpBar = true;

  // check all the tags from the notes.
  notedata.forEach(line =>
  {
    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide the target frame.
      showMpBar = false;
    }
  });

  // return the truth.
  return showMpBar;
};

/**
 * Gets whether or not the battler can show its tp bar.
 * The default is to show.
 * @returns {boolean}
 */
Game_Enemy.prototype.showTargetTpBar = function()
{
  // extract whether or not to show the target TP for this enemy.
  const showTpBar = this.extractShowTpBar(this.enemy());

  // return it.
  return showTpBar;
};

/**
 * Extracts whether or not to show the tp bar for this enemy.
 * @param {RPG_Enemy} referenceData The database data for this enemy.
 * @returns {boolean}
 */
Game_Enemy.prototype.extractShowTpBar = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return true;

  // translate the tags from notes into an array of strings for easy parsing.
  const notedata = referenceData.note.split(/[\r\n]+/);

  // the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetTP;

  // start with the default of true
  let showTpBar = true;

  // check all the tags from the notes.
  notedata.forEach(line =>
  {
    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide the target frame.
      showTpBar = false;
    }
  });

  // return the truth.
  return showTpBar;
};

/**
 * Gets whether or not the battler can show its target text.
 * The default is to show.
 * @returns {boolean}
 */
Game_Enemy.prototype.showTargetText = function()
{
  // extract whether or not to show the target text from this enemy.
  const showTargetText = this.extractShowTargetText(this.enemy());

  // return it.
  return showTargetText;
};

/**
 * Extracts whether or not to show the target text for this enemy.
 * @param {RPG_Enemy} referenceData The database data for this enemy.
 * @returns {boolean}
 */
Game_Enemy.prototype.extractShowTargetText = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return true;

  // translate the tags from notes into an array of strings for easy parsing.
  const notedata = referenceData.note.split(/[\r\n]+/);

  // the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetText;

  // start with the default of true
  let showTargetText = true;

  // check all the tags from the notes.
  notedata.forEach(line =>
  {
    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide the target text.
      showTargetText = false;
    }
  });

  // return the truth.
  return showTargetText;
};
//endregion Game_Enemy