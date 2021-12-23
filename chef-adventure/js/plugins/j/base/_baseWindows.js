/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] Mods/Adds for the various window object classes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A component of BASE.
 * This is a cluster of all changes/overwrites to the objects that would
 * otherwise be found in the rmmz_windows.js, such as Window_Gold. Also, any
 * new things that follow the pattern that defines a window object can be found
 * in here.
 * ============================================================================
 */

//#region WindowLayer
/**
 * OVERWRITE Renders windows, but WITH the ability to overlay.
 *
 * @param {PIXI.Renderer} renderer - The renderer.
 */
WindowLayer.prototype.render = function(renderer)
{
  if (!this.visible)
  {
    return;
  }

  const graphics = new PIXI.Graphics()
    , gl = renderer.gl
    , children = this.children.clone();

  renderer.framebuffer.forceStencil();
  graphics.transform = this.transform;
  renderer.batch.flush();
  gl.enable(gl.STENCIL_TEST);

  while (children.length > 0)
  {
    // draw from front to back instead of back to front.
    const win = children.shift();
    if (win._isWindow && win.visible && win.openness > 0)
    {
      gl.stencilFunc(gl.EQUAL, 0, ~0);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
      win.render(renderer);
      renderer.batch.flush();
      graphics.clear();
      // no "win.drawShape(graphics)" anymore.
      gl.stencilFunc(gl.ALWAYS, 1, ~0);
      gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
      gl.blendFunc(gl.ZERO, gl.ONE);
      graphics.render(renderer);
      renderer.batch.flush();
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
  }

  gl.disable(gl.STENCIL_TEST);
  gl.clear(gl.STENCIL_BUFFER_BIT);
  gl.clearStencil(0);
  renderer.batch.flush();

  for (const child of this.children)
  {
    if (!child._isWindow && child.visible)
    {
      child.render(renderer);
    }
  }

  renderer.batch.flush();
}
//#endregion WindowLayer

//#region Window_Command
/**
 * OVERWRITE Draws the color and icon along with the item itself in the command window.
 */
Window_Command.prototype.drawItem = function(index)
{
  const rect = this.itemLineRect(index);
  this.resetTextColor();
  this.changePaintOpacity(this.isCommandEnabled(index));
  let commandName = `${this.commandName(index)}`;
  commandName = this.handleColor(commandName, index);
  commandName = this.handleIcon(commandName, index);

  this.drawTextEx(commandName, rect.x + 4, rect.y, rect.width);
};

/**
 * Wraps the command in color if a color index is provided.
 * @param {string} command The comman as raw text.
 * @param {number} index The index of this command in the window.
 * @returns {string}
 */
Window_Command.prototype.handleColor = function(command, index)
{
  const commandColor = this.commandColor(index);
  if (commandColor)
  {
    command = `\\C[${commandColor}]${command}\\C[0]`;
  }

  return command;
};

/**
 * Prepends the icon for this command if applicable.
 * @param {string} command The comman as raw text.
 * @param {number} index The index of this command in the window.
 * @returns {string}
 */
Window_Command.prototype.handleIcon = function(command, index)
{
  const commandIcon = this.commandIcon(index);
  if (commandIcon)
  {
    command = `\\I[${commandIcon}]${command}`;
  }

  return command;
};

/**
 * Overwrites the `itemLineRect` (x starting coordinate for drawing) if there
 * is an icon to draw at the start of a command.
 * @returns {Rectangle}
 */
J.BASE.Aliased.Window_Command.itemLineRect = Window_Command.prototype.itemLineRect;
Window_Command.prototype.itemLineRect = function(index)
{
  const commandIcon = this.commandIcon(index);
  if (commandIcon)
  {
    let baseRect = J.BASE.Aliased.Window_Command.itemLineRect.call(this, index);
    //baseRect.x += 32;
    return baseRect;
  }
  else
  {
    return J.BASE.Aliased.Window_Command.itemLineRect.call(this, index);
  }
};

/**
 * Retrieves the icon for the given command in the window if it exists.
 * @param {number} index the index of the command.
 * @returns {number} The icon index for the command, or 0 if it doesn't exist.
 */
Window_Command.prototype.commandIcon = function(index)
{
  return this._list[index].icon;
};

/**
 * Retrieves the color for the given command in the window if it exists.
 * @param {number} index the index of the command.
 * @returns {number} The color index for the command, or 0 if it doesn't exist.
 */
Window_Command.prototype.commandColor = function(index)
{
  return this._list[index].color;
};

/**
 * An overload for the `addCommand()` function that adds additional metadata to a command.
 * @param {string} name The visible name of this command.
 * @param {string} symbol The symbol for this command.
 * @param {boolean} enabled Whether or not this command is enabled.
 * @param {object} ext The extra data for this command.
 * @param {number} icon The icon index for this command.
 * @param {number} color The color index for this command.
 */
Window_Command.prototype.addCommand = function(
  name,
  symbol,
  enabled = true,
  ext = null,
  icon = 0,
  color = 0,
)
{
  this._list.push({name, symbol, enabled, ext, icon, color});
};
//#endregion Window_Command

//#region Window_MoreData
/**
 * A window designed to display "more" data.
 * "More" data is typically defined as parameters not found otherwise listed
 * in the screens these lists usually reside in.
 */
class Window_MoreData
  extends Window_Command
{
  /**
   * The various types supported by "more data" functionality.
   */
  static Types = {
    /** The weapon type. */
    Weapon: "Weapon",

    /** The armor type. */
    Armor: "Armor",

    /** The skill type. */
    Skill: "Skill",

    /** The item type. */
    Item: "Item",

    /** Unknown type, if somehow some other type found its way in there. */
    Unknown: "Unknown",
  };

  /**
   * @constructor
   * @param {Rectangle} rect A rectangle that represents the shape of this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
    this.initMembers();
    this.refresh();
  };

  /**
   * Initializes all properties of this method.
   */
  initMembers()
  {
    /**
     * The item we're displaying more data for.
     */
    this.item = null;

    /**
     * The type of item we're displaying in the more data window.
     * @type {string}
     */
    this.type = null;

    /**
     * The actor used to perform parameter calculations against.
     * @type {Game_Actor}
     */
    this.actor = null;
  };

  /**
   * Sets an item to this window to display more data for.
   * @param {rm.types.BaseItem} newItem The item to set for this window.
   */
  setItem(newItem)
  {
    this.item = newItem;
    this.refresh();
  };

  /**
   * Sets the actor of this window for performing parameter calculations against.
   * @param {Game_Actor} newActor The new actor.
   */
  setActor(newActor)
  {
    this.actor = newActor;
    this.refresh();
  };

  /**
   * Refreshes this window by clearing it and redrawing all its contents.
   */
  refresh()
  {
    super.refresh();
    if (this.item)
    {
      this.determineItemType();
    }
  };

  /**
   * Updates the type of item this is.
   */
  determineItemType()
  {
    switch (true)
    {
      case DataManager.isItem(this.item):
        this.type = Window_MoreData.Types.Item;
        break;
      case DataManager.isSkill(this.item):
        this.type = Window_MoreData.Types.Skill;
        break;
      case DataManager.isArmor(this.item):
        this.type = Window_MoreData.Types.Armor;
        break;
      case DataManager.isWeapon(this.item):
        this.type = Window_MoreData.Types.Weapon;
        break;
      default:
        this.type = Window_MoreData.Types.Unknown;
        console.warn('was provided an unknown item type to display more data for.', this.item);
        break;
    }
  };

  /**
   * Determines whether or not the selected row is a weapon or not.
   * @returns {boolean}  True if this is a weapon, false otherwise.
   */
  weaponSelected()
  {
    return this.type === Window_MoreData.Types.Weapon;
  };

  /**
   * Determines whether or not the selected row is an armor or not.
   * @returns {boolean}  True if this is an armor, false otherwise.
   */
  armorSelected()
  {
    return this.type === Window_MoreData.Types.Armor;
  };

  /**
   * Determines whether or not the selected row is an item or not.
   * @returns {boolean}  True if this is an item, false otherwise.
   */
  itemSelected()
  {
    return this.type === Window_MoreData.Types.Item;
  };

  /**
   * Determines whether or not the selected row is a skill or not.
   * @returns {boolean}  True if this is a skill, false otherwise.
   */
  skillSelected()
  {
    return this.type === Window_MoreData.Types.Skill;
  };

  /**
   * Creates a command list for this menu.
   */
  makeCommandList()
  {
    if (this.item)
    {
      // this.addCommand(`More ${this.type} Data`, null, true, null, 2568, 1);
      // this.addCommand(`${this.item.name}`, null, true, null, this.item.iconIndex, 0);
      this.adjustWindowHeight();
    }
  };

  /**
   * Readjusts the height of the command window to match the number of commands.
   */
  adjustWindowHeight()
  {
    const magicHeight = 800;
    const calculatedHeight = (this._list.length + 1) * (this.lineHeight() + 8) - 16;
    if (calculatedHeight >= magicHeight)
    {
      this.height = magicHeight;
    }
    else
    {
      this.height = calculatedHeight;
    }
  };
};
//#endregion Window_MoreData

//#region Window_Selectable
/**
 * Weaves in the "more data window" at the highest level of selectable.
 *
 * It can be added to any window that extends this or its subclasses.
 */
J.BASE.Aliased.Window_Selectable.initialize = Window_Selectable.prototype.initialize;
Window_Selectable.prototype.initialize = function(rect)
{
  J.BASE.Aliased.Window_Selectable.initialize.call(this, rect);
  /**
   * The "more data" window. Used for further elaborating on a particular selection.
   *
   * @type {Window_MoreData}
   */
  this._moreDataWindow = null;
};

J.BASE.Aliased.Window_Selectable.processHandling = Window_Selectable.prototype.processHandling;
Window_Selectable.prototype.processHandling = function()
{
  if (this.isOpenAndActive())
  {
    if (this.isMoreEnabled() && this.isMoreTriggered())
    {
      return this.processMore();
    }
  }

  return J.BASE.Aliased.Window_Selectable.processHandling.call(this);
};

/**
 * Gets whether or not "more" data has been provided.
 * @returns {boolean}  True if "more" is handled, false otherwise.
 */
Window_Selectable.prototype.isMoreEnabled = function()
{
  return this.isHandled("more");
};

/**
 * Gets whether or not the "more" button is pressed/held.
 * @returns {boolean} True if the "more" button is pressed/held, false otherwise.
 */
Window_Selectable.prototype.isMoreTriggered = function()
{
  return this._canRepeat ? Input.isRepeated("shift") : Input.isTriggered("shift");
};

/**
 * Processes the "more" functionality.
 */
Window_Selectable.prototype.processMore = function()
{
  this.playCursorSound();
  this.updateInputData();
  this.callMoreHandler();
};

/**
 * Calls the given handler provided by the "more" symbol.
 */
Window_Selectable.prototype.callMoreHandler = function()
{
  this.callHandler("more");
};

/**
 * Extends the `.select()` to include a hook for executing logic onIndexChange.
 */
J.BASE.Aliased.Window_Selectable.select = Window_Selectable.prototype.select;
Window_Selectable.prototype.select = function(index)
{
  const previousIndex = this._index;
  J.BASE.Aliased.Window_Selectable.select.call(this, index);
  if (previousIndex !== this._index)
  {
    this.onIndexChange();
  }
};

/**
 * Designed for overriding to weave in functionality on-change of the index.
 */
Window_Selectable.prototype.onIndexChange = function()
{
};
//#endregion Window_Selectable
//ENDFILE