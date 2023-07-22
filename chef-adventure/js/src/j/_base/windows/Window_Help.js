
/**
 * Gets the text from this help window.
 * @returns {string}
 */
Window_Help.prototype.getText = function()
{
  return this._text;
};

/**
 * Sets the text of this help window to the given text.
 * Will short-circuit if the given text it is the same as the current text.
 * @param {string} text The given text to set this help window to.
 */
Window_Help.prototype.setText = function(text)
{
  // if the text doesn't need to be set, then do not set it.
  if (!this.canSetText(text)) return;

  // grab the secondary newline character.
  const secondaryNewline = this.getSecondaryNewline();

  // split the message into multiple pieces according to our secondary newline.
  const messagePieces = text.split(secondaryNewline);

  // check if we need to stitch together the message with newlines.
  const needsMessageComposition = messagePieces.length > 1;

  // initialize the message to empty.
  const message = needsMessageComposition
    ? this.buildMessage(messagePieces)
    : text;

  // actually set the text.
  this._text = message;

  // refresh the window.
  this.refresh();
};

/**
 * Builds a message from a collection of message pieces.
 * @param {string[]} messagePieces The collection of message pieces.
 * @returns {string} A single string with additional new lines based on the collection size.
 */
Window_Help.prototype.buildMessage = function(messagePieces)
{
  // initialize the message to empty.
  let message = String.empty;

  // iterate over each message segment.
  messagePieces.forEach((messagePiece, index) =>
  {
    // concatenate the message piece onto the overall message.
    message += `${messagePieces.at(index)}`;

    // check if there is another line after this one.
    if (messagePieces.at(index + 1))
    {
      // add a new line marker.
      message += `\n`;
    }
  });

  // assign the text.
  return message;
};

/**
 * Determines whether or not the given text can be set.
 * @param {string} newText The new text to set.
 * @returns {boolean} True if the given text can be set, false otherwise.
 */
Window_Help.prototype.canSetText = function(newText)
{
  // if the current text is the same as the new text, do not set it.
  if (this.getText() === newText) return false;

  // set the text!
  return true;
};

/**
 * Gets the newline character other than "\n".
 * @returns {string}
 */
Window_Help.prototype.getSecondaryNewline = function()
{
  return "|";
};

/**
 * Overwrites {@link #refresh}.
 * Extracts the text rendering out into its own function, but this function
 * still does the same thing: clears and redraws the contents of the window.
 */
Window_Help.prototype.refresh = function() 
{
  // clear the contents of the window.
  this.contents.clear();

  // render the text.
  this.renderText();
};

/**
 * Renders the text associated with this help window.
 */
Window_Help.prototype.renderText = function()
{
  // grab the rectangle coordinates to draw the text in.
  const { x, y, width } = this.baseTextRect();

  // draw the actual text.
  this.drawTextEx(this._text, x, y, width);
};