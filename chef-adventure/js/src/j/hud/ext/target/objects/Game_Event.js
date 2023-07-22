//region Game_Event
/**
 * Gets the icon index of the target frame icon.
 * If none are present or valid, then the default will be 0 (no icon).
 * @returns {string|String.empty}
 */
Game_Event.prototype.getTargetFrameText = function()
{
  // start with the default empty string.
  let targetFrameText = String.empty;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no text.
  if (!commentCommands.length) return targetFrameText;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.TargetFrameText;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const comment = command.parameters[0];

    // check if any comment matches the structure.
    if (structure.test(comment))
    {
      // parse the found tag.
      targetFrameText = RegExp.$1;
    }
  });

  // return the found text.
  return targetFrameText;
};

/**
 * Gets the icon index of the target frame icon.
 * If none are present or valid, then the default will be 0 (no icon).
 * @returns {number}
 */
Game_Event.prototype.getTargetFrameIcon = function()
{
  // start with the default icon index of 0.
  let targetFrameIcon = 0;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no icon.
  if (!commentCommands.length) return targetFrameIcon;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.TargetFrameIcon;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const comment = command.parameters[0];

    // check if any comment matches the structure.
    if (structure.test(comment))
    {
      // parse the found tag.
      targetFrameIcon = parseInt(RegExp.$1);
    }
  });

  // return the found icon.
  return targetFrameIcon;
};

/**
 * Gets whether or not this event is explicitly hiding the target frame.
 * The default is to show the frame.
 * @returns {boolean} True if we should show the target frame, false otherwise.
 */
Game_Event.prototype.canShowTargetFrame = function()
{
  // start with the default of true.
  let showTargetFrame = true;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no icon.
  if (!commentCommands.length) return showTargetFrame;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetFrame;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const line = command.parameters[0];

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
 * Gets whether or not this event is explicitly hiding the hp bar.
 * The default is to show the bar.
 * @returns {boolean} True if we should show the bar, false otherwise.
 */
Game_Event.prototype.showTargetHpBar = function()
{
  // start with the default of true.
  let showHpBar = J.HUD.EXT.TARGET.Metadata.EnableHP;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no icon.
  if (!commentCommands.length) return showHpBar;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetHP;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const line = command.parameters[0];

    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide it.
      showHpBar = false;
    }
  });

  // return the truth.
  return showHpBar;
};

/**
 * Gets whether or not this event is explicitly hiding the mp bar.
 * The default is to show the bar.
 * @returns {boolean} True if we should show the bar, false otherwise.
 */
Game_Event.prototype.showTargetMpBar = function()
{
  // start with the default of true.
  let showMpBar = J.HUD.EXT.TARGET.Metadata.EnableMP;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no icon.
  if (!commentCommands.length) return showMpBar;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetMP;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const line = command.parameters[0];

    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide it.
      showMpBar = false;
    }
  });

  // return the truth.
  return showMpBar;
};

/**
 * Gets whether or not this event is explicitly hiding the tp bar.
 * The default is to show the bar.
 * @returns {boolean} True if we should show the bar, false otherwise.
 */
Game_Event.prototype.showTargetTpBar = function()
{
  // start with the default of true.
  let showTpBar = J.HUD.EXT.TARGET.Metadata.EnableTP;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no icon.
  if (!commentCommands.length) return showTpBar;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetTP;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const line = command.parameters[0];

    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide it.
      showTpBar = false;
    }
  });

  // return the truth.
  return showTpBar;
};

/**
 * Gets whether or not this event is explicitly hiding the target text.
 * The default is to show the text.
 * @returns {boolean} True if we should show the text, false otherwise.
 */
Game_Event.prototype.showTargetText = function()
{
  // start with the default of true.
  let showText = true;

  // get the list of valid event commands that are comments.
  const commentCommands = this.getValidCommentCommands();

  // if there are none, then we show no icon.
  if (!commentCommands.length) return showText;

  // encapsulate the RegExp structure to match.
  const structure = J.HUD.EXT.TARGET.RegExp.HideTargetText;

  // check all the valid event commands to see if we have a reason to hide it.
  commentCommands.forEach(command =>
  {
    // shorthand the comment into a variable.
    const line = command.parameters[0];

    // check if any line matches the structure.
    if (structure.test(line))
    {
      // if this tag exists, then hide it.
      showText = false;
    }
  });

  // return the truth.
  return showText;
};
//endregion Game_Event