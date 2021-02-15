//=============================================================================
// VisuStella MZ - Items & Equips Core
// VisuMZ_1_ItemsEquipsCore.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_1_ItemsEquipsCore = true;

var VisuMZ = VisuMZ || {};
VisuMZ.ItemsEquipsCore = VisuMZ.ItemsEquipsCore || {};
VisuMZ.ItemsEquipsCore.version = 1.19;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 1] [Version 1.19] [ItemsEquipsCore]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Items_and_Equips_Core_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Items & Equips Core makes improvements to the RPG Maker MZ item and
 * equipment dedicated scenes (including the shop) and how they're handled.
 * From more item categories, better parameter control, rulings, and more, game
 * devs are able to take control over key aspects of their game's items.
 *
 * Features include all (but not limited to) the following:
 *
 * * Modifying the appearances to the Item Scene, Equip Scene, and Shop Scene.
 * * Categorizing items in unique and multiple categories.
 * * Item Scene and Shop Scene will now display detailed information on items.
 * * NEW! marker can be displayed over recently acquired items in-game.
 * * Equipment notetags to adjust parameters past the editor limitations.
 * * Equipment Rulings to adjust what slot types can and can't be unequipped
 *   and/or optimized.
 * * Equipment Type Handling offers more control over equipment loadouts.
 * * Items sold in shops can be hidden/shown based on Switches.
 * * Items sold in shops can have varying prices adjusted by notetags.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 1 ------
 *
 * This plugin is a Tier 1 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 *
 * ============================================================================
 * Major Changes: New Hard-Coded Features
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * Equipment Type Handling
 *
 * - Characters will no longer have one universal equipment slot setting.
 * Classes can have different equipment type loadouts, made possible through
 * the usage of notetags. Also, equipment types of matching names would be
 * treated as the same type, where previously, they would be different types.
 * This means if you have two "Accessory" slots, be it in the form of notetags
 * or through the Database > Types tab, they can both equip the same type of
 * accessories.
 *
 * - The Change Equip event command is now updated to reflect this new change.
 * When processing an equip change, the slot changed will go to the first
 * empty slot of matching type. If all of the actor's matching slot types are
 * equipped, then the equip will replace the last slot available.
 *
 * ---
 *
 * Shop Status Window
 *
 * - The Status Window found in the Shop Scene was originally barren and did
 * not display much information at all. This is changed through this plugin's
 * new features. While the contents of the Shop Status Window can be customized
 * through the Plugin Parameters, it is a change that cannot be reversed and
 * for the better since it gives players the much needed information revolving
 * around the game's items.
 *
 * ---
 *
 * Core Engine Compatibility: Modern Controls
 *
 * - If the VisuStella Core Engine is added to your game with Modern Controls
 * enabled, then the Item Menu Scene, Equip Menu Scene, and Shop Menu Scene's
 * controls will be changed a bit.
 *
 * - The Item Menu Scene will automatically have the Item List Window active,
 * with using the Left/Right (for singul column) or Page Up/Page Down (for
 * multi-columns) to navigate between the Item Categories. Similar will occur
 * when trying to sell items in the Shop Menu Scene.
 *
 * - The Equip Menu Scene will automatically have the Equip Slots Window active
 * and only activate the command window upon moving up to it.
 *
 * ---
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * The following are notetags that have been added through this plugin. These
 * notetags will not work with your game if this plugin is OFF or not present.
 *
 * === General ===
 * 
 * These notetags affect the Items, Weapons, and Armors on a general scale.
 *
 * ---
 *
 * <Max: x>
 *
 * - Used for: Item, Weapon, Armor Notetags
 * - Determines the maximum quantity that can be held for this item.
 * - Replace 'x' with a number value to determine the maximum amount.
 *
 * ---
 *
 * <Color: x>
 * <Color: #rrggbb>
 *
 * - Used for: Item, Weapon, Armor, Skill Notetags
 * - Determines the color of the object inside the in-game menus.
 * - Replace 'x' with a number value depicting a window text color.
 * - Replace 'rrggbb' with a hex color code for a more custom color.
 *
 * ---
 *
 * <Category: x>
 *
 * - Used for: Item, Weapon, Armor Notetags
 * - Arranges items into certain/multiple categories to work with the Category
 *   Plugin Parameter setting: "Category:x".
 * - Replace 'x' with a category name to mark this item as.
 *
 * ---
 *
 * <Categories>
 *  x
 *  x
 * </Categories>
 *
 * - Used for: Item, Weapon, Armor Notetags
 * - Arranges items into certain/multiple categories to work with the Category
 *   Plugin Parameter setting: "Category:x".
 * - Replace each 'x' with a category name to mark this item as.
 *
 * ---
 *
 * === Item Accessibility Notetags ===
 *
 * The following notetags allow you to choose when items can/cannot be used
 * based on switches.
 *
 * ---
 *
 * <Enable Switch: x>
 *
 * <Enable All Switches: x,x,x>
 * <Enable Any Switches: x,x,x>
 *
 * - Used for: Item Notetags
 * - Determines the enabled status of the item based on switches.
 * - Replace 'x' with the switch ID to determine the item's enabled status.
 * - If 'All' notetag variant is used, item will be disabled until all
 *   switches are ON. Then, it would be enabled.
 * - If 'Any' notetag variant is used, item will be enabled if any of the
 *   switches are ON. Otherwise, it would be disabled.
 *
 * ---
 *
 * <Disable Switch: x>
 *
 * <Disable All Switches: x,x,x>
 * <Disable Any Switches: x,x,x>
 *
 * - Used for: Item Notetags
 * - Determines the enabled status of the item based on switches.
 * - Replace 'x' with the switch ID to determine the item's enabled status.
 * - If 'All' notetag variant is used, item will be enabled until all switches
 *   are ON. Then, it would be disabled.
 * - If 'Any' notetag variant is used, item will be disabled if any of the
 *   switches are ON. Otherwise, it would be enabled.
 *
 * ---
 *
 * === JavaScript Notetags: Item Accessibility ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * determine if an item can be accessible by code.
 *
 * ---
 *
 * <JS Item Enable>
 *  code
 *  code
 *  enabled = code;
 * </JS Item Enable>
 *
 * - Used for: Item Notetags
 * - Determines the enabled status of the item based on JavaScript code.
 * - If the actor this is disabled for is the only party member, it will not be
 *   visible in the item list unless the VisuStella Battle Core is installed.
 *   - If the VisuStella Battle Core is installed, then all battle scope items
 *     will be visible even if they're disabled.
 * - Replace 'code' to determine the type enabled status of the item.
 * - The 'enabled' variable returns a boolean (true/false) to determine if the
 *   item will be enabled or not.
 * - The 'user' variable refers to the user with the item.
 * - The 'item' variable refers to the item being checked.
 * - All other item conditions must be met in order for this to code to count.
 *
 * ---
 *
 * === Equipment Notetags ===
 *
 * The following notetags provide equipment-related effects from deciding what
 * equip slots can be given to classes to the base parameter changes asigned
 * to weapons and armors.
 *
 * ---
 *
 * <Equip Slots>
 *  slotName
 *  slotName
 *  slotName
 * </Equip Slots>
 *
 * - Used for: Class Notetags
 * - Changes the equipment slot loadout for any actor who is that class.
 * - Replace 'slotName' with an Equipment Type name from Database > Types.
 *   This is case-sensitive.
 * - Insert or remove as many "slotName" equipment types as needed.
 *
 * ---
 *
 * <param: +x>
 * <param: -x>
 *
 * - Used for: Weapon, Armor Notetags
 * - Changes the base parameter value for the equip item.
 * - Replace 'param' with any of the following: 'MaxHP', 'MaxMP', 'ATK', 'DEF',
 *   'MAT', 'MDF', 'AGI', or 'LUK' to change that specific parameter's value.
 * - Replace 'x' with a number value to set the parameter value to.
 * - This allows you to bypass the Database Editor's number limitations.
 *
 * ---
 * 
 * <Equip Copy Limit: x>
 * 
 * - Used for: Weapon, Armor Notetags
 * - Sets a maximum number of copies that the actor can wear of this equipment.
 * - Replace 'x' with a number value to determine the copy limit.
 * - This can be bypassed using Event Commands and/or Script Calls.
 * - Usage Example: Actors can only equip one copy of the "One-of-a-Kind Ring"
 *   on at any time despite having empty accessory slots because the ring has a
 *   <Equip Copy Limit: 1> notetag.
 * 
 * ---
 * 
 * <Equip Weapon Type Limit: x>
 * 
 * - Used for: Weapon
 * - This weapon cannot be equipped with other weapons of the same type once
 *   the limited amount has been reached.
 * - Replace 'x' with a number value to determine the weapon type limit.
 * - This can be bypassed using Event Commands and/or Script Calls.
 * - Usage Example: A dualwielding warrior who can only equip one sword and a
 *   dagger but never two swords or two daggers because the swords and daggers
 *   all have the <Equip Weapon Type Limit: 1> notetags on them.
 * 
 * ---
 * 
 * <Equip Armor Type Limit: x>
 * 
 * - Used for: Armor
 * - This armor cannot be equipped with other armors of the same type once the
 *   limited amount has been reached.
 * - Replace 'x' with a number value to determine the armor type limit.
 * - This can be bypassed using Event Commands and/or Script Calls.
 * - Usage Example: People cannot equip more than two glove accessories on at a
 *   time because the glove is a "Glove" armor-type and each glove item has the
 *   <Equip Armor Type Limit: 2> notetags on them.
 * 
 * ---
 *
 * === JavaScript Notetags: Equipment ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * adjust the parameter through code.
 *
 * ---
 *
 * <JS Parameters>
 *  MaxHP = code;
 *  MaxMP = code;
 *  ATK = code;
 *  DEF = code;
 *  MAT = code;
 *  MDF = code;
 *  AGI = code;
 *  LUK = code;
 * </JS Parameters>
 *
 * - Used for: Weapon, Armor Notetags
 * - Uses JavaScript to determine the values for the basic parameters based on
 *   the code used to calculate its value.
 * - The variables 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI', and
 *   'LUK' are used to determine the finalized value of the parameter. This
 *   variable is case sensitive.
 * - If a parameter is not present, its value will be treated as +0.
 *
 * ---
 *
 * === Status Window Notetags ===
 *
 * The following notetags will affect the Shop Status Window info. If for any
 * reason the data that is displayed is not to your liking or insufficient,
 * you can change it up using the following notetags.
 *
 * ---
 *
 * <Status Info>
 *  key: data
 *  key: data
 *  key: data
 * </Status Info>
 *
 * - Used for: Skill, Item, Weapon, Armor Notetags
 * - If you do not like the generated data that's displayed, you can change it
 *   using this notetag to display what you want.
 * - Replace 'key' with one of the following:
 *   - Consumable
 *   - Quantity
 *   - Occasion
 *   - Scope
 *   - Speed
 *   - Success Rate
 *   - Repeat
 *   - Hit Type
 *   - Element
 *   - Damage Multiplier
 *   - HP Recovery
 *   - MP Recovery
 *   - TP Recovery
 *   - HP Damage
 *   - MP Damage
 *   - TP Damage
 *   - User TP Gain
 *   - Added Effects
 *   - Removed Effects
 * - Replace 'data' with the text data you want to visually appear. You may use
 *   text codes for this.
 * - This only affects info entries that are already visible and won't make
 *   other categories suddenly appear.
 * - Insert or remove as many "key: data" lines as needed.
 *
 * ---
 *
 * <Custom Status Info>
 *  key: data
 *  key: data
 *  key: data
 * </Custom Status Info>
 *
 * - Used for: Skill, Item
 * - If you want custom categories and data to be displayed for your items that
 *   aren't provided by the Shop Status Window Info to begin with, you can use
 *   this notetag to add in your own entries.
 * - Replace 'key' with text of the exact label you want. You may use text
 *   codes for this.
 * - Replace 'data' with text of the exact text data you want. You may use text
 *   codes for this.
 * - Insert or remove as many "key: data" lines as needed.
 *
 * ---
 *
 * === Shop Menu Notetags ===
 *
 * These notetags adjust how prices and such are managed inside the Shop Menu
 * as well as whether or not some items are visible depending on switch states.
 *
 * ---
 *
 * <Price: x>
 *
 * - Used for: Item, Weapon, Armor Notetags
 * - Adjusts the buying price for this item.
 * - Replace 'x' with a number depicting the desired value for the buy price.
 * - This allows you to bypass the RPG Maker MZ editor's limitation of 999,999.
 *
 * ---
 *
 * <Can Sell>
 * <Cannot Sell>
 *
 * - Used for: Item, Weapon, Armor Notetags
 * - Makes the item either always sellable or cannot be sold.
 * - This bypasses the game's internal hard-coding to prevent items with a
 *   price of 0 from being able to be sold.
 * - This bypasses the game's internal hard-coding to always allow items with
 *   a price value of being able to be sold.
 *
 * ---
 *
 * <Sell Price: x>
 *
 * - Used for: Item, Weapon, Armor Notetags
 * - Changes the sell price to be something different than the default amount.
 * - Replace 'x' with a number depicting the desired value for the sell price.
 *
 * ---
 *
 * <Show Shop Switch: x>
 *
 * <Show Shop All Switches: x,x,x>
 * <Show Shop Any Switches: x,x,x>
 *
 * - Used for: Item, Weapon, Armor Notetags
 * - Determines the visibility of the shop item based on switches.
 * - Replace 'x' with the switch ID to determine the shop item's visibility.
 * - If 'All' notetag variant is used, item will be hidden until all switches
 *   are ON. Then, it would be shown.
 * - If 'Any' notetag variant is used, item will be shown if any of the
 *   switches are ON. Otherwise, it would be hidden.
 *
 * ---
 *
 * <Hide Shop Switch: x>
 *
 * <Hide Shop All Switches: x,x,x>
 * <Hide Shop Any Switches: x,x,x>
 *
 * - Used for: Item, Weapon, Armor Notetags
 * - Determines the visibility of the shop item based on switches.
 * - Replace 'x' with the switch ID to determine the shop item's visibility.
 * - If 'All' notetag variant is used, item will be shown until all switches
 *   are ON. Then, it would be hidden.
 * - If 'Any' notetag variant is used, item will be hidden if any of the
 *   switches are ON. Otherwise, it would be shown.
 *
 * ---
 *
 * <Cannot Sell Switch: x>
 *
 * <Cannot Sell All Switches: x,x,x>
 * <Cannot Sell Any Switches: x,x,x>
 *
 * - Used for: Item, Weapon, Armor Notetags
 * - Determines the sellability of the shop item based on switches.
 * - Replace 'x' with the switch ID to determine the shop item's sellability.
 * - If 'All' notetag variant is used, item cannot be sold until all switches
 *   are ON. Otherwise, it can be sold.
 * - If 'Any' notetag variant is used, item cannot be sold if any of the
 *   switches are ON. Otherwise, it can be sold.
 *
 * ---
 *
 * === JavaScript Notetags: Shop Menu ===
 *
 * The following are notetags made for users with JavaScript knowledge. These
 * notetags are primarily aimed at Buy and Sell prices.
 *
 * ---
 *
 * <JS Buy Price>
 *  code
 *  code
 *  price = code;
 * </JS Buy Price>
 *
 * - Used for: Item, Weapon, Armor Notetags
 * - Replace 'code' to determine the buying 'price' of the item.
 * - Insert the final buy price into the 'price' variable.
 * - The 'item' variable refers to the item being bought.
 *
 * ---
 *
 * <JS Sell Price>
 *  code
 *  code
 *  price = code;
 * </JS Sell Price>
 *
 * - Used for: Item, Weapon, Armor Notetags
 * - Replace 'code' to determine the selling 'price' of the item.
 * - Insert the final sell price into the 'price' variable.
 * - The 'item' variable refers to the item being sold.
 *
 * ---
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 * 
 * === Actor Plugin Commands ===
 * 
 * ---
 *
 * Actor: Change Equip Slots
 * - Forcefully change the actor(s) equip slots.
 * - These will persist through class changes.
 *
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 *
 *   Equip Slots:
 *   - Insert the equip slots you want the actor(s) to have.
 *   - These entries are case-sensitive.
 *
 * ---
 *
 * Actor: Reset Equip Slots
 * - Reset any forced equip slots for the actor(s).
 * - Equip slots will then be based on class.
 *
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 *
 * ---
 * 
 * === Shop Plugin Commands ===
 * 
 * ---
 *
 * Shop: Advanced
 * - Make it easier to put together inventories for a shop.
 * - WARNING: Does not allow for event-specific prices.
 *
 *   Step 1: Item ID's
 *   - Select which Item ID ranges to add.
 *
 *   Step 2: Weapon ID's
 *   - Select which Weapon ID ranges to add.
 *
 *   Step 3: Armor ID's
 *   - Select which Armor ID ranges to add.
 *
 *   Step 4: Purchase Only?
 *   - Make the shop purchase-only?
 * 
 *   Optional:
 * 
 *     Blacklist
 *     - A list of categories to blacklist from the shop.
 *     - Not used if empty. Mark categories with <Category: x>
 * 
 *     Whitelist
 *     - A list of categories to whitelist for the shop.
 *     - Not used if empty. Mark categories with <Category: x>
 *
 * This Plugin Command primarily functions as an alternative to the editor's
 * "Shop Processing" event command as that one requires you to add items one at
 * a time, making it extremely tedious to add large amounts of items. This
 * Plugin Command will mitigate that by allowing ID ranges to determine which
 * items to make available.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Item Menu Settings
 * ============================================================================
 *
 * The Item Menu Settings allow you to adjust specifics on how key objects and
 * windows in the Item Menu Scene operate.
 *
 * ---
 *
 * General Window
 *
 *   Use Updated Layout:
 *   - Use the Updated Item Menu Layout provided by this plugin?
 *   - This will automatically enable the Status Window.
 *   - This will override the Core Engine windows settings.
 *
 *   Layout Style:
 *   - If using an updated layout, how do you want to style the menu scene?
 *     - Upper Help, Left Input
 *     - Upper Help, Right Input
 *     - Lower Help, Left Input
 *     - Lower Help, Right Input
 *
 * ---
 *
 * List Window
 * 
 *   Columns:
 *   - Number of maximum columns.
 *
 * ---
 *
 * Item Quantity
 *
 *   Item Max:
 *   Weapon Max:
 *   Armor Max:
 *   - The default maximum quantity for items, weapons, and/or armors.
 * 
 *   Quantity Format:
 *   - How to display an item's quantity.
 *   - %1 - Item Quantity
 *
 *   Font Size:
 *   - Default font size for item quantity.
 *
 * ---
 *
 * Shop Status Window
 * 
 *   Show in Item Menu?:
 *   - Show the Shop Status Window in the Item Menu?
 *   - This is enabled if the Updated Layout is on.
 *
 *   Adjust List Window?:
 *   - Automatically adjust the Item List Window in the Item Menu if using the
 *     Shop Status Window?
 * 
 *   Background Type:
 *   - Select background type for this window.
 *     - 0 - Window
 *     - 1 - Dim
 *     - 2 - Transparent
 *
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this Status Window in the
 *     Item Menu.
 *
 * ---
 *
 * Button Assist Window
 *
 *   Switch Category:
 *   - Button assist text used for switching categories.
 *   - For VisuStella MZ's Core Engine's Button Assist Window.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Item Categories
 * ============================================================================
 *
 * Item Categories appear both in the Item Menu Scene and Shop Menu Scene (but
 * only under the Sell command). These Plugin Parameters give you the ability
 * to add in the specific categories you want displayed, remove the ones you
 * don't, and associate them with icons.
 *
 * ---
 *
 * List
 *
 *   Category List
 *   - A list of the item categories displayed in the Item/Shop menus.
 * 
 *     Type:
 *     - A list of the item categories displayed in the Item/Shop menus.
 *     - Replace x with ID numbers or text.
 *     - AllItems, RegularItems, KeyItems
 *     - HiddenItemA, HiddenItemB
 *     - Consumable, Nonconsumable
 *     - AlwaysUsable, BattleUsable, FieldUsable, NeverUsable
 *     - AllWeapons, WType:x
 *     - AllArmors, AType:x, EType:x
 *     - Category:x
 * 
 *     Icon:
 *     - Icon used for this category.
 *     - Use 0 for no icon.
 * 
 *     Visibility Switch:
 *     - This Switch must be turned ON in order for the category to show.
 *     - Use 0 for no Switch requirement.
 *
 *   Style:
 *   - How do you wish to draw categorie entries in the Category Window?
 *   - Text Only: Display only the text.
 *   - Icon Only: Display only the icon.
 *   - Icon + Text: Display the icon first, then the text.
 *   - Auto: Determine which is better to use based on the size of the cell.
 *
 *   Text Alignment
 *   - Decide how you want the text to be aligned.
 *
 * ---
 *
 * Vocabulary
 *
 *   Hidden Item A
 *   Hidden Item B
 *   Consumable
 *   Nonconsumable
 *   Always Usable
 *   Battle Usable
 *   Field Usable
 *   Never Usable
 *   - How these categories are named in the Item Menu.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: NEW! Labels
 * ============================================================================
 *
 * Whenever the player receives a new item(s), a NEW! Label can be placed on
 * top of the item's icon when browsing a menu displaying the item(s). This is
 * a quality of life addition from more modern RPG's to help players figure out
 * what they've recently received. The following are Plugin Parameters made to
 * adjust how the NEW! Labels are handled in-game.
 *
 * ---
 *
 * NEW! Labels
 * 
 *   Use NEW! Labels?:
 *   - Use the NEW! Labels or not?
 * 
 *   Icon:
 *   - The icon index used to represent the NEW! text.
 *   - Use 0 to not draw any icons.
 * 
 *   Text:
 *   - The text written on the NEW! Label.
 * 
 *     Font Color:
 *     - Use #rrggbb for custom colors or regular numbers for text colors from
 *       the Window Skin.
 * 
 *     Font Size:
 *     - The font size used for the NEW! text.
 * 
 *   Fade Limit:
 *   - What's the upper opaque limit before reversing?
 * 
 *   Fade Speed:
 *   - What's the fade speed of the NEW! Label?
 * 
 *   Offset X:
 *   - How much to offset the NEW! Label's X position by.
 * 
 *   Offset Y:
 *   - How much to offset the NEW! Label's Y position by.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Equip Menu Settings
 * ============================================================================
 *
 * These Plugin Parameters adjust the Equipment Menu Scene, ranging from using
 * a more updated and modern layout, changing the styles of other windows, and
 * other key visual aspects of the Equip Menu Scene. Other settings here allow
 * you to adjust how equipment operate under certain rulings, too.
 *
 * ---
 *
 * General
 * 
 *   Use Updated Layout:
 *   - Use the Updated Equip Layout provided by this plugin?
 *   - This will override the Core Engine windows settings.
 * 
 *     Param Font Size:
 *     - The font size used for parameter values.
 * 
 *     Show Menu Portraits?:
 *     - If Main Menu Core is installed, display the Menu Portraits instead of
 *       the actor's face in the status window?
 * 
 *     JS: Portrait Upper:
 *     - If Menu Portraits are available, this is code used to draw the upper
 *       data like this in the Status Window.
 * 
 *     JS: Face Upper:
 *     - If faces used used, this is code used to draw the upper data like this
 *       in the Status Window.
 * 
 *     JS: Parameter Lower:
 *     - Code to determine how parameters are drawn in the Status Window.
 *
 *   Layout Style:
 *   - If using an updated layout, how do you want to style the menu scene?
 *     - Upper Help, Left Input
 *     - Upper Help, Right Input
 *     - Lower Help, Left Input
 *     - Lower Help, Right Input
 * 
 *   Status Window Width:
 *   - The usual width of the status window if using the non-Updated Equip
 *     Menu Layout.
 * 
 *   Show Back Rectangles?:
 *   - Show back rectangles of darker colors to display information better?
 * 
 *     Back Rectangle Color:
 *     - Use #rrggbb for custom colors or regular numbers for text colors
 *       from the Window Skin.
 *
 * ---
 *
 * Command Window
 * 
 *   Style:
 *   - How do you wish to draw commands in the Command Window?
 *   - Text Only: Display only the text.
 *   - Icon Only: Display only the icon.
 *   - Icon + Text: Display the icon first, then the text.
 *   - Auto: Determine which is better to use based on the size of the cell.
 * 
 *   Text Align:
 *   - Text alignment for the Command Window.
 * 
 *   Equip Icon:
 *   - The icon used for the Equip command.
 * 
 *   Add Optimize Command?:
 *   - Add the "Optimize" command to the Command Window?
 * 
 *     Optimize Icon:
 *     - The icon used for the Optimize command.
 * 
 *   Add Clear Command?:
 *   - Add the "Clear" command to the Command Window?
 * 
 *     Clear Icon:
 *     - The icon used for the Clear command.
 *
 * ---
 *
 * Remove Equip
 * 
 *   Icon:
 *   - Icon used for equipment removal.
 * 
 *   Text:
 *   - Text used for equipment removal.
 * 
 *   Use SHIFT Shortcut?:
 *   - Add the "Shift" button as a shortcut key to removing items?
 *
 * ---
 *
 * Rulings
 * 
 *   Equip-Adjust HP/MP:
 *   - Adjust HP/MP differences after changing equips with MaxHP/MaxMP values.
 * 
 *   Non-Removable Types:
 *   - Insert ID's of the Equipment Types that must always have an item
 *     equipped and cannot be empty.
 * 
 *   Non-Optomized Types:
 *   - Insert ID's of the Equipment Types that will be ignored when equipment
 *     is being optimized.
 *
 * ---
 *
 * Button Assist Window
 *
 *   SHIFT: Remove:
 *   - Button assist text used for the SHIFT Remove Shortcut.
 *   - For VisuStella MZ's Core Engine's Button Assist Window.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Shop Menu Settings
 * ============================================================================
 *
 * These Plugin Parameters allow you a number of options to adjust the Shop
 * Menu Scene. These options range from enabling an updated and modern layout,
 * adjust how various key visual aspects appear, and determine how prices can
 * be affected when it comes to selling them or buying them (for coders).
 *
 * ---
 *
 * General
 * 
 *   Use Updated Layout:
 *   - Use the Updated Shop Layout provided by this plugin?
 *   - This will override the Core Engine windows settings.
 *
 *   Layout Style:
 *   - If using an updated layout, how do you want to style the menu scene?
 *     - Upper Help, Left Input
 *     - Upper Help, Right Input
 *     - Lower Help, Left Input
 *     - Lower Help, Right Input
 *
 * ---
 *
 * Command Window
 * 
 *   Hide Unavailable?:
 *   - Hide all unavailable commands like when a shop is set to Purchase Only?
 * 
 *   Style:
 *   - How do you wish to draw commands in the Command Window?
 *   - Text Only: Display only the text.
 *   - Icon Only: Display only the icon.
 *   - Icon + Text: Display the icon first, then the text.
 *   - Auto: Determine which is better to use based on the size of the cell.
 * 
 *   Text Align:
 *   - Text alignment for the Command Window.
 * 
 *   Buy Icon:
 *   - The icon used for the Buy command.
 * 
 *   Sell Icon:
 *   - The icon used for the Sell command.
 * 
 *   Cancel Icon:
 *   - The icon used for the Cancel command.
 * 
 *   Rename "Cancel":
 *   - Rename Cancel to something more logical for the Shop Menu Scene.
 *
 * ---
 *
 * Prices
 * 
 *   Sell Price Rate:
 *   - The default sell price rate.
 * 
 *   JS: Buy Price:
 *   - Modificatons made to the buy price before finalizing it.
 * 
 *   JS: Sell Price:
 *   - Modificatons made to the sell price before finalizing it.
 *
 * ---
 *
 * Button Assist Window
 *
 *   Small Increment:
 *   Large Increment:
 *   - Text used for changing amount bought/sold.
 *   - For VisuStella MZ's Core Engine's Button Assist Window.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Shop Status Window
 * ============================================================================
 *
 * These Plugin Parameters focuses on the Shop Status Window and determines how
 * its data is displayed.
 *
 * ---
 *
 * General
 * 
 *   Window Width:
 *   - The usual width of the status window.
 * 
 *   Parameter Font Size:
 *   - Font size used for parameter changes.
 * 
 *   Translucent Opacity:
 *   - Opacity setting used for translucent window objects.
 * 
 *   Show Back Rectangles?:
 *   - Show back rectangles of darker colors to display information better?
 * 
 *     Back Rectangle Color:
 *     - Use #rrggbb for custom colors or regular numbers for text colors
 *       from the Window Skin.
 *
 * ---
 *
 * Equipment Data
 * 
 *   Already Equipped:
 *   - Marker used to show an actor cannot equip an item.
 * 
 *   Can't Equip:
 *   - Marker used to show an actor cannot equip an item.
 * 
 *   No Changes:
 *   - Marker used to show no changes have occurred.
 * 
 *   JS: Draw Equip Data:
 *   - Code used to draw the equipment data for the Shop Status Window.
 *
 * ---
 *
 * Item Data
 * 
 *   Max State/Buff Icons:
 *   - Maximum number of icons that can be displayed for Add/Remove
 *     States/Buffs.
 * 
 *   Multiplier Standard:
 *   - Constant standard to filter out random values when calculating the
 *     damage multiplier.
 * 
 *   JS: Draw Item Data:
 *   - Code used to draw the item data for the Shop Status Window.
 *
 * ---
 *
 * Vocabulary
 * 
 *   Consumable:
 *   Occasions:
 *   Scope:
 *   Speed:
 *   Success Rate:
 *   Repeats:
 *   Hit Type:
 *   Element:
 *   Damage Type:
 *   Effects:
 *   - Vocabulary used for these data entries.
 *   - Some of these have Plugin Parameters have sub-entries.
 * 
 *   NOTE: Regarding Damage Labels
 * 
 *   If Visu_1_BattleCore is installed, priority goes to its Damage Style
 *   settings. The label displayed is based on the damage style settings in
 *   place for that specific skill or item.
 * 
 *   Go to Battle Core > Plugin Parameters > Damage Settings > Style List >
 *   pick the damage style you want to edit > Damage Label and change the
 *   text settings you'd like there.
 *
 * ---
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 1. These plugins may be used in free or commercial games provided that they
 * have been acquired through legitimate means at VisuStella.com and/or any
 * other official approved VisuStella sources. Exceptions and special
 * circumstances that may prohibit usage will be listed on VisuStella.com.
 * 
 * 2. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "VisuStella".
 * 
 * 3. You may edit the source code to suit your needs, so long as you do not
 * claim the source code belongs to you. VisuStella also does not take
 * responsibility for the plugin if any changes have been made to the plugin's
 * code, nor does VisuStella take responsibility for user-provided custom code
 * used for custom control effects including advanced JavaScript notetags
 * and/or plugin parameters that allow custom JavaScript code.
 * 
 * 4. You may NOT redistribute these plugins nor take code from this plugin to
 * use as your own. These plugins and their code are only to be downloaded from
 * VisuStella.com and other official/approved VisuStella sources. A list of
 * official/approved sources can also be found on VisuStella.com.
 *
 * 5. VisuStella is not responsible for problems found in your game due to
 * unintended usage, incompatibility problems with plugins outside of the
 * VisuStella MZ library, plugin versions that aren't up to date, nor
 * responsible for the proper working of compatibility patches made by any
 * third parties. VisuStella is not responsible for errors caused by any
 * user-provided custom code used for custom control effects including advanced
 * JavaScript notetags and/or plugin parameters that allow JavaScript code.
 *
 * 6. If a compatibility patch needs to be made through a third party that is
 * unaffiliated with VisuStella that involves using code from the VisuStella MZ
 * library, contact must be made with a member from VisuStella and have it
 * approved. The patch would be placed on VisuStella.com as a free download
 * to the public. Such patches cannot be sold for monetary gain, including
 * commissions, crowdfunding, and/or donations.
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 * 
 * Team VisuStella
 * * Yanfly
 * * Arisu
 * * Olivia
 * * Irina
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.19: January 29, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New notetags added by Irina.
 * *** <Equip Copy Limit: x>
 * **** Sets a maximum number of copies that the actor can wear of this
 *      equipment. Usage Example: Actors can only equip one copy of the
 *      "One-of-a-Kind Ring" on at any time despite having empty accessory
 *      slots because the ring has a <Equip Copy Limit: 1> notetag.
 * *** <Equip Weapon Type Limit: x>
 * **** This weapon cannot be equipped with other weapons of the same type once
 *      the limited amount has been reached. Usage Example: A dualwielding
 *      warrior who can only equip one sword and a dagger but never two swords
 *      or two daggers because the swords and daggers all have the
 *      <Equip Weapon Type Limit: 1> notetags on them.
 * *** <Equip Armor Type Limit: x>
 * **** This armor cannot be equipped with other armors of the same type once
 *      the limited amount has been reached. Usage Example: People cannot equip
 *      more than two glove accessories on at a time because the glove is a
 *      "Glove" armor-type and each glove item has the
 *      <Equip Armor Type Limit: 2> notetags on them.
 * 
 * Version 1.18: January 15, 2021
 * * Bug Fixes!
 * ** Pressing "Shift" to remove equipment will now refresh the status window
 *    unlike before. Fix made by Olivia.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Feature!
 * ** New Plugin Parameters added
 * *** Plugin Parameters > Item Menu Settings > Background Type
 * 
 * Version 1.17: January 1, 2021
 * * Bug Fixes!
 * ** Equipping should be working properly again. Fix made by Yanfly.
 * 
 * Version 1.16: December 25, 2020
 * * Bug Fixes!
 * ** Equip-Adjust HP/MP should work properly now. Fix made by Yanfly.
 * * Documentation Update!
 * ** Added more clarity for <JS Item Enable> to state that if the VisuStella
 *    Battle Core is installed, then all battle scope items are visible, but
 *    not necessarily enabled if they are disabled otherwise.
 * 
 * Version 1.15: December 18, 2020
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Unusable items on an individual-actor basis will no
 *    longer be overwritten by party-based usability for battle. Fix by Yanfly.
 * * Documentation Update!
 * ** Added more clarity for <JS Item Enable> to state that it removes the
 *    usable item from visibility as well if the actor unable to use it is the
 *    only person in the party.
 * 
 * Version 1.14: December 11, 2020
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.13: December 4, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New Plugin Commands added by Arisu!
 * *** Actor: Change Equip Slots
 * *** Actor: Reset Equip Slots
 * **** These plugin commands allow you to forcefully change the equip slots
 *      available to an actor regardless of the slots provided by its class as
 *      well as reset them.
 * 
 * Version 1.12: November 15, 2020
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.11: November 8, 2020
 * * Bug Fix!
 * ** Font size ratio for the shop status window now scales to a hard coded
 *    value to prevent smaller font sizes from expanding icon sizes. Fix made
 *    by Arisu.
 * * Feature Update!
 * ** Currency display in the shop menu is now reflected upon how the plugin
 *    parameters set them to display. Update made by Arisu.
 * 
 * Version 1.10: November 1, 2020
 * * Feature Update!
 * ** Modern Controls compatibility with Core Engine no longer enables the
 *    Item Categories window and child classes to utilize the Home/End keys.
 * 
 * Version 1.09: October 25, 2020
 * * Bug Fixes!
 * ** "All Items" category should now display the "Items" text. Fix by Irina.
 * ** WType, AType, and EType categories now work with text. Fix by Irina.
 *
 * Version 1.08: October 18, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * 
 * Version 1.07: October 11, 2020
 * * Bug Fixes!
 * ** XParams and SParams in the Window_EquipStatus window will no longer show
 *    a non-percentile difference if the original value is not a whole value.
 *    Fix made by Yanfly.
 * 
 * Version 1.06: October 4, 2020
 * * Bug Fixes!
 * ** Select Item event command now displays the default amount of columns
 *    instead of whatever setting is made with the plugin parameters.
 * 
 * Version 1.05: September 27, 2020
 * * Bug Fixes!
 * ** When using the updated shop layout, leaving the sell option will no
 *    longer cause the dummy window to appear.
 * * Documentation Update
 * ** "Use Updated Layout" plugin parameters now have the added clause:
 *    "This will override the Core Engine windows settings." to reduce
 *    confusion. Added by Irina.
 * 
 * Version 1.04: September 13, 2020
 * * Bug Fixes!
 * ** Pressing Shift to quickly remove equipment should no longer crash the
 *    game. This will also clear the help window text. Fix made by Arisu.
 * 
 * Version 1.03: September 6, 2020
 * * Bug Fixes!
 * ** If both Optimize and Clear commands have been removed and using modern
 *    controls, pressing up at the top of the slot window list will not go to
 *    the window. Fix made by Yanfly.
 * ** If both Optimize and Clear commands have been removed, the window will no
 *    longer appear and the slot window will be moved upward to fill any empty
 *    spaces. Fix made by Yanfly.
 * * New Features!
 * ** New Plugin Parameter added in NEW! Label to let you adjust the font face.
 * ** New Plugin Parameters added in Equip Menu Scene Settings for disabling
 *    the back rectangles and/or changing their colors.
 * ** New Plugin Parameters added in Shop Status Window Settings for disabling
 *    the back rectangles and/or changing their colors.
 * 
 * Version 1.02: August 30, 2020
 * * Documentation Fix!
 * ** Added: NOTE: Regarding Damage Labels
 * *** If Visu_1_BattleCore is installed, priority goes to its Damage Style
 *   settings. The label displayed is based on the damage style settings in
 *   place for that specific skill or item.
 * *** Go to Battle Core > Plugin Parameters > Damage Settings > Style List >
 *   pick the damage style you want to edit > Damage Label and change the
 *   text settings you'd like there.
 * *** Documentation update added by Yanfly.
 * 
 * Version 1.01: August 23, 2020
 * * Added failsafe to prevent non-existent equipment (because the database
 *   entries have been deleted) from being equipped as initial equipment.
 *   Fix made by Olivia.
 *
 * Version 1.00: August 20, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActorChangeEquipSlots
 * @text Actor: Change Equip Slots
 * @desc Forcefully change the actor(s) equip slots.
 * These will persist through class changes.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 * 
 * @arg Slots:arraystr
 * @text Equip Slots
 * @type string[]
 * @desc Insert the equip slots you want the actor(s) to have.
 * These entries are case-sensitive.
 * @default ["Weapon","Shield","Head","Body","Accessory"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActorResetEquipSlots
 * @text Actor: Reset Equip Slots
 * @desc Reset any forced equip slots for the actor(s).
 * Equip slots will then be based on class.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command BatchShop
 * @text Shop: Advanced
 * @desc Make it easier to put together inventories for a shop.
 * WARNING: Does not allow for event-specific prices.
 *
 * @arg Step1
 * @text Step 1: Item ID's
 *
 * @arg Step1Start:num
 * @text Range Start
 * @parent Step1
 * @type item
 * @desc Select which Item ID to start from.
 * @default 1
 *
 * @arg Step1End:num
 * @text Range End
 * @parent Step1
 * @type item
 * @desc Select which Item ID to end at.
 * @default 4
 *
 * @arg Step2
 * @text Step 2: Weapon ID's
 *
 * @arg Step2Start:num
 * @text Range Start
 * @parent Step2
 * @type weapon
 * @desc Select which Weapon ID to start from.
 * @default 1
 *
 * @arg Step2End:num
 * @text Range End
 * @parent Step2
 * @type weapon
 * @desc Select which Weapon ID to end at.
 * @default 4
 *
 * @arg Step3
 * @text Step 3: Armor ID's
 *
 * @arg Step3Start:num
 * @text Range Start
 * @parent Step3
 * @type armor
 * @desc Select which Armor ID to start from.
 * @default 1
 *
 * @arg Step3End:num
 * @text Range End
 * @parent Step3
 * @type armor
 * @desc Select which Armor ID to end at.
 * @default 4
 *
 * @arg PurchaseOnly:eval
 * @text Step 4: Purchase Only?
 * @type boolean
 * @on Purchase-Only
 * @off Sell Accessible
 * @desc Make the shop purchase-only?
 * @default false
 * 
 * @arg Optional
 * 
 * @arg Blacklist:arraystr
 * @text Blacklisted Categories
 * @parent Optional
 * @type string[]
 * @desc A list of categories to blacklist from the shop.
 * Not used if empty. Mark categories with <Category: x>
 * @default []
 * 
 * @arg Whitelist:arraystr
 * @text Whitelisted Categories
 * @parent Optional
 * @type string[]
 * @desc A list of categories to whitelist for the shop.
 * Not used if empty. Mark categories with <Category: x>
 * @default []
 *
 * @ --------------------------------------------------------------------------
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param ItemsEquipsCore
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param ItemScene:struct
 * @text Item Menu Settings
 * @type struct<ItemScene>
 * @desc Change the Item Menu Scene settings.
 * @default {"General":"","EnableLayout:eval":"true","LayoutStyle:str":"upper/left","ListWindow":"","ListWindowCols:num":"1","ItemQt":"","MaxItems:num":"99","MaxWeapons:num":"99","MaxArmors:num":"99","ItemQuantityFmt:str":"×%1","ItemQuantityFontSize:num":"22","ShopStatusWindow":"","ShowShopStatus:eval":"true","ItemSceneAdjustItemList:eval":"true","ItemMenuStatusRect:func":"\"const width = this.statusWidth();\\nconst height = this._itemWindow.height;\\nconst x = Graphics.boxWidth - width;\\nconst y = this._itemWindow.y;\\nreturn new Rectangle(x, y, width, height);\"","ButtonAssist":"","buttonAssistCategory:str":"Switch Category"}
 *
 * @param Categories:struct
 * @text Item Categories
 * @parent ItemScene:struct
 * @type struct<Categories>
 * @desc Change the categories displayed in the Item/Shop menus.
 * @default {"MainList":"","List:arraystruct":"[\"{\\\"Type:str\\\":\\\"FieldUsable\\\",\\\"Icon:num\\\":\\\"208\\\"}\",\"{\\\"Type:str\\\":\\\"BattleUsable\\\",\\\"Icon:num\\\":\\\"218\\\"}\",\"{\\\"Type:str\\\":\\\"NeverUsable\\\",\\\"Icon:num\\\":\\\"302\\\"}\",\"{\\\"Type:str\\\":\\\"AllWeapons\\\",\\\"Icon:num\\\":\\\"97\\\"}\",\"{\\\"Type:str\\\":\\\"EType:2\\\",\\\"Icon:num\\\":\\\"128\\\"}\",\"{\\\"Type:str\\\":\\\"EType:3\\\",\\\"Icon:num\\\":\\\"131\\\"}\",\"{\\\"Type:str\\\":\\\"EType:4\\\",\\\"Icon:num\\\":\\\"137\\\"}\",\"{\\\"Type:str\\\":\\\"EType:5\\\",\\\"Icon:num\\\":\\\"145\\\"}\",\"{\\\"Type:str\\\":\\\"KeyItems\\\",\\\"Icon:num\\\":\\\"195\\\"}\"]","Style:str":"icon","TextAlign:str":"center","Vocabulary":"","HiddenItemA:str":"Special Items","HiddenItemB:str":"Unique Items","Consumable:str":"Consumable","Nonconsumable:str":"Nonconsumable","AlwaysUsable:str":"Usable","BattleUsable:str":"Battle","FieldUsable:str":"Field","NeverUsable:str":"Materials"}
 *
 * @param New:struct
 * @text NEW! Labels
 * @parent ItemScene:struct
 * @type struct<NewLabel>
 * @desc Change how NEW! Labels apply to your game project.
 * @default {"Enable:eval":"true","Icon:num":"0","Text:str":"NEW!","FontColor:str":"17","FontFace:str":"Verdana","FontSize:str":"16","FadeLimit:num":"360","FadeSpeed:num":"4","OffsetX:num":"0","OffsetY:num":"4"}
 *
 * @param EquipScene:struct
 * @text Equip Menu Settings
 * @type struct<EquipScene>
 * @desc Adjust the settings regarding the Equip Menu Scene.
 * @default {"General":"","EnableLayout:eval":"true","ParamValueFontSize:num":"22","MenuPortraits:eval":"true","DrawPortraitJS:func":"\"// Declare Variables\\nconst lineHeight = this.lineHeight();\\nconst padding = this.itemPadding();\\nconst x1 = padding;\\nconst x2 = this.innerWidth - 128 - padding;\\n\\n// Draw Menu Image\\nthis.drawItemActorMenuImage(this._actor, 0, 0, this.innerWidth, this.innerHeight);\\n\\n// Draw Data\\nthis.drawActorName(this._actor, x1, lineHeight * 0);\\nthis.drawActorClass(this._actor, x1, lineHeight * 1);\\nthis.drawActorIcons(this._actor, x1, lineHeight * 2);\\nthis.drawActorLevel(this._actor, x2, lineHeight * 0);\\nthis.placeBasicGauges(this._actor, x2, lineHeight * 1);\"","DrawFaceJS:func":"\"// Declare Variables\\nconst lineHeight = this.lineHeight();\\nconst gaugeLineHeight = this.gaugeLineHeight();\\nconst x = Math.floor(this.innerWidth / 2);\\nconst limitHeight = this.innerHeight - (this.actorParams().length * lineHeight);\\nconst actorX = Math.floor((x - ImageManager.faceWidth) / 2);\\nconst actorY = Math.floor((limitHeight - ImageManager.faceHeight) / 2);\\nlet dataHeight = lineHeight * 3;\\ndataHeight += gaugeLineHeight * ($dataSystem.optDisplayTp ? 3 : 2);\\nconst dataY = Math.floor((limitHeight - dataHeight) / 2);\\n\\n// Draw Data\\nthis.drawActorFace(this._actor, actorX, actorY, ImageManager.faceWidth, ImageManager.faceHeight);\\nthis.drawActorIcons(this._actor, actorX + 16, actorY + ImageManager.faceHeight - lineHeight);\\nthis.drawActorName(this._actor, x, dataY + lineHeight * 0);\\nthis.drawActorLevel(this._actor, x, dataY + lineHeight * 1);\\nthis.drawActorClass(this._actor, x, dataY + lineHeight * 2);\\nthis.placeBasicGauges(this._actor, x, dataY + lineHeight * 3);\"","DrawParamJS:func":"\"// Declare variables\\nconst params = this.actorParams();\\nconst lineHeight = this.lineHeight();\\nconst padding = this.itemPadding();\\nconst baseX = 0;\\nconst baseY = this.innerHeight - params.length * lineHeight;\\nconst baseWidth = this.innerWidth;\\nconst valueFontSize = this.paramValueFontSize();\\n\\n// Calculate Widths\\nlet paramNameWidth = Math.max(...params.map(param => this.textWidth(TextManager.param(param))));\\nparamNameWidth += padding * 2;\\nif (this.isUseParamNamesWithIcons()) {\\n    paramNameWidth += ImageManager.iconWidth + 4;\\n}\\nlet arrowWidth = this.rightArrowWidth();\\nconst totalDivides = this.innerWidth >= 500 ? 3 : 2;\\nlet paramValueWidth = Math.floor((baseWidth - paramNameWidth - arrowWidth) / totalDivides);\\nparamNameWidth = baseWidth - (paramValueWidth * totalDivides) - arrowWidth;\\n\\n// Draw Parameters\\nlet x = baseX;\\nlet y = baseY;\\nlet value = 0;\\nlet diffValue = 0;\\nlet alter = 2;\\nfor (const paramId of params) {\\n    // Draw Param Name\\n    this.drawItemDarkRect(x, y, paramNameWidth, lineHeight, alter);\\n    this.drawUpdatedParamName(paramId, x, y, paramNameWidth);\\n    this.resetFontSettings();\\n    x += paramNameWidth;\\n\\n    // Draw Param Before\\n    this.contents.fontSize = valueFontSize;\\n    this.drawItemDarkRect(x, y, paramValueWidth, lineHeight, alter);\\n    this.drawUpdatedBeforeParamValue(paramId, x, y, paramValueWidth);\\n    this.resetFontSettings();\\n    x += paramValueWidth;\\n\\n    // Draw Arrow\\n    this.drawItemDarkRect(x, y, arrowWidth, lineHeight, alter);\\n    this.drawRightArrow(x, y);\\n    x += arrowWidth;\\n\\n    // Draw Param After\\n    this.contents.fontSize = valueFontSize;\\n    this.drawItemDarkRect(x, y, paramValueWidth, lineHeight, alter);\\n    this.drawUpdatedAfterParamValue(paramId, x, y, paramValueWidth);\\n    x += paramValueWidth;\\n\\n    // Draw Param Change\\n    if (totalDivides > 2) {\\n        this.drawItemDarkRect(x, y, paramValueWidth, lineHeight, alter);\\n        this.drawUpdatedParamValueDiff(paramId, x, y, paramValueWidth);\\n    }\\n\\n    // Prepare Next Parameter\\n    x = baseX;\\n    y += lineHeight;\\n    alter = alter === 2 ? 1 : 2;\\n}\"","LayoutStyle:str":"upper/right","StatusWindowWidth:num":"312","DrawBackRect:eval":"true","BackRectColor:str":"19","Command":"","CmdStyle:str":"auto","CmdTextAlign:str":"center","CmdIconEquip:num":"136","CommandAddOptimize:eval":"false","CmdIconOptimize:num":"137","CommandAddClear:eval":"false","CmdIconClear:num":"135","RemoveEquip":"","RemoveEquipIcon:num":"16","RemoveEquipText:str":"Remove","ShiftShortcutKey:eval":"true","Rulings":"","EquipAdjustHpMp:eval":"true","NonRemoveETypes:arraynum":"[]","NonOptimizeETypes:arraynum":"[]","ButtonAssist":"","buttonAssistRemove:str":"Unequip"}
 *
 * @param ShopScene:struct
 * @text Shop Menu Settings
 * @type struct<ShopScene>
 * @desc Change the Shop Menu Scene settings.
 * @default {"General":"","EnableLayout:eval":"true","LayoutStyle:str":"upper/left","Command":"","CmdHideDisabled:eval":"true","CmdStyle:str":"auto","CmdTextAlign:str":"center","CmdIconBuy:num":"208","CmdIconSell:num":"314","CmdIconCancel:num":"82","CmdCancelRename:str":"Exit","Prices":"","SellPriceRate:num":"0.50","BuyPriceJS:func":"\"// Declare variables\\nlet item = arguments[0];\\nlet price = arguments[1];\\n\\n// Return the finalized price\\nreturn price;\"","SellPriceJS:func":"\"// Declare variables\\nlet item = arguments[0];\\nlet price = arguments[1];\\n\\n// Return the finalized price\\nreturn price;\"","ButtonAssist":"","buttonAssistSmallIncrement:str":"-1/+1","buttonAssistLargeIncrement:str":"-10/+10"}
 *
 * @param StatusWindow:struct
 * @text Shop Status Window
 * @parent ShopScene:struct
 * @type struct<StatusWindow>
 * @desc Change the Item Status Window settings.
 * @default {"General":"","Width:num":"352","ParamChangeFontSize:num":"22","Translucent:num":"64","DrawBackRect:eval":"true","BackRectColor:str":"19","EquipData":"","AlreadyEquipMarker:str":"E","CannotEquipMarker:str":"-","NoChangeMarker:str":"-","DrawEquipData:func":"\"// Set Variables\\nconst lineHeight = this.lineHeight();\\nconst paramheight = this.gaugeLineHeight() + 8;\\nlet x = 0;\\nlet y = 0;\\nlet width = this.innerWidth;\\nlet height = this.innerHeight;\\nlet hw = Math.floor(width / 2);\\nlet hx = x + width - hw;\\n\\n// Draw Item Name, Type, and Quantity\\nthis.drawItemName(this._item, x + this.itemPadding(), y, width - this.itemPadding() * 2);\\nthis.drawItemDarkRect(x, y, width);\\ny += lineHeight;\\nif (this.drawItemEquipType(x, y, hw)) y += 0;\\nif (this.drawItemQuantity(hx, y, hw)) y += lineHeight;\\n\\n// Draw Parameter Names\\nconst params = this.actorParams();\\nconst backY = y;\\ny = height - (params.length * paramheight) - 4;\\nlet paramX = x;\\nlet paramWidth = 0;\\nlet tableY = y;\\nfor (const paramId of params) {\\n    paramWidth = Math.max(this.drawParamName(paramId, x + 4, y + 4, width), paramWidth);\\n    y += paramheight;\\n}\\n\\n// Draw Actor Data\\nconst actorMax = $gameParty.maxBattleMembers();\\nconst actorWidth = Math.floor((width - paramWidth) / actorMax);\\nparamWidth = width - (actorWidth * actorMax);\\nfor (const actor of $gameParty.battleMembers()) {\\n    const index = $gameParty.battleMembers().indexOf(actor);\\n    const actorX = paramX + paramWidth + (index * actorWidth);\\n    this.changePaintOpacity(actor.canEquip(this._item));\\n    this.drawActorCharacter(actor, actorX + (actorWidth / 2), tableY);\\n    let actorY = tableY;\\n\\n    // Draw Parameter Changes\\n    for (const paramId of params) {\\n        const diffY = actorY - ((lineHeight - paramheight) / 2);\\n        this.drawActorParamDifference(actor, paramId, actorX, diffY, actorWidth);\\n        actorY += paramheight;\\n    }\\n}\\n\\n// Draw Back Rectangles\\nthis.drawItemDarkRect(paramX, backY, paramWidth, tableY - backY);\\nfor (let i = 0; i < actorMax; i++) {\\n    const actorX = paramX + paramWidth + (i * actorWidth);\\n    this.drawItemDarkRect(actorX, backY, actorWidth, tableY - backY);\\n}\\nfor (const paramId of params) {\\n    this.drawItemDarkRect(paramX, tableY, paramWidth, paramheight);\\n    for (let i = 0; i < actorMax; i++) {\\n        const actorX = paramX + paramWidth + (i * actorWidth);\\n        this.drawItemDarkRect(actorX, tableY, actorWidth, paramheight);\\n    }\\n    tableY += paramheight;\\n}\"","ItemData":"","ItemGeneral":"","MaxIcons:num":"8","MultiplierStandard:num":"1000000","DrawItemData:func":"\"const lineHeight = this.lineHeight();\\nlet x = 0;\\nlet y = 0;\\nlet width = this.innerWidth;\\nlet height = this.innerHeight;\\nlet hw = Math.floor(width / 2);\\nlet hx = x + width - hw;\\n\\n// Draw Item Name and Quantity\\nthis.drawItemName(this._item, x + this.itemPadding(), y, width - this.itemPadding() * 2);\\nthis.drawItemDarkRect(x, y, width);\\ny += lineHeight;\\n\\n// Draw Main Item Properties\\nif (this.drawItemConsumable(x, y, hw)) y += 0;\\nif (this.drawItemQuantity(hx, y, hw)) y += lineHeight;\\nif (this._item.occasion < 3) {\\n    y = this.drawItemDamage(x, y, width);\\n    y = this.drawItemEffects(x, y, width);\\n}\\ny = this.drawItemCustomEntries(x, y, width);\\n\\n// Draw Remaining Item Properties\\nif (this._item.occasion < 3) {\\n    if (this.drawItemOccasion(x, y, hw)) y += 0;\\n    if (this.drawItemScope(hx, y, hw)) y += lineHeight;\\n    if (this.drawItemHitType(x, y, hw)) y += 0;\\n    if (this.drawItemSuccessRate(hx, y, hw)) y += lineHeight;\\n    if (this.drawItemSpeed(x, y, hw)) y += 0;\\n    if (this.drawItemRepeats(hx, y, hw)) y += lineHeight;\\n}\\n\\n// Fill Rest of the Window\\nthis.drawItemDarkRect(x, y, width, height - y);\"","Vocabulary":"","LabelConsume:str":"Consumable","Consumable:str":"✔","NotConsumable:str":"✘","Occasions":"","Occasion0:str":"Anytime Use","Occasion1:str":"Battle-Only","Occasion2:str":"Field-Only","Occasion3:str":"-","Scope":"","Scope0:str":"No Target","Scope1:str":"1 Foe","Scope2:str":"All Foes","Scope3:str":"Random Foe","Scope4:str":"2 Random Foes","Scope5:str":"3 Random Foes","Scope6:str":"4 Random Foes","Scope7:str":"1 Ally","Scope8:str":"Alive Allies","Scope9:str":"Dead Ally","Scope10:str":"Dead Allies","Scope11:str":"User","Scope12:str":"Any Ally","Scope13:str":"All Allies","Scope14:str":"Everybody","BattleCore":"","ScopeRandomAny:str":"%1 Random Units","ScopeRandomEnemies:str":"%1 Random Foes","ScopeRandomAllies:str":"%1 Random Allies","ScopeAlliesButUser:str":"Other Allies","LabelSpeed:str":"Speed","Speed2000:str":"Fastest","Speed1000:str":"Faster","Speed1:str":"Fast","Speed0:str":"Normal","SpeedNeg999:str":"Slow","SpeedNeg1999:str":"Slower","SpeedNeg2000:str":"Slowest","LabelSuccessRate:str":"Accuracy","LabelRepeats:str":"Hits","LabelHitType:str":"Type","HitType0:str":"Neutral","HitType1:str":"Physical","HitType2:str":"Magical","LabelElement:str":"Element","ElementWeapon:str":"\\I[97]Weapon","ElementNone:str":"\\I[160]No Element","DamageType":"","DamageType1:str":"%1 Damage Multiplier","DamageType2:str":"%1 Damage Multiplier","DamageType3:str":"%1 Recovery Multiplier","DamageType4:str":"%1 Recovery Multiplier","DamageType5:str":"%1 Drain Multiplier","DamageType6:str":"%1 Drain Multiplier","Effects":"","LabelRecoverHP:str":"%1 Recovery","LabelRecoverMP:str":"%1 Recovery","LabelRecoverTP:str":"%1 Recovery","LabelSelfGainTP:str":"User %1","LabelDamageHP:str":"%1 Damage","LabelDamageMP:str":"%1 Damage","LabelDamageTP:str":"%1 Damage","LabelApply:str":"Applies","LabelRemove:str":"Removes"}
 *
 * @param BreakEnd1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param End Of
 * @default Plugin Parameters
 *
 * @param BreakEnd2
 * @text --------------------------
 * @default ----------------------------------
 *
 */
/* ----------------------------------------------------------------------------
 * Item Menu Scene Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ItemScene:
 *
 * @param General
 *
 * @param EnableLayout:eval
 * @text Use Updated Layout
 * @parent General
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use the Updated Item Menu Layout provided by this plugin?
 * This will override the Core Engine windows settings.
 * @default true
 *
 * @param LayoutStyle:str
 * @text Layout Style
 * @parent General
 * @type select
 * @option Upper Help, Left Input
 * @value upper/left
 * @option Upper Help, Right Input
 * @value upper/right
 * @option Lower Help, Left Input
 * @value lower/left
 * @option Lower Help, Right Input
 * @value lower/right
 * @desc If using an updated layout, how do you want to style
 * the menu scene layout?
 * @default upper/left
 *
 * @param ListWindow
 * @text List Window
 *
 * @param ListWindowCols:num
 * @text Columns
 * @parent ListWindow
 * @type number
 * @min 1
 * @desc Number of maximum columns.
 * @default 1
 *
 * @param ItemQt
 * @text Item Quantity
 *
 * @param MaxItems:num
 * @text Item Max
 * @parent ItemQt
 * @desc The default maximum quantity for items.
 * @default 99
 *
 * @param MaxWeapons:num
 * @text Weapon Max
 * @parent ItemQt
 * @desc The default maximum quantity for weapons.
 * @default 99
 *
 * @param MaxArmors:num
 * @text Armor Max
 * @parent ItemQt
 * @desc The default maximum quantity for armors.
 * @default 99
 *
 * @param ItemQuantityFmt:str
 * @text Quantity Format
 * @parent ItemQt
 * @desc How to display an item's quantity.
 * %1 - Item Quantity
 * @default ×%1
 *
 * @param ItemQuantityFontSize:num
 * @text Font Size
 * @parent ItemQt
 * @desc Default font size for item quantity.
 * @default 22
 *
 * @param ShopStatusWindow
 * @text Shop Status Window
 *
 * @param ShowShopStatus:eval
 * @text Show in Item Menu?
 * @parent ShopStatusWindow
 * @type boolean
 * @on Show
 * @off Don't Show
 * @desc Show the Shop Status Window in the Item Menu?
 * This is enabled if the Updated Layout is on.
 * @default true
 *
 * @param ItemSceneAdjustItemList:eval
 * @text Adjust List Window?
 * @parent ShopStatusWindow
 * @type boolean
 * @on Adjust
 * @off Don't
 * @desc Automatically adjust the Item List Window in the Item Menu if using the Shop Status Window?
 * @default true
 *
 * @param ItemMenuStatusBgType:num
 * @text Background Type
 * @parent ShopStatusWindow
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param ItemMenuStatusRect:func
 * @text JS: X, Y, W, H
 * @parent ShopStatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this Status Window in the Item Menu.
 * @default "const width = this.statusWidth();\nconst height = this._itemWindow.height;\nconst x = Graphics.boxWidth - width;\nconst y = this._itemWindow.y;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ButtonAssist
 * @text Button Assist Window
 *
 * @param buttonAssistCategory:str
 * @text Switch Category
 * @parent ButtonAssist
 * @desc Button assist text used for switching categories.
 * For VisuStella MZ's Core Engine's Button Assist Window.
 * @default Switch Category
 *
 */
/* ----------------------------------------------------------------------------
 * Item Categories
 * ----------------------------------------------------------------------------
 */
/*~struct~Categories:
 *
 * @param MainList
 * @text List
 * 
 * @param List:arraystruct
 * @text Category List
 * @parent MainList
 * @type struct<Category>[]
 * @desc A list of the item categories displayed in the Item/Shop menus.
 * @default ["{\"Type:str\":\"RegularItems\",\"Icon:num\":\"208\"}","{\"Type:str\":\"AllWeapons\",\"Icon:num\":\"97\"}","{\"Type:str\":\"AllArmors\",\"Icon:num\":\"137\"}","{\"Type:str\":\"KeyItems\",\"Icon:num\":\"195\"}"]
 *
 * @param Style:str
 * @text Category Style
 * @parent MainList
 * @type select
 * @option Text Only
 * @value text
 * @option Icon Only
 * @value icon
 * @option Icon + Text
 * @value iconText
 * @option Automatic
 * @value auto
 * @desc How do you wish to draw categorie entries in the Category Window?
 * @default icon
 *
 * @param TextAlign:str
 * @text Text Alignment
 * @parent MainList
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Decide how you want the text to be aligned.
 * @default center
 *
 * @param Vocabulary
 *
 * @param HiddenItemA:str
 * @text Hidden Item A
 * @parent Vocabulary
 * @desc How this category is named in the Item Menu.
 * @default Special Items
 *
 * @param HiddenItemB:str
 * @text Hidden Item B
 * @parent Vocabulary
 * @desc How this category is named in the Item Menu.
 * @default Unique Items
 *
 * @param Consumable:str
 * @text Consumable
 * @parent Vocabulary
 * @desc How this category is named in the Item Menu.
 * @default Consumable
 *
 * @param Nonconsumable:str
 * @text Nonconsumable
 * @parent Vocabulary
 * @desc How this category is named in the Item Menu.
 * @default Nonconsumable
 *
 * @param AlwaysUsable:str
 * @text Always Usable
 * @parent Vocabulary
 * @desc How this category is named in the Item Menu.
 * @default Usable
 *
 * @param BattleUsable:str
 * @text Battle Usable
 * @parent Vocabulary
 * @desc How this category is named in the Item Menu.
 * @default Battle
 *
 * @param FieldUsable:str
 * @text Field Usable
 * @parent Vocabulary
 * @desc How this category is named in the Item Menu.
 * @default Field
 *
 * @param NeverUsable:str
 * @text Never Usable
 * @parent Vocabulary
 * @desc How this category is named in the Item Menu.
 * @default Materials
 *
 */
/* ----------------------------------------------------------------------------
 * Category Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Category:
 *
 * @param Type:str
 * @text Type
 * @type combo
 * @option AllItems
 * @option 
 * @option RegularItems
 * @option KeyItems
 * @option HiddenItemA
 * @option HiddenItemB
 * @option 
 * @option Consumable
 * @option Nonconsumable
 * @option 
 * @option AlwaysUsable
 * @option BattleUsable
 * @option FieldUsable
 * @option NeverUsable
 * @option 
 * @option AllWeapons
 * @option WType:x
 * @option 
 * @option AllArmors
 * @option AType:x
 * @option 
 * @option EType:x
 * @option 
 * @option Category:x
 * @option
 * @desc A list of the item categories displayed in the Item/Shop
 * menus. Replace x with ID numbers or text.
 * @default RegularItems
 *
 * @param Icon:num
 * @text Icon
 * @desc Icon used for this category.
 * Use 0 for no icon.
 * @default 0
 *
 * @param SwitchID:num
 * @text Visibility Switch
 * @type switch
 * @desc This Switch must be turned ON in order for the category to show.
 * Use 0 for no Switch requirement.
 * @default 0
 *
 */
/* ----------------------------------------------------------------------------
 * New Label Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~NewLabel:
 *
 * @param Enable:eval
 * @text Use NEW! Labels?
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use the NEW! Labels or not?
 * @default true
 *
 * @param Icon:num
 * @text Icon
 * @desc The icon index used to represent the NEW! text.
 * Use 0 to not draw any icons.
 * @default 0
 *
 * @param Text:str
 * @text Text
 * @desc The text written on the NEW! Label.
 * @default NEW!
 *
 * @param FontColor:str
 * @text Font Color
 * @parent Text:str
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 17
 *
 * @param FontFace:str
 * @text Font Face
 * @parent Text:str
 * @desc Font face used for the NEW! Label.
 * @default Verdana
 *
 * @param FontSize:str
 * @text Font Size
 * @parent Text:str
 * @desc The font size used for the NEW! text.
 * @default 16
 *
 * @param FadeLimit:num
 * @text Fade Limit
 * @desc What's the upper opaque limit before reversing?
 * @default 360
 *
 * @param FadeSpeed:num
 * @text Fade Speed
 * @desc What's the fade speed of the NEW! Label?
 * @default 4
 *
 * @param OffsetX:num
 * @text Offset X
 * @desc How much to offset the NEW! Label's X position by.
 * @default 0
 *
 * @param OffsetY:num
 * @text Offset Y
 * @desc How much to offset the NEW! Label's Y position by.
 * @default 4
 *
 */
/* ----------------------------------------------------------------------------
 * Equip Menu Scene Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~EquipScene:
 *
 * @param General
 *
 * @param EnableLayout:eval
 * @text Use Updated Layout
 * @parent General
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use the Updated Equip Layout provided by this plugin?
 * This will override the Core Engine windows settings.
 * @default true
 *
 * @param LayoutStyle:str
 * @text Layout Style
 * @parent General
 * @type select
 * @option Upper Help, Left Input
 * @value upper/left
 * @option Upper Help, Right Input
 * @value upper/right
 * @option Lower Help, Left Input
 * @value lower/left
 * @option Lower Help, Right Input
 * @value lower/right
 * @desc If using an updated layout, how do you want to style
 * the menu scene layout?
 * @default upper/right
 *
 * @param ParamValueFontSize:num
 * @text Param Font Size
 * @parent EnableLayout:eval
 * @desc The font size used for parameter values.
 * @default 22
 *
 * @param MenuPortraits:eval
 * @text Show Menu Portraits?
 * @parent EnableLayout:eval
 * @type boolean
 * @on Use Portraits
 * @off Use Faces
 * @desc If Main Menu Core is installed, display the Menu Portraits
 * instead of the actor's face in the status window?
 * @default true
 *
 * @param DrawPortraitJS:func
 * @text JS: Portrait Upper
 * @parent EnableLayout:eval
 * @type note
 * @desc If Menu Portraits are available, this is code used to draw
 * the upper data like this in the Status Window.
 * @default "// Declare Variables\nconst lineHeight = this.lineHeight();\nconst padding = this.itemPadding();\nconst x1 = padding;\nconst x2 = this.innerWidth - 128 - padding;\n\n// Draw Menu Image\nthis.drawItemActorMenuImage(this._actor, 0, 0, this.innerWidth, this.innerHeight);\n\n// Draw Data\nthis.drawActorName(this._actor, x1, lineHeight * 0);\nthis.drawActorClass(this._actor, x1, lineHeight * 1);\nthis.drawActorIcons(this._actor, x1, lineHeight * 2);\nthis.drawActorLevel(this._actor, x2, lineHeight * 0);\nthis.placeBasicGauges(this._actor, x2, lineHeight * 1);"
 *
 * @param DrawFaceJS:func
 * @text JS: Face Upper
 * @parent EnableLayout:eval
 * @type note
 * @desc If faces used used, this is code used to draw the upper
 * data like this in the Status Window.
 * @default "// Declare Variables\nconst lineHeight = this.lineHeight();\nconst gaugeLineHeight = this.gaugeLineHeight();\nconst x = Math.floor(this.innerWidth / 2);\nconst limitHeight = this.innerHeight - (this.actorParams().length * lineHeight);\nconst actorX = Math.floor((x - ImageManager.faceWidth) / 2);\nconst actorY = Math.floor((limitHeight - ImageManager.faceHeight) / 2);\nlet dataHeight = lineHeight * 3;\ndataHeight += gaugeLineHeight * ($dataSystem.optDisplayTp ? 3 : 2);\nconst dataY = Math.floor((limitHeight - dataHeight) / 2);\n\n// Draw Data\nthis.drawActorFace(this._actor, actorX, actorY, ImageManager.faceWidth, ImageManager.faceHeight);\nthis.drawActorIcons(this._actor, actorX + 16, actorY + ImageManager.faceHeight - lineHeight);\nthis.drawActorName(this._actor, x, dataY + lineHeight * 0);\nthis.drawActorLevel(this._actor, x, dataY + lineHeight * 1);\nthis.drawActorClass(this._actor, x, dataY + lineHeight * 2);\nthis.placeBasicGauges(this._actor, x, dataY + lineHeight * 3);"
 *
 * @param DrawParamJS:func
 * @text JS: Parameter Lower
 * @parent EnableLayout:eval
 * @type note
 * @desc Code to determine how parameters are drawn in the
 * Status Window.
 * @default "// Declare variables\nconst params = this.actorParams();\nconst lineHeight = this.lineHeight();\nconst padding = this.itemPadding();\nconst baseX = 0;\nconst baseY = this.innerHeight - params.length * lineHeight;\nconst baseWidth = this.innerWidth;\nconst valueFontSize = this.paramValueFontSize();\n\n// Calculate Widths\nlet paramNameWidth = Math.max(...params.map(param => this.textWidth(TextManager.param(param))));\nparamNameWidth += padding * 2;\nif (this.isUseParamNamesWithIcons()) {\n    paramNameWidth += ImageManager.iconWidth + 4;\n}\nlet arrowWidth = this.rightArrowWidth();\nconst totalDivides = this.innerWidth >= 500 ? 3 : 2;\nlet paramValueWidth = Math.floor((baseWidth - paramNameWidth - arrowWidth) / totalDivides);\nparamNameWidth = baseWidth - (paramValueWidth * totalDivides) - arrowWidth;\n\n// Draw Parameters\nlet x = baseX;\nlet y = baseY;\nlet value = 0;\nlet diffValue = 0;\nlet alter = 2;\nfor (const paramId of params) {\n    // Draw Param Name\n    this.drawItemDarkRect(x, y, paramNameWidth, lineHeight, alter);\n    this.drawUpdatedParamName(paramId, x, y, paramNameWidth);\n    this.resetFontSettings();\n    x += paramNameWidth;\n\n    // Draw Param Before\n    this.contents.fontSize = valueFontSize;\n    this.drawItemDarkRect(x, y, paramValueWidth, lineHeight, alter);\n    this.drawUpdatedBeforeParamValue(paramId, x, y, paramValueWidth);\n    this.resetFontSettings();\n    x += paramValueWidth;\n\n    // Draw Arrow\n    this.drawItemDarkRect(x, y, arrowWidth, lineHeight, alter);\n    this.drawRightArrow(x, y);\n    x += arrowWidth;\n\n    // Draw Param After\n    this.contents.fontSize = valueFontSize;\n    this.drawItemDarkRect(x, y, paramValueWidth, lineHeight, alter);\n    this.drawUpdatedAfterParamValue(paramId, x, y, paramValueWidth);\n    x += paramValueWidth;\n\n    // Draw Param Change\n    if (totalDivides > 2) {\n        this.drawItemDarkRect(x, y, paramValueWidth, lineHeight, alter);\n        this.drawUpdatedParamValueDiff(paramId, x, y, paramValueWidth);\n    }\n\n    // Prepare Next Parameter\n    x = baseX;\n    y += lineHeight;\n    alter = alter === 2 ? 1 : 2;\n}"
 *
 * @param StatusWindowWidth:num
 * @text Status Window Width
 * @parent General
 * @desc The usual width of the status window if using the 
 * non-Updated Equip Menu Layout.
 * @default 312
 *
 * @param DrawBackRect:eval
 * @text Show Back Rectangles?
 * @parent General
 * @type boolean
 * @on Draw
 * @off Don't Draw
 * @desc Show back rectangles of darker colors to display information better?
 * @default true
 *
 * @param BackRectColor:str
 * @text Back Rectangle Color
 * @parent DrawBackRect:eval
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 19
 *
 * @param Command
 * @text Command Window
 *
 * @param CmdStyle:str
 * @text Style
 * @parent Command
 * @type select
 * @option Text Only
 * @value text
 * @option Icon Only
 * @value icon
 * @option Icon + Text
 * @value iconText
 * @option Automatic
 * @value auto
 * @desc How do you wish to draw commands in the Command Window?
 * @default auto
 *
 * @param CmdTextAlign:str
 * @text Text Align
 * @parent Command
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Text alignment for the Command Window.
 * @default center
 *
 * @param CmdIconEquip:num
 * @text Equip Icon
 * @parent Command
 * @desc The icon used for the Equip command.
 * @default 136
 *
 * @param CommandAddOptimize:eval
 * @text Add Optimize Command?
 * @parent Command
 * @type boolean
 * @on Add
 * @off Don't
 * @desc Add the "Optimize" command to the Command Window?
 * @default true
 *
 * @param CmdIconOptimize:num
 * @text Optimize Icon
 * @parent CommandAddOptimize:eval
 * @desc The icon used for the Optimize command.
 * @default 137
 *
 * @param CommandAddClear:eval
 * @text Add Clear Command?
 * @parent Command
 * @type boolean
 * @on Add
 * @off Don't
 * @desc Add the "Clear" command to the Command Window?
 * @default true
 *
 * @param CmdIconClear:num
 * @text Clear Icon
 * @parent CommandAddClear:eval
 * @desc The icon used for the Clear command.
 * @default 135
 *
 * @param RemoveEquip
 * @text Remove Equip
 *
 * @param RemoveEquipIcon:num
 * @text Icon
 * @parent RemoveEquip
 * @desc Icon used for equipment removal.
 * @default 16
 *
 * @param RemoveEquipText:str
 * @text Text
 * @parent RemoveEquip
 * @desc Text used for equipment removal.
 * @default Remove
 *
 * @param ShiftShortcutKey:eval
 * @text Use SHIFT Shortcut?
 * @parent RemoveEquip
 * @type boolean
 * @on Use
 * @off Don't
 * @desc Add the "Shift" button as a shortcut key to removing items?
 * @default true

 * @param Rulings
 *
 * @param EquipAdjustHpMp:eval
 * @text Equip-Adjust HP/MP
 * @parent Rulings
 * @type boolean
 * @on Adjust
 * @off Don't
 * @desc Adjust HP/MP differences after changing equips with MaxHP/MaxMP values.
 * @default true
 * 
 * @param NonRemoveETypes:arraynum
 * @text Non-Removable Types
 * @parent Rulings
 * @type number[]
 * @min 1
 * @max 100
 * @desc Insert ID's of the Equipment Types that must always have
 * an item equipped and cannot be empty.
 * @default []
 *
 * @param NonOptimizeETypes:arraynum
 * @text Non-Optomized Types
 * @parent Rulings
 * @type number[]
 * @min 1
 * @max 100
 * @desc Insert ID's of the Equipment Types that will be ignored
 * when equipment is being optimized.
 * @default []
 *
 * @param ButtonAssist
 * @text Button Assist Window
 *
 * @param buttonAssistRemove:str
 * @text SHIFT: Remove
 * @parent ButtonAssist
 * @desc Button assist text used for the SHIFT Remove Shortcut.
 * For VisuStella MZ's Core Engine's Button Assist Window.
 * @default Unequip
 * 
 */
/* ----------------------------------------------------------------------------
 * Shop Menu Scene Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ShopScene:
 *
 * @param General
 *
 * @param EnableLayout:eval
 * @text Use Updated Layout
 * @parent General
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use the Updated Shop Layout provided by this plugin?
 * This will override the Core Engine windows settings.
 * @default true
 *
 * @param LayoutStyle:str
 * @text Layout Style
 * @parent General
 * @type select
 * @option Upper Help, Left Input
 * @value upper/left
 * @option Upper Help, Right Input
 * @value upper/right
 * @option Lower Help, Left Input
 * @value lower/left
 * @option Lower Help, Right Input
 * @value lower/right
 * @desc If using an updated layout, how do you want to style
 * the menu scene layout?
 * @default upper/left
 *
 * @param Command
 * @text Command Window
 *
 * @param CmdHideDisabled:eval
 * @text Hide Unavailable?
 * @parent Command
 * @type boolean
 * @on Hide
 * @off Default
 * @desc Hide all unavailable commands like when a shop is set to Purchase Only?
 * @default true
 *
 * @param CmdStyle:str
 * @text Style
 * @parent Command
 * @type select
 * @option Text Only
 * @value text
 * @option Icon Only
 * @value icon
 * @option Icon + Text
 * @value iconText
 * @option Automatic
 * @value auto
 * @desc How do you wish to draw commands in the Command Window?
 * @default auto
 *
 * @param CmdTextAlign:str
 * @text Text Align
 * @parent Command
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Text alignment for the Command Window.
 * @default center
 *
 * @param CmdIconBuy:num
 * @text Buy Icon
 * @parent Command
 * @desc The icon used for the Buy command.
 * @default 208
 *
 * @param CmdIconSell:num
 * @text Sell Icon
 * @parent Command
 * @desc The icon used for the Sell command.
 * @default 314
 *
 * @param CmdIconCancel:num
 * @text Cancel Icon
 * @parent Command
 * @desc The icon used for the Cancel command.
 * @default 82
 *
 * @param CmdCancelRename:str
 * @text Rename "Cancel"
 * @parent Command
 * @desc Rename Cancel to something more logical for the Shop Menu Scene.
 * @default Exit
 *
 * @param Prices
 *
 * @param SellPriceRate:num
 * @text Sell Price Rate
 * @parent Prices
 * @desc The default sell price rate.
 * @default 0.50
 *
 * @param BuyPriceJS:func
 * @text JS: Buy Price
 * @parent Prices
 * @type note
 * @desc Modificatons made to the buy price before finalizing it.
 * @default "// Declare variables\nlet item = arguments[0];\nlet price = arguments[1];\n\n// Return the finalized price\nreturn price;"
 *
 * @param SellPriceJS:func
 * @text JS: Sell Price
 * @parent Prices
 * @type note
 * @desc Modificatons made to the sell price before finalizing it.
 * @default "// Declare variables\nlet item = arguments[0];\nlet price = arguments[1];\n\n// Return the finalized price\nreturn price;"
 * 
 * @param ButtonAssist
 * @text Button Assist Window
 *
 * @param buttonAssistSmallIncrement:str
 * @text Small Increment
 * @parent ButtonAssist
 * @desc Text used for changing amount bought/sold.
 * For VisuStella MZ's Core Engine's Button Assist Window.
 * @default -1/+1
 *
 * @param buttonAssistLargeIncrement:str
 * @text Large Increment
 * @parent ButtonAssist
 * @desc Text used for changing amount bought/sold.
 * For VisuStella MZ's Core Engine's Button Assist Window.
 * @default -10/+10
 *
 */
/* ----------------------------------------------------------------------------
 * Shop Status Window Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~StatusWindow:
 *
 * @param General
 *
 * @param Width:num
 * @text Window Width
 * @parent General
 * @desc The usual width of the status window.
 * @default 352
 *
 * @param ParamChangeFontSize:num
 * @text Parameter Font Size
 * @parent General
 * @desc Font size used for parameter changes.
 * @default 22
 *
 * @param Translucent:num
 * @text Translucent Opacity
 * @parent General
 * @desc Opacity setting used for translucent window objects.
 * @default 64
 *
 * @param DrawBackRect:eval
 * @text Show Back Rectangles?
 * @parent General
 * @type boolean
 * @on Draw
 * @off Don't Draw
 * @desc Show back rectangles of darker colors to display information better?
 * @default true
 *
 * @param BackRectColor:str
 * @text Back Rectangle Color
 * @parent DrawBackRect:eval
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 19
 *
 * @param EquipData
 * @text Equipment Data
 *
 * @param AlreadyEquipMarker:str
 * @text Already Equipped
 * @parent EquipData
 * @desc Marker used to show an actor cannot equip an item.
 * @default E
 *
 * @param CannotEquipMarker:str
 * @text Can't Equip
 * @parent EquipData
 * @desc Marker used to show an actor cannot equip an item.
 * @default -
 *
 * @param NoChangeMarker:str
 * @text No Changes
 * @parent EquipData
 * @desc Marker used to show no changes have occurred.
 * @default -
 *
 * @param DrawEquipData:func
 * @text JS: Draw Equip Data
 * @parent EquipData
 * @type note
 * @desc Code used to draw the equipment data for the Shop Status Window.
 * @default "// Set Variables\nconst lineHeight = this.lineHeight();\nconst paramheight = this.gaugeLineHeight() + 8;\nlet x = 0;\nlet y = 0;\nlet width = this.innerWidth;\nlet height = this.innerHeight;\nlet hw = Math.floor(width / 2);\nlet hx = x + width - hw;\n\n// Draw Item Name, Type, and Quantity\nthis.drawItemName(this._item, x + this.itemPadding(), y, width - this.itemPadding() * 2);\nthis.drawItemDarkRect(x, y, width);\ny += lineHeight;\nif (this.drawItemEquipType(x, y, hw)) y += 0;\nif (this.drawItemQuantity(hx, y, hw)) y += lineHeight;\n\n// Draw Parameter Names\nconst params = this.actorParams();\nconst backY = y;\ny = height - (params.length * paramheight) - 4;\nlet paramX = x;\nlet paramWidth = 0;\nlet tableY = y;\nfor (const paramId of params) {\n    paramWidth = Math.max(this.drawParamName(paramId, x + 4, y + 4, width), paramWidth);\n    y += paramheight;\n}\n\n// Draw Actor Data\nconst actorMax = $gameParty.maxBattleMembers();\nconst actorWidth = Math.floor((width - paramWidth) / actorMax);\nparamWidth = width - (actorWidth * actorMax);\nfor (const actor of $gameParty.battleMembers()) {\n    const index = $gameParty.battleMembers().indexOf(actor);\n    const actorX = paramX + paramWidth + (index * actorWidth);\n    this.changePaintOpacity(actor.canEquip(this._item));\n    this.drawActorCharacter(actor, actorX + (actorWidth / 2), tableY);\n    let actorY = tableY;\n\n    // Draw Parameter Changes\n    for (const paramId of params) {\n        const diffY = actorY - ((lineHeight - paramheight) / 2);\n        this.drawActorParamDifference(actor, paramId, actorX, diffY, actorWidth);\n        actorY += paramheight;\n    }\n}\n\n// Draw Back Rectangles\nthis.drawItemDarkRect(paramX, backY, paramWidth, tableY - backY);\nfor (let i = 0; i < actorMax; i++) {\n    const actorX = paramX + paramWidth + (i * actorWidth);\n    this.drawItemDarkRect(actorX, backY, actorWidth, tableY - backY);\n}\nfor (const paramId of params) {\n    this.drawItemDarkRect(paramX, tableY, paramWidth, paramheight);\n    for (let i = 0; i < actorMax; i++) {\n        const actorX = paramX + paramWidth + (i * actorWidth);\n        this.drawItemDarkRect(actorX, tableY, actorWidth, paramheight);\n    }\n    tableY += paramheight;\n}"
 *
 * @param ItemData
 * @text Item Data
 *
 * @param ItemGeneral
 * @parent ItemData
 *
 * @param MaxIcons:num
 * @text Max State/Buff Icons
 * @parent ItemGeneral
 * @desc Maximum number of icons that can be displayed for Add/Remove States/Buffs.
 * @default 8
 *
 * @param MultiplierStandard:num
 * @text Multiplier Standard
 * @parent ItemGeneral
 * @desc Constant standard to filter out random values when calculating the damage multiplier.
 * @default 1000000
 *
 * @param DrawItemData:func
 * @text JS: Draw Item Data
 * @parent ItemGeneral
 * @type note
 * @desc Code used to draw the item data for the Shop Status Window.
 * @default "const lineHeight = this.lineHeight();\nlet x = 0;\nlet y = 0;\nlet width = this.innerWidth;\nlet height = this.innerHeight;\nlet hw = Math.floor(width / 2);\nlet hx = x + width - hw;\n\n// Draw Item Name and Quantity\nthis.drawItemName(this._item, x + this.itemPadding(), y, width - this.itemPadding() * 2);\nthis.drawItemDarkRect(x, y, width);\ny += lineHeight;\n\n// Draw Main Item Properties\nif (this.drawItemConsumable(x, y, hw)) y += 0;\nif (this.drawItemQuantity(hx, y, hw)) y += lineHeight;\nif (this._item.occasion < 3) {\n    y = this.drawItemDamage(x, y, width);\n    y = this.drawItemEffects(x, y, width);\n}\ny = this.drawItemCustomEntries(x, y, width);\n\n// Draw Remaining Item Properties\nif (this._item.occasion < 3) {\n    if (this.drawItemOccasion(x, y, hw)) y += 0;\n    if (this.drawItemScope(hx, y, hw)) y += lineHeight;\n    if (this.drawItemHitType(x, y, hw)) y += 0;\n    if (this.drawItemSuccessRate(hx, y, hw)) y += lineHeight;\n    if (this.drawItemSpeed(x, y, hw)) y += 0;\n    if (this.drawItemRepeats(hx, y, hw)) y += lineHeight;\n}\n\n// Fill Rest of the Window\nthis.drawItemDarkRect(x, y, width, height - y);"
 *
 * @param Vocabulary
 * @parent ItemData
 *
 * @param LabelConsume:str
 * @text Consumable
 * @parent Vocabulary
 * @desc Vocabulary used for this data entry.
 * @default Consumable
 *
 * @param Consumable:str
 * @text Yes
 * @parent LabelConsume:str
 * @desc Vocabulary used for this data entry.
 * @default ✔
 *
 * @param NotConsumable:str
 * @text No
 * @parent LabelConsume:str
 * @desc Vocabulary used for this data entry.
 * @default ✘
 *
 * @param Occasions
 * @parent Vocabulary
 *
 * @param Occasion0:str
 * @text Always
 * @parent Occasions
 * @desc Vocabulary used for this data entry.
 * @default Anytime Use
 *
 * @param Occasion1:str
 * @text Battle Screen
 * @parent Occasions
 * @desc Vocabulary used for this data entry.
 * @default Battle-Only
 *
 * @param Occasion2:str
 * @text Menu Screen
 * @parent Occasions
 * @desc Vocabulary used for this data entry.
 * @default Field-Only
 *
 * @param Occasion3:str
 * @text Never
 * @parent Occasions
 * @desc Vocabulary used for this data entry.
 * @default -
 *
 * @param Scope
 * @parent Vocabulary
 *
 * @param Scope0:str
 * @text None
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default No Target
 *
 * @param Scope1:str
 * @text 1 Enemy
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default 1 Foe
 *
 * @param Scope2:str
 * @text All Enemies
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default All Foes
 *
 * @param Scope3:str
 * @text 1 Random Enemy
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default Random Foe
 *
 * @param Scope4:str
 * @text 2 Random Enemies
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default 2 Random Foes
 *
 * @param Scope5:str
 * @text 3 Random Enemies
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default 3 Random Foes
 *
 * @param Scope6:str
 * @text 4 Random Enemies
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default 4 Random Foes
 *
 * @param Scope7:str
 * @text 1 Ally
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default 1 Ally
 *
 * @param Scope8:str
 * @text All Allies
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default Alive Allies
 *
 * @param Scope9:str
 * @text 1 Ally (Dead)
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default Dead Ally
 *
 * @param Scope10:str
 * @text All Allies (Dead)
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default Dead Allies
 *
 * @param Scope11:str
 * @text The User
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default User
 *
 * @param Scope12:str
 * @text 1 Ally (DoA)
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default Any Ally
 *
 * @param Scope13:str
 * @text All Allies (DoA)
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default All Allies
 *
 * @param Scope14:str
 * @text Enemies & Allies
 * @parent Scope
 * @desc Vocabulary used for this data entry.
 * @default Everybody
 *
 * @param BattleCore
 * @text Battle Core Support
 * @parent Vocabulary
 *
 * @param ScopeRandomAny:str
 * @text x Random Any
 * @parent BattleCore
 * @desc Vocabulary used for <Target: x Random Any> notetag.
 * @default %1 Random Units
 *
 * @param ScopeRandomEnemies:str
 * @text x Random Enemies
 * @parent BattleCore
 * @desc Vocabulary used for <Target: x Random Enemies> notetag.
 * @default %1 Random Foes
 *
 * @param ScopeRandomAllies:str
 * @text x Random Allies
 * @parent BattleCore
 * @desc Vocabulary used for <Target: x Random Allies> notetag.
 * @default %1 Random Allies
 *
 * @param ScopeAlliesButUser:str
 * @text All Allies But User
 * @parent BattleCore
 * @desc Vocabulary used for <Target: All Allies But User> notetag.
 * @default Other Allies
 *
 * @param LabelSpeed:str
 * @text Speed
 * @parent Vocabulary
 * @desc Vocabulary used for this data entry.
 * @default Speed
 *
 * @param Speed2000:str
 * @text >= 2000 Speed
 * @parent LabelSpeed:str
 * @desc Vocabulary used for this data entry.
 * @default Fastest
 *
 * @param Speed1000:str
 * @text >= 1000 Speed
 * @parent LabelSpeed:str
 * @desc Vocabulary used for this data entry.
 * @default Faster
 *
 * @param Speed1:str
 * @text >= 1 Speed
 * @parent LabelSpeed:str
 * @desc Vocabulary used for this data entry.
 * @default Fast
 *
 * @param Speed0:str
 * @text == 0 Speed
 * @parent LabelSpeed:str
 * @desc Vocabulary used for this data entry.
 * @default Normal
 *
 * @param SpeedNeg999:str
 * @text >= -999 Speed
 * @parent LabelSpeed:str
 * @desc Vocabulary used for this data entry.
 * @default Slow
 *
 * @param SpeedNeg1999:str
 * @text >= -1999 Speed
 * @parent LabelSpeed:str
 * @desc Vocabulary used for this data entry.
 * @default Slower
 *
 * @param SpeedNeg2000:str
 * @text <= -2000 Speed
 * @parent LabelSpeed:str
 * @desc Vocabulary used for this data entry.
 * @default Slowest
 *
 * @param LabelSuccessRate:str
 * @text Success Rate
 * @parent Vocabulary
 * @desc Vocabulary used for this data entry.
 * @default Accuracy
 *
 * @param LabelRepeats:str
 * @text Repeats
 * @parent Vocabulary
 * @desc Vocabulary used for this data entry.
 * @default Hits
 *
 * @param LabelHitType:str
 * @text Hit Type
 * @parent Vocabulary
 * @desc Vocabulary used for this data entry.
 * @default Type
 *
 * @param HitType0:str
 * @text Certain Hit
 * @parent LabelHitType:str
 * @desc Vocabulary used for this data entry.
 * @default Neutral
 *
 * @param HitType1:str
 * @text Physical
 * @parent LabelHitType:str
 * @desc Vocabulary used for this data entry.
 * @default Physical
 *
 * @param HitType2:str
 * @text Magical
 * @parent LabelHitType:str
 * @desc Vocabulary used for this data entry.
 * @default Magical
 *
 * @param LabelElement:str
 * @text Element
 * @parent Vocabulary
 * @desc Vocabulary used for this data entry.
 * @default Element
 *
 * @param ElementWeapon:str
 * @text Weapon-Based
 * @parent LabelElement:str
 * @desc Vocabulary used for this data entry.
 * @default \I[97]Weapon
 *
 * @param ElementNone:str
 * @text Nonelement Element
 * @parent LabelElement:str
 * @desc Vocabulary used for this data entry.
 * @default \I[160]No Element
 *
 * @param DamageType
 * @text Damage Type
 * @parent Vocabulary
 *
 * @param DamageType1:str
 * @text HP Damage
 * @parent DamageType
 * @desc Vocabulary used for this data entry. If Visu_1_BattleCore
 * is installed, priority goes to its Damage Style settings.
 * @default %1 Damage Multiplier
 *
 * @param DamageType2:str
 * @text MP Damage
 * @parent DamageType
 * @desc Vocabulary used for this data entry. If Visu_1_BattleCore
 * is installed, priority goes to its Damage Style settings.
 * @default %1 Damage Multiplier
 *
 * @param DamageType3:str
 * @text HP Recovery
 * @parent DamageType
 * @desc Vocabulary used for this data entry. If Visu_1_BattleCore
 * is installed, priority goes to its Damage Style settings.
 * @default %1 Recovery Multiplier
 *
 * @param DamageType4:str
 * @text MP Recovery
 * @parent DamageType
 * @desc Vocabulary used for this data entry. If Visu_1_BattleCore
 * is installed, priority goes to its Damage Style settings.
 * @default %1 Recovery Multiplier
 *
 * @param DamageType5:str
 * @text HP Drain
 * @parent DamageType
 * @desc Vocabulary used for this data entry. If Visu_1_BattleCore
 * is installed, priority goes to its Damage Style settings.
 * @default %1 Drain Multiplier
 *
 * @param DamageType6:str
 * @text MP Drain
 * @parent DamageType
 * @desc Vocabulary used for this data entry. If Visu_1_BattleCore
 * is installed, priority goes to its Damage Style settings.
 * @default %1 Drain Multiplier
 *
 * @param Effects
 * @parent Vocabulary
 *
 * @param LabelRecoverHP:str
 * @text Recover HP
 * @parent Effects
 * @desc Vocabulary used for this data entry.
 * @default %1 Recovery
 *
 * @param LabelRecoverMP:str
 * @text Recover MP
 * @parent Effects
 * @desc Vocabulary used for this data entry.
 * @default %1 Recovery
 *
 * @param LabelRecoverTP:str
 * @text Recover TP
 * @parent Effects
 * @desc Vocabulary used for this data entry.
 * @default %1 Recovery
 *
 * @param LabelSelfGainTP:str
 * @text Self Gain TP
 * @parent Effects
 * @desc Vocabulary used for this data entry.
 * @default User %1
 *
 * @param LabelDamageHP:str
 * @text Damage HP
 * @parent Effects
 * @desc Vocabulary used for this data entry.
 * @default %1 Damage
 *
 * @param LabelDamageMP:str
 * @text Damage MP
 * @parent Effects
 * @desc Vocabulary used for this data entry.
 * @default %1 Damage
 *
 * @param LabelDamageTP:str
 * @text Damage TP
 * @parent Effects
 * @desc Vocabulary used for this data entry.
 * @default %1 Damage
 *
 * @param LabelApply:str
 * @text Add State/Buff
 * @parent Effects
 * @desc Vocabulary used for this data entry.
 * @default Applies
 *
 * @param LabelRemove:str
 * @text Remove State/Buff
 * @parent Effects
 * @desc Vocabulary used for this data entry.
 * @default Removes
 *
 */
//=============================================================================

const _0x4822=['LabelSpeed','drawTextEx','StatusWindow','getItemsEquipsCoreBackColor1','DrawParamJS','categoryStyleCheck','FontSize','pageup','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','ItemScene','getItemRepeatsLabel','onCategoryCancel','getItemEffectsTpRecoveryText','Scene_Shop_goldWindowRect','fontSizeRatio','HP\x20RECOVERY','onSellOk','placeItemNewLabel','getItemDamageElementText','uiMenuStyle','Scene_Shop_create','addOptimizeCommand','prepareRefreshItemsEquipsCoreLayout','ARRAYNUM','categoryList','OffsetY','Scene_Equip_itemWindowRect','LabelRepeats','isHoverEnabled','setupItemDamageTempActors','Speed2000','Scene_Equip_create','EVAL','ConvertNumberToString','onDatabaseLoaded','removeStateBuffChanges','hideNewLabelSprites','cursorRight','optimize','nextActor','itemPadding','version','getItemEffectsHpDamageLabel','_forcedSlots','mainAreaTop','isOptimizeEquipOk','isEnabled','_scene','Parse_Notetags_Category','getItemColor','buttonAssistSmallIncrement','NonRemoveETypes','setTempActor','etypeId','ARRAYFUNC','MaxWeapons','commandWindowRect','changePaintOpacity','select','cursorPagedown','value1','clearNewLabelFromItem','categoryNameWindowCenter','Game_BattlerBase_param','sellWindowRectItemsEquipsCore','initNewItemsList','Scene_Load_reloadMapIfUpdated','values','Window_Selectable_setHelpWindowItem','DrawBackRect','push','helpWindowRectItemsEquipsCore','isSoleArmorType','<%1:[\x20]([\x5c+\x5c-]\x5cd+)>','W%1','getColor','isMainMenuCoreMenuImageOptionAvailable','createCommandNameWindow','currentExt','LabelApply','isDrawItemNumber','itemWindowRect','onActorChange','ParseItemNotetags','postCreateSellWindowItemsEquipsCore','SellPriceRate','getItemDamageAmountLabel','newLabelEnabled','smoothSelect','split','equipSlots','value','CoreEngine','statusWidth','New','isShiftRemoveShortcutEnabled','ParamChangeFontSize','REMOVED\x20EFFECTS','Categories','LabelRemove','addInnerChild','windowPadding','getItemDamageAmountTextOriginal','possession','processCursorSpecialCheckModernControls','drawItemSpeed','Slots','ParseClassNotetags','ARRAYSTRUCT','_equips','SpeedNeg1999','match','weapon','process_VisuMZ_ItemsEquipsCore_Notetags','canShiftRemoveEquipment','+%1','LabelRecoverMP','isGoodShown','smallParamFontSize','_shopStatusMenuAlly','isClearEquipOk','uiHelpPosition','atypeId','categoryStyle','updateMoneyAmount','buttonAssistOffset3','EFFECT_REMOVE_DEBUFF','uiInputPosition','Scene_Shop_categoryWindowRect','registerCommand','drawItemData','refreshCursor','params','discardEquip','gainTP','drawParamName','isHandled','onBuyCancel','actorParams','_itemData','Width','Window_ItemList_colSpacing','LabelDamageTP','forceChangeEquip','changeBuff','mainFontSize','name','consumable','translucentOpacity','initEquips','drawItemEffectsTpDamage','Window_ItemCategory_initialize','numberWindowRect','powerDownColor','toUpperCase','Scene_Shop_onSellCancel','List','paramValueFontSize','drawUpdatedBeforeParamValue','Scene_Shop_createSellWindow','updateCommandNameWindow','shift','NonOptimizeETypes','getItemHitTypeLabel','ARRAYEVAL','getItemEffectsHpRecoveryText','setItemWindow','getItemDamageAmountText','constructor','getItemHitTypeText','buttonAssistKey2','postCreateItemWindowModernControls','getItemEffectsMpDamageText','setMp','addStateBuffChanges','onTouchSelectModern','height','changeEquip','active','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','_categoryNameWindow','isClicked','adjustItemWidthByStatus','_categoryWindow','loadSystem','drawNewLabelIcon','canUse','ElementNone','bitmap','Scene_Shop_commandWindowRect','refresh','armorTypes','processDrawIcon','Actors','_buttonAssistWindow','buttonAssistKey3','ParamValueFontSize','CmdStyle','removeState','contents','drawItemEffectsMpRecovery','geUpdatedLayoutStatusWidth','STR','bind','getItemQuantityText','isOptimizeCommandEnabled','boxWidth','RegExp','USER\x20TP\x20GAIN','ExtDisplayedParams','makeItemData','buyWindowRectItemsEquipsCore','normalColor','_tempActorB','weaponTypes','Step2End','refreshActorEquipSlotsIfUpdated','EnableLayout','parse','onSlotOk','isSellCommandEnabled','paramJS','createItemWindow','Window_Selectable_update','CannotEquipMarker','equip','Param','setCategory','CmdIconSell','helpAreaHeight','damageColor','item-%1','EFFECT_REMOVE_STATE','553XeqJbx','process_VisuMZ_ItemsEquipsCore_EquipSlots','mmp','ItemQuantityFontSize','pagedown','drawItemStyleIcon','maxItemAmount','ADDED\x20EFFECTS','hideAdditionalSprites','ItemSceneAdjustItemList','isCancelled','CONSUMABLE','267603pTLVtH','A%1','innerWidth','splice','ItemMenuStatusRect','commandNameWindowDrawText','weapon-%1','meetsItemConditionsNotetags','EquipScene','map','numberWindowRectItemsEquipsCore','Scene_Item_itemWindowRect','drawItemRepeats','statusWindowRect','_slotId','paintOpacity','getTextColor','KeyItemProtect','339875XzBtio','getItemEffectsSelfTpGainText','fillRect','NoChangeMarker','onCategoryCancelItemsEquipsCore','elementId','Game_Actor_changeEquip','processCursorMoveModernControls','Parse_Notetags_EnableJS','VisuMZ_1_BattleCore','onCategoryOk','isPlaytest','clearNewItem','LabelRecoverHP','deactivate','Parse_Notetags_Batch','setItem','HP\x20DAMAGE','LabelSuccessRate','fontSize','MaxIcons','buttonAssistRemove','categoryNameWindowDrawText','isRepeated','KeyItems','callUpdateHelp','addCancelCommand','HiddenItemB','loadCharacter','canConsumeItem','getMatchingInitEquip','Speed0','isCommandEnabled','onTouchSelect','text','MDF','Game_Party_gainItem','onTouchCancel','successRate','addSellCommand','gaugeBackColor','SCOPE','itemEnableJS','addEquipCommand','initNewLabelSprites','equipAdjustHpMp','DrawIcons','getItemEffectsRemovedStatesBuffsText','getItemDamageAmountTextBattleCore','isEquipItem','Scene_Shop_onSellOk','postCreateSlotWindowItemsEquipsCore','addChild','drawParamsItemsEquipsCore','replace','isUseItemsEquipsCoreUpdatedLayout','getItemEffectsTpRecoveryLabel','hitType','drawUpdatedParamValueDiff','onTouchSelectModernControls','buttonAssistCategory','LabelDamageHP','isShowNew','_newItemsList','getItemsEquipsCoreBackColor2','Parse_Notetags_ParamValues','itemLineRect','isWeapon','AllArmors','AGI','_newLabelOpacityUpperLimit','checkShiftRemoveShortcut','ShopMenuStatusStandard','CmdCancelRename','popScene','mpRate','lineHeight','Scene_Item_createCategoryWindow','checkItemConditionsSwitchNotetags','_data','wtypeId','_slotWindow','Scene_Equip_slotWindowRect','meetsItemConditionsJS','ScopeAlliesButUser','buttonAssistText1','textColor','changeEquipById','onBuyCancelItemsEquipsCore','isBuyCommandEnabled','currencyUnit','drawItemEffectsHpRecovery','drawPossession','SpeedNeg999','currentClass','processTouchModernControls','getItemEffectsAddedStatesBuffsText','textWidth','RemoveEquipIcon','JSON','smoothScrollTo','type','scope','getItemEffectsSelfTpGainLabel','opacity','AlwaysUsable','code','CommandAddOptimize','FontColor','elements','DrawPortraitJS','buttonAssistText3','BattleUsable','setHandler','commandSell','_category','getItemRepeatsText','buttonAssistSlotWindowShift','isRightInputMode','ScopeRandomEnemies','activateSellWindow','Game_BattlerBase_meetsItemConditions','getItemDamageElementLabel','damage','EquipParams','VisuMZ_0_CoreEngine','_numberWindow','clearEquipments','getItemConsumableText','SellPriceJS','buffIconIndex','CommandAddClear','%1%','ItemQuantityFmt','paramPlus','convertInitEquipsToItems','setHp','price','commandStyle','versionId','drawItemEffectsMpDamage','playCursorSound','onTouchOk','buttonAssistItemListRequirement','getItemEffectsRemovedStatesBuffsLabel','Scene_Shop_buyWindowRect','Window_ShopCommand_initialize','MultiplierStandard','itemWindowRectItemsEquipsCore','AlreadyEquipMarker','Window_ItemCategory_setItemWindow','reloadMapIfUpdated','drawNewLabelText','helpWindowRect','setNewItem','getItemSpeedLabel','2941grLrQI','BackRectColor','Window_ShopBuy_price','drawRemoveItem','center','Scene_Equip_onSlotCancel','_newLabelOpacityChange','Window_ItemList_maxCols','itemAt','isOpenAndActive','createNewLabelSprite','_itemWindow','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20enabled\x20=\x20true;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20enabled;\x0a\x20\x20\x20\x20\x20\x20\x20\x20','tpGain','getItemEffectsHpRecoveryLabel','97RlWvBF','currentSymbol','activate','prepareNewEquipSlotsOnLoad','createStatusWindow','cursorLeft','addCommand','drawItemEffectsHpDamage','_commandNameWindow','×%1','value2','hideDisabledCommands','Window_EquipCommand_initialize','paramchangeTextColor','description','DrawFaceJS','tradeItemWithParty','EFFECT_ADD_DEBUFF','drawText','onMenuImageLoad','trim','EFFECT_RECOVER_MP','processCursorHomeEndTrigger','allowCommandWindowCursorUp','categoryWindowRectItemsEquipsCore','CmdIconClear','maxCols','_newLabelSprites','armor','LabelRecoverTP','setObject','iconIndex','postCreateCategoryWindowItemsEquipsCore','MaxMP','createCategoryWindow','prepare','effects','setHelpWindowItem','equips','dataId','defaultItemMax','hide','systemColor','getItemDamageAmountLabelOriginal','isBottomHelpMode','Settings','\x5cI[%1]','helpAreaTop','addClearCommand','CmdIconEquip','clamp','getItemEffectsTpDamageText','maxItems','sellWindowRect','RegularItems','remove','isSoleWeaponType','isEquipChangeOk','Window_ShopBuy_refresh','drawItem','mhp','contentsBack','sell','drawItemNumber','drawItemDarkRect','getItemEffectsMpRecoveryText','isPageChangeRequested','234359gNJdMF','Scene_Shop_createCategoryWindow','ScopeRandomAllies','_actor','nonRemovableEtypes','item','getItemSpeedText','drawParamText','exit','commandNameWindowCenter','_tempActor','MP\x20DAMAGE','left','goldWindowRectItemsEquipsCore','updateCategoryNameWindow','clear','cursorPageup','ceil','keyItem','armor-%1','Speed1','isClearCommandEnabled','HitType%1','playBuzzerSound','createBitmap','ConvertParams','buy','_buyWindowLastIndex','cursorDown','addLoadListener','setBackgroundType','(+%1)','getItemSuccessRateLabel','buttonAssistText2','selfTP','Scene_Shop_sellWindowRect','MaxItems','drawItemScope','IncludeShopItem','slotWindowRect','nonOptimizeEtypes','REPEAT','releaseUnequippableItems','Game_Actor_tradeItemWithParty','width','paramValueByName','colSpacing','getInputMultiButtonStrings','processCursorMove','max','isOptimizeCommandAdded','Window_EquipStatus_refresh','commandWindowRectItemsEquipsCore','CmdHideDisabled','loadPicture','1KjqrRz','getItemEffectsMpDamageLabel','_statusWindow','addItemCategory','iconText','1iJrUGh','commandEquip','HIT\x20TYPE','floor','buyWindowRect','optKeyItemsNumber','getMenuImage','status','removeDebuff','Window_ShopSell_isEnabled','onSlotCancel','hitIndex','getDamageStyle','Parse_Notetags_Prices','TP\x20RECOVERY','SpeedNeg2000','_tempActorA','drawItemStyleIconText','Scene_Equip_onSlotOk','commandSellItemsEquipsCore','activateItemWindow','scrollTo','QUANTITY','commandNameWindowDrawBackground','prepareItemCustomData','move','return\x200','equipSlotIndex','repeats','parameters','forceChangeEquipSlots','_goodsCount','ShiftShortcutKey','powerUpColor','Scene_Shop_activateSellWindow','create','onSellCancel','isUseModernControls','getItemConsumableLabel','Scope%1','update','createSellWindow','Consumable','equip2','onSellOkItemsEquipsCore','EFFECT_ADD_BUFF','speed','adjustHiddenShownGoods','call','commandName','Step3Start','visible','EquipAdjustHpMp','removeBuff','AllItems','isCursorMovable','EFFECT_ADD_STATE','includes','right','numItems','FieldUsable','isTriggered','icon','isUseParamNamesWithIcons','revertGlobalNamespaceVariables','updateHelp','TP\x20DAMAGE','drawEquipData','process_VisuMZ_ItemsEquipsCore_RegExp','isPressed','_sellWindow','prototype','Window_ItemList_drawItem','BorderRegExp','ParseArmorNotetags','MaxHP','Scene_Equip_commandWindowRect','mainFontFace','Damage\x20Formula\x20Error\x20for\x20%1','drawIcon','goldWindowRect','drawItemActorMenuImage','note','Window_ItemList_updateHelp','ItemMenuStatusBgType','rateMP','_dummyWindow','_doubleTouch','FUNC','allowShiftScrolling','addState','MaxArmors','Game_Actor_forceChangeEquip','Game_Actor_discardEquip','Scene_Shop_onCategoryCancel','deselect','_money','allowCreateStatusWindow','_list','makeDeepCopy','Scene_Shop_commandSell','_item','length','itypeId','rateHP','MP\x20RECOVERY','isDualWield','indexOf','_bypassNewLabel','Nonconsumable','param','iconWidth','MAT','isKeyItem','Type','format','round','loadFaceImages','mainAreaHeight','STRUCT','sellingPrice','Whitelist','forceResetEquipSlots','Scene_Shop_statusWindowRect','createCategoryNameWindow','drawItemName','SUCCESS\x20RATE','ARRAYSTR','processHandling','filter','drawActorParamDifference','sellPriceRate','occasion','_resetFontColor','isShiftShortcutKeyForRemove','ScopeRandomAny','auto','bestEquipItem','Scene_Shop_numberWindowRect','MANUAL','(%1)','formula','money','VisuMZ_1_MainMenuCore','getItemEffectsMpRecoveryLabel','mainCommandWidth','meetsItemConditions','Scene_Equip_createSlotWindow','OffsetX','RemoveEquipText','Window_EquipItem_isEnabled','resetTextColor','_calculatingJSParameters','ItemsEquipsCore','fill','isClearCommandAdded','Scene_Boot_onDatabaseLoaded','Window_EquipItem_includes','cursorUp','makeCommandList','getItemEffectsHpDamageText','getItemSuccessRateText','playOkSound','categoryNameWindowDrawBackground','index','drawItemEffectsTpRecovery','equipTypes','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20MaxHP\x20=\x200;\x20let\x20MaxMP\x20=\x200;\x20let\x20ATK\x20=\x200;\x20let\x20DEF\x20=\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20MAT\x20=\x200;\x20let\x20MDF\x20=\x200;\x20let\x20AGI\x20=\x200;\x20let\x20LUK\x20=\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20[MaxHP,\x20MaxMP,\x20ATK,\x20DEF,\x20MAT,\x20MDF,\x20AGI,\x20LUK][paramId];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20','SPEED','?????','isArmor','_buyWindow','commandStyleCheck','ShopScene','LabelSelfGainTP','changeTextColor','Scene_Item_create','Scene_Equip_commandEquip','categoryWindowRect','DrawItemData','DEF','ParseAllNotetags','categories','Text','+%1%','\x5cI[%1]%2','drawItemDamageAmount','Step3End','Scene_Equip_onActorChange','Step1Start','Scene_Shop_commandBuy','setShopStatusWindowMode','postCreateItemsEquipsCore','CmdTextAlign','refreshItemsEquipsCoreNoMenuImage','_newLabelOpacity','commandBuyItemsEquipsCore','commandBuy','Window_Selectable_initialize','_customItemInfo','flatMP','Scene_Item_categoryWindowRect','Scene_Shop_prepare','createSlotWindow','drawItemCost','gainItem','actor','ParseWeaponNotetags','show','shouldCommandWindowExist','setStatusWindow','259FqDVOe','slotWindowRectItemsEquipsCore','Icon','isOpen','processShiftRemoveShortcut','Parse_Notetags_EquipSlots','statusWindowRectItemsEquipsCore','previousActor','canEquip','_purchaseOnly','drawItemEffects','NeverUsable','_shopStatusMenuMode','down','Step2Start','getItemEffectsTpDamageLabel','drawItemCustomEntryLine','addBuyCommand','#%1','Scene_Equip_statusWindowRect','isEquipCommandEnabled','QoL','resetFontSettings','buttonAssistKey1','getItemDamageAmountLabelBattleCore','currentEquippedItem','Scene_Item_createItemWindow','TextAlign','90002bwKijt','_commandWindow','isItem','optimizeEquipments','LayoutStyle','Step1End','iconHeight','HiddenItemA','LabelDamageMP','hpRate','isEquipCommandAdded','flatHP','Parse_Notetags_ParamJS','modifiedBuyPriceItemsEquipsCore','IconSet','ActorChangeEquipSlots','getNextAvailableEtypeId','members','1360045kALLZy','drawItemKeyData','addWindow','fontFace','calcWindowHeight','paramPlusItemsEquipsCoreCustomJS','initialize','updatedLayoutStyle','_handlers','drawItemEquipType','Game_Party_initialize','cancel','textSizeEx','_resetFontSize','onSlotOkAutoSelect','log','Window_Selectable_refresh','drawItemConsumable','itemTextAlign','blt','Game_Actor_paramPlus','BatchShop'];const _0x2b7c=function(_0x28f7a3,_0x44847a){_0x28f7a3=_0x28f7a3-0x1d2;let _0x48227d=_0x4822[_0x28f7a3];return _0x48227d;};const _0x2459ae=_0x2b7c;(function(_0x1e281f,_0x50a519){const _0x57dd91=_0x2b7c;while(!![]){try{const _0x162cf2=-parseInt(_0x57dd91(0x293))+-parseInt(_0x57dd91(0x4cf))*parseInt(_0x57dd91(0x3a2))+parseInt(_0x57dd91(0x250))*-parseInt(_0x57dd91(0x241))+-parseInt(_0x57dd91(0x4db))+parseInt(_0x57dd91(0x3be))+-parseInt(_0x57dd91(0x2cf))*parseInt(_0x57dd91(0x4ed))+-parseInt(_0x57dd91(0x3d0))*-parseInt(_0x57dd91(0x2ca));if(_0x162cf2===_0x50a519)break;else _0x1e281f['push'](_0x1e281f['shift']());}catch(_0x332e2a){_0x1e281f['push'](_0x1e281f['shift']());}}}(_0x4822,0x2bdfa));var label=_0x2459ae(0x368),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x2459ae(0x350)](function(_0x399306){const _0x239b36=_0x2459ae;return _0x399306[_0x239b36(0x2d6)]&&_0x399306['description']['includes']('['+label+']');})[0x0];VisuMZ[label][_0x2459ae(0x27d)]=VisuMZ[label][_0x2459ae(0x27d)]||{},VisuMZ['ConvertParams']=function(_0x33612a,_0x416d98){const _0x356da0=_0x2459ae;for(const _0x466dcc in _0x416d98){if(_0x466dcc[_0x356da0(0x455)](/(.*):(.*)/i)){const _0x3a6daa=String(RegExp['$1']),_0x3e6aec=String(RegExp['$2'])['toUpperCase']()[_0x356da0(0x264)]();let _0x539fe2,_0x1d35ed,_0x4dc7e7;switch(_0x3e6aec){case'NUM':_0x539fe2=_0x416d98[_0x466dcc]!==''?Number(_0x416d98[_0x466dcc]):0x0;break;case _0x356da0(0x3fd):_0x1d35ed=_0x416d98[_0x466dcc]!==''?JSON[_0x356da0(0x4c0)](_0x416d98[_0x466dcc]):[],_0x539fe2=_0x1d35ed[_0x356da0(0x4e4)](_0x98d52=>Number(_0x98d52));break;case _0x356da0(0x406):_0x539fe2=_0x416d98[_0x466dcc]!==''?eval(_0x416d98[_0x466dcc]):null;break;case _0x356da0(0x48a):_0x1d35ed=_0x416d98[_0x466dcc]!==''?JSON['parse'](_0x416d98[_0x466dcc]):[],_0x539fe2=_0x1d35ed[_0x356da0(0x4e4)](_0x2c20cc=>eval(_0x2c20cc));break;case _0x356da0(0x208):_0x539fe2=_0x416d98[_0x466dcc]!==''?JSON[_0x356da0(0x4c0)](_0x416d98[_0x466dcc]):'';break;case'ARRAYJSON':_0x1d35ed=_0x416d98[_0x466dcc]!==''?JSON[_0x356da0(0x4c0)](_0x416d98[_0x466dcc]):[],_0x539fe2=_0x1d35ed[_0x356da0(0x4e4)](_0x31c2a2=>JSON[_0x356da0(0x4c0)](_0x31c2a2));break;case _0x356da0(0x327):_0x539fe2=_0x416d98[_0x466dcc]!==''?new Function(JSON[_0x356da0(0x4c0)](_0x416d98[_0x466dcc])):new Function(_0x356da0(0x2e9));break;case _0x356da0(0x41c):_0x1d35ed=_0x416d98[_0x466dcc]!==''?JSON[_0x356da0(0x4c0)](_0x416d98[_0x466dcc]):[],_0x539fe2=_0x1d35ed['map'](_0xe5ac6d=>new Function(JSON[_0x356da0(0x4c0)](_0xe5ac6d)));break;case _0x356da0(0x4b0):_0x539fe2=_0x416d98[_0x466dcc]!==''?String(_0x416d98[_0x466dcc]):'';break;case _0x356da0(0x34e):_0x1d35ed=_0x416d98[_0x466dcc]!==''?JSON[_0x356da0(0x4c0)](_0x416d98[_0x466dcc]):[],_0x539fe2=_0x1d35ed[_0x356da0(0x4e4)](_0x443431=>String(_0x443431));break;case _0x356da0(0x346):_0x4dc7e7=_0x416d98[_0x466dcc]!==''?JSON[_0x356da0(0x4c0)](_0x416d98[_0x466dcc]):{},_0x33612a[_0x3a6daa]={},VisuMZ[_0x356da0(0x2ac)](_0x33612a[_0x3a6daa],_0x4dc7e7);continue;case _0x356da0(0x452):_0x1d35ed=_0x416d98[_0x466dcc]!==''?JSON[_0x356da0(0x4c0)](_0x416d98[_0x466dcc]):[],_0x539fe2=_0x1d35ed[_0x356da0(0x4e4)](_0x27daa6=>VisuMZ[_0x356da0(0x2ac)]({},JSON[_0x356da0(0x4c0)](_0x27daa6)));break;default:continue;}_0x33612a[_0x3a6daa]=_0x539fe2;}}return _0x33612a;},(_0x31e692=>{const _0x332818=_0x2459ae,_0x1c90dd=_0x31e692['name'];for(const _0x44e4cd of dependencies){if(!Imported[_0x44e4cd]){alert('%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.'['format'](_0x1c90dd,_0x44e4cd)),SceneManager['exit']();break;}}const _0x2325da=_0x31e692[_0x332818(0x25e)];if(_0x2325da[_0x332818(0x455)](/\[Version[ ](.*?)\]/i)){const _0x43152a=Number(RegExp['$1']);_0x43152a!==VisuMZ[label][_0x332818(0x40f)]&&(alert(_0x332818(0x499)[_0x332818(0x342)](_0x1c90dd,_0x43152a)),SceneManager['exit']());}if(_0x2325da['match'](/\[Tier[ ](\d+)\]/i)){const _0x4cc3da=Number(RegExp['$1']);_0x4cc3da<tier?(alert(_0x332818(0x3ee)[_0x332818(0x342)](_0x1c90dd,_0x4cc3da,tier)),SceneManager[_0x332818(0x29b)]()):tier=Math['max'](_0x4cc3da,tier);}VisuMZ['ConvertParams'](VisuMZ[label][_0x332818(0x27d)],_0x31e692[_0x332818(0x2ec)]);})(pluginData),PluginManager[_0x2459ae(0x467)](pluginData[_0x2459ae(0x478)],_0x2459ae(0x3cd),_0x4b428a=>{const _0x60d110=_0x2459ae;VisuMZ[_0x60d110(0x2ac)](_0x4b428a,_0x4b428a);const _0x568dcf=_0x4b428a['Actors'][_0x60d110(0x4e4)](_0x5bf4c1=>$gameActors['actor'](_0x5bf4c1)),_0x43e12f=_0x4b428a[_0x60d110(0x450)][_0x60d110(0x4e4)](_0x404cd1=>$dataSystem[_0x60d110(0x375)][_0x60d110(0x33a)](_0x404cd1[_0x60d110(0x264)]()));for(const _0x3ec533 of _0x568dcf){if(!_0x3ec533)continue;_0x3ec533['forceChangeEquipSlots'](_0x43e12f);}}),PluginManager[_0x2459ae(0x467)](pluginData[_0x2459ae(0x478)],'ActorResetEquipSlots',_0x3e362d=>{const _0x1cf383=_0x2459ae;VisuMZ[_0x1cf383(0x2ac)](_0x3e362d,_0x3e362d);const _0x54e322=_0x3e362d[_0x1cf383(0x4a7)]['map'](_0x28e3d8=>$gameActors[_0x1cf383(0x39d)](_0x28e3d8));for(const _0x36ef72 of _0x54e322){if(!_0x36ef72)continue;_0x36ef72[_0x1cf383(0x349)]();}}),PluginManager[_0x2459ae(0x467)](pluginData['name'],_0x2459ae(0x3e5),_0x244b6e=>{const _0x3a963a=_0x2459ae;VisuMZ[_0x3a963a(0x2ac)](_0x244b6e,_0x244b6e);const _0x14dce2=[],_0x4aeac6=_0x244b6e['Blacklist'][_0x3a963a(0x4e4)](_0x12759d=>_0x12759d[_0x3a963a(0x480)]()[_0x3a963a(0x264)]()),_0x1b4537=_0x244b6e[_0x3a963a(0x348)][_0x3a963a(0x4e4)](_0xdaf538=>_0xdaf538[_0x3a963a(0x480)]()[_0x3a963a(0x264)]()),_0x4289e4=_0x244b6e[_0x3a963a(0x3c3)]>=_0x244b6e[_0x3a963a(0x38c)]?_0x244b6e[_0x3a963a(0x38c)]:_0x244b6e[_0x3a963a(0x3c3)],_0x4b8890=_0x244b6e[_0x3a963a(0x3c3)]>=_0x244b6e[_0x3a963a(0x38c)]?_0x244b6e[_0x3a963a(0x3c3)]:_0x244b6e[_0x3a963a(0x38c)],_0x560e97=Array(_0x4b8890-_0x4289e4+0x1)['fill']()[_0x3a963a(0x4e4)]((_0x34bc98,_0x4a1763)=>_0x4289e4+_0x4a1763);for(const _0x19593a of _0x560e97){const _0xe71801=$dataItems[_0x19593a];if(!_0xe71801)continue;if(!VisuMZ[_0x3a963a(0x368)][_0x3a963a(0x2b9)](_0xe71801,_0x4aeac6,_0x1b4537))continue;_0x14dce2[_0x3a963a(0x42c)]([0x0,_0x19593a,0x0,_0xe71801['price']]);}const _0x5eb3ba=_0x244b6e[_0x3a963a(0x4bd)]>=_0x244b6e[_0x3a963a(0x3b0)]?_0x244b6e[_0x3a963a(0x3b0)]:_0x244b6e[_0x3a963a(0x4bd)],_0x24119d=_0x244b6e['Step2End']>=_0x244b6e[_0x3a963a(0x3b0)]?_0x244b6e[_0x3a963a(0x4bd)]:_0x244b6e[_0x3a963a(0x3b0)],_0x3374a6=Array(_0x24119d-_0x5eb3ba+0x1)[_0x3a963a(0x369)]()['map']((_0x51bde9,_0x2416f6)=>_0x5eb3ba+_0x2416f6);for(const _0x4501f5 of _0x3374a6){const _0x48648b=$dataWeapons[_0x4501f5];if(!_0x48648b)continue;if(!VisuMZ[_0x3a963a(0x368)][_0x3a963a(0x2b9)](_0x48648b,_0x4aeac6,_0x1b4537))continue;_0x14dce2[_0x3a963a(0x42c)]([0x1,_0x4501f5,0x0,_0x48648b[_0x3a963a(0x22e)]]);}const _0x18b044=_0x244b6e['Step3End']>=_0x244b6e['Step3Start']?_0x244b6e[_0x3a963a(0x301)]:_0x244b6e[_0x3a963a(0x38a)],_0x2a3ba9=_0x244b6e[_0x3a963a(0x38a)]>=_0x244b6e[_0x3a963a(0x301)]?_0x244b6e[_0x3a963a(0x38a)]:_0x244b6e[_0x3a963a(0x301)],_0x54df6e=Array(_0x2a3ba9-_0x18b044+0x1)[_0x3a963a(0x369)]()['map']((_0x974b46,_0x229e93)=>_0x18b044+_0x229e93);for(const _0x459867 of _0x54df6e){const _0x1909e6=$dataArmors[_0x459867];if(!_0x1909e6)continue;if(!VisuMZ[_0x3a963a(0x368)][_0x3a963a(0x2b9)](_0x1909e6,_0x4aeac6,_0x1b4537))continue;_0x14dce2[_0x3a963a(0x42c)]([0x2,_0x459867,0x0,_0x1909e6[_0x3a963a(0x22e)]]);}SceneManager['push'](Scene_Shop),SceneManager['prepareNextScene'](_0x14dce2,_0x244b6e['PurchaseOnly']);}),VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x2b9)]=function(_0x2b8c97,_0x2f9f8b,_0x1e9c08){const _0x3595d0=_0x2459ae;if(_0x2b8c97[_0x3595d0(0x478)][_0x3595d0(0x264)]()==='')return![];if(_0x2b8c97['name']['match'](/-----/i))return![];const _0x208b7e=_0x2b8c97['categories'];if(_0x2f9f8b[_0x3595d0(0x335)]>0x0)for(const _0x5b9dba of _0x2f9f8b){if(!_0x5b9dba)continue;if(_0x208b7e['includes'](_0x5b9dba))return![];}if(_0x1e9c08['length']>0x0){for(const _0x178ed6 of _0x1e9c08){if(!_0x178ed6)continue;if(_0x208b7e['includes'](_0x178ed6))return!![];}return![];}return!![];},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x36b)]=Scene_Boot[_0x2459ae(0x316)][_0x2459ae(0x408)],Scene_Boot['prototype']['onDatabaseLoaded']=function(){const _0x2ad1c8=_0x2459ae;this[_0x2ad1c8(0x313)](),VisuMZ['ItemsEquipsCore'][_0x2ad1c8(0x36b)]['call'](this),this[_0x2ad1c8(0x457)]();},Scene_Boot[_0x2459ae(0x316)][_0x2459ae(0x313)]=function(){const _0x12c176=_0x2459ae;VisuMZ['ItemsEquipsCore'][_0x12c176(0x4b5)]={},VisuMZ[_0x12c176(0x368)][_0x12c176(0x4b5)][_0x12c176(0x221)]=[],VisuMZ['ItemsEquipsCore'][_0x12c176(0x4b5)]['BorderRegExp']=[];const _0x4780f4=[_0x12c176(0x31a),_0x12c176(0x271),'ATK',_0x12c176(0x383),_0x12c176(0x33f),_0x12c176(0x510),_0x12c176(0x1ea),'LUK'];for(const _0x2282ac of _0x4780f4){const _0x4f5b86=_0x12c176(0x42f)[_0x12c176(0x342)](_0x2282ac);VisuMZ[_0x12c176(0x368)][_0x12c176(0x4b5)][_0x12c176(0x221)][_0x12c176(0x42c)](new RegExp(_0x4f5b86,'i'));const _0x2f1f3d='\x5cb%1\x5cb'[_0x12c176(0x342)](_0x2282ac);VisuMZ[_0x12c176(0x368)][_0x12c176(0x4b5)][_0x12c176(0x318)][_0x12c176(0x42c)](new RegExp(_0x2f1f3d,'g'));}},Scene_Boot[_0x2459ae(0x316)]['process_VisuMZ_ItemsEquipsCore_Notetags']=function(){const _0x4769ff=_0x2459ae;if(VisuMZ[_0x4769ff(0x384)])return;this[_0x4769ff(0x4d0)]();const _0x2bb6a0=[$dataItems,$dataWeapons,$dataArmors];for(const _0x3b7da6 of _0x2bb6a0){for(const _0x50f77a of _0x3b7da6){if(!_0x50f77a)continue;VisuMZ[_0x4769ff(0x368)][_0x4769ff(0x416)](_0x50f77a,_0x3b7da6),VisuMZ['ItemsEquipsCore'][_0x4769ff(0x2dc)](_0x50f77a,_0x3b7da6),VisuMZ['ItemsEquipsCore'][_0x4769ff(0x1e6)](_0x50f77a,_0x3b7da6),VisuMZ[_0x4769ff(0x368)]['Parse_Notetags_ParamJS'](_0x50f77a,_0x3b7da6),VisuMZ[_0x4769ff(0x368)]['Parse_Notetags_EnableJS'](_0x50f77a,_0x3b7da6);}}},Scene_Boot[_0x2459ae(0x316)][_0x2459ae(0x4d0)]=function(){const _0x25a994=_0x2459ae;for(const _0x4f7674 of $dataClasses){if(!_0x4f7674)continue;VisuMZ[_0x25a994(0x368)][_0x25a994(0x3a7)](_0x4f7674);}},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x451)]=VisuMZ[_0x2459ae(0x451)],VisuMZ[_0x2459ae(0x451)]=function(_0x3a31e2){const _0x189f19=_0x2459ae;VisuMZ['ItemsEquipsCore']['ParseClassNotetags'][_0x189f19(0x2ff)](this,_0x3a31e2),VisuMZ['ItemsEquipsCore'][_0x189f19(0x3a7)](_0x3a31e2);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x439)]=VisuMZ[_0x2459ae(0x439)],VisuMZ[_0x2459ae(0x439)]=function(_0x56cfd5){const _0x37f478=_0x2459ae;VisuMZ[_0x37f478(0x368)][_0x37f478(0x439)]['call'](this,_0x56cfd5),VisuMZ['ItemsEquipsCore'][_0x37f478(0x4fc)](_0x56cfd5,$dataItems);},VisuMZ['ItemsEquipsCore']['ParseWeaponNotetags']=VisuMZ[_0x2459ae(0x39e)],VisuMZ[_0x2459ae(0x39e)]=function(_0x1fe709){const _0x77a4e5=_0x2459ae;VisuMZ[_0x77a4e5(0x368)]['ParseWeaponNotetags'][_0x77a4e5(0x2ff)](this,_0x1fe709),VisuMZ[_0x77a4e5(0x368)][_0x77a4e5(0x4fc)](_0x1fe709,$dataWeapons);},VisuMZ[_0x2459ae(0x368)]['ParseArmorNotetags']=VisuMZ[_0x2459ae(0x319)],VisuMZ[_0x2459ae(0x319)]=function(_0xeec446){const _0x4f43e9=_0x2459ae;VisuMZ[_0x4f43e9(0x368)][_0x4f43e9(0x319)][_0x4f43e9(0x2ff)](this,_0xeec446),VisuMZ[_0x4f43e9(0x368)][_0x4f43e9(0x4fc)](_0xeec446,$dataArmors);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x3a7)]=function(_0x46a26a){const _0x4562bb=_0x2459ae;_0x46a26a[_0x4562bb(0x440)]=[];if(_0x46a26a[_0x4562bb(0x321)][_0x4562bb(0x455)](/<EQUIP SLOTS>\s*([\s\S]*)\s*<\/EQUIP SLOTS>/i)){const _0x326752=String(RegExp['$1'])['split'](/[\r\n]+/);for(const _0xdd3c8e of _0x326752){const _0x168d9e=$dataSystem[_0x4562bb(0x375)]['indexOf'](_0xdd3c8e[_0x4562bb(0x264)]());if(_0x168d9e>0x0)_0x46a26a[_0x4562bb(0x440)]['push'](_0x168d9e);}}else for(const _0x28f9b6 of $dataSystem[_0x4562bb(0x375)]){const _0x389426=$dataSystem['equipTypes'][_0x4562bb(0x33a)](_0x28f9b6[_0x4562bb(0x264)]());if(_0x389426>0x0)_0x46a26a[_0x4562bb(0x440)][_0x4562bb(0x42c)](_0x389426);}},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x4fc)]=function(_0x2cf72a,_0x53d3cd){const _0x120fac=_0x2459ae;VisuMZ[_0x120fac(0x368)][_0x120fac(0x416)](_0x2cf72a,_0x53d3cd),VisuMZ['ItemsEquipsCore'][_0x120fac(0x2dc)](_0x2cf72a,_0x53d3cd),VisuMZ[_0x120fac(0x368)][_0x120fac(0x1e6)](_0x2cf72a,_0x53d3cd),VisuMZ['ItemsEquipsCore'][_0x120fac(0x3ca)](_0x2cf72a,_0x53d3cd),VisuMZ[_0x120fac(0x368)][_0x120fac(0x4f5)](_0x2cf72a,_0x53d3cd);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x416)]=function(_0x20e295,_0x4f2c4f){const _0x1cd037=_0x2459ae;_0x20e295[_0x1cd037(0x385)]=[];const _0x191953=_0x20e295[_0x1cd037(0x321)],_0x306a09=_0x191953[_0x1cd037(0x455)](/<(?:CATEGORY|CATEGORIES):[ ](.*)>/gi);if(_0x306a09)for(const _0x4f8a2b of _0x306a09){_0x4f8a2b[_0x1cd037(0x455)](/<(?:CATEGORY|CATEGORIES):[ ](.*)>/gi);const _0x5303d0=String(RegExp['$1'])[_0x1cd037(0x480)]()[_0x1cd037(0x264)]()['split'](',');for(const _0x534e11 of _0x5303d0){_0x20e295[_0x1cd037(0x385)][_0x1cd037(0x42c)](_0x534e11[_0x1cd037(0x264)]());}}if(_0x191953[_0x1cd037(0x455)](/<(?:CATEGORY|CATEGORIES)>\s*([\s\S]*)\s*<\/(?:CATEGORY|CATEGORIES)>/i)){const _0x28dfb8=RegExp['$1']['split'](/[\r\n]+/);for(const _0xcffab5 of _0x28dfb8){_0x20e295[_0x1cd037(0x385)][_0x1cd037(0x42c)](_0xcffab5['toUpperCase']()[_0x1cd037(0x264)]());}}},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x2dc)]=function(_0x3afbe4,_0x3e33ae){const _0x467ab9=_0x2459ae;_0x3afbe4['note'][_0x467ab9(0x455)](/<PRICE:[ ](\d+)>/i)&&(_0x3afbe4[_0x467ab9(0x22e)]=Number(RegExp['$1']));},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x1e6)]=function(_0x1959f3,_0x5056b8){const _0x429c3d=_0x2459ae;if(_0x5056b8===$dataItems)return;for(let _0x3c5451=0x0;_0x3c5451<0x8;_0x3c5451++){const _0x40496e=VisuMZ[_0x429c3d(0x368)][_0x429c3d(0x4b5)][_0x429c3d(0x221)][_0x3c5451];_0x1959f3[_0x429c3d(0x321)][_0x429c3d(0x455)](_0x40496e)&&(_0x1959f3[_0x429c3d(0x46a)][_0x3c5451]=parseInt(RegExp['$1']));}},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x4c3)]={},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x3ca)]=function(_0x15376d,_0x5bc280){const _0x4b1689=_0x2459ae;if(_0x5bc280===$dataItems)return;if(_0x15376d[_0x4b1689(0x321)][_0x4b1689(0x455)](/<JS PARAMETERS>\s*([\s\S]*)\s*<\/JS PARAMETERS>/i)){const _0x12ccb7=String(RegExp['$1']),_0x381a9e=(_0x5bc280===$dataWeapons?'W%1':'A%1')[_0x4b1689(0x342)](_0x15376d['id']),_0x3ea51f=_0x4b1689(0x376)['format'](_0x12ccb7);for(let _0x2630ad=0x0;_0x2630ad<0x8;_0x2630ad++){if(_0x12ccb7['match'](VisuMZ['ItemsEquipsCore']['RegExp']['BorderRegExp'][_0x2630ad])){const _0x480c3e='%1-%2'[_0x4b1689(0x342)](_0x381a9e,_0x2630ad);VisuMZ['ItemsEquipsCore'][_0x4b1689(0x4c3)][_0x480c3e]=new Function(_0x4b1689(0x298),'paramId',_0x3ea51f);}}}},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x517)]={},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x4f5)]=function(_0x270e5b,_0x224a52){const _0x21bff1=_0x2459ae;if(_0x224a52!==$dataItems)return;if(_0x270e5b[_0x21bff1(0x321)][_0x21bff1(0x455)](/<JS ITEM ENABLE>\s*([\s\S]*)\s*<\/JS ITEM ENABLE>/i)){const _0x5ab8d6=String(RegExp['$1']),_0x31f9d3=_0x21bff1(0x24d)['format'](_0x5ab8d6);VisuMZ['ItemsEquipsCore'][_0x21bff1(0x517)][_0x270e5b['id']]=new Function('item',_0x31f9d3);}},DataManager[_0x2459ae(0x340)]=function(_0x39cc05){const _0x3984c7=_0x2459ae;return this['isItem'](_0x39cc05)&&_0x39cc05[_0x3984c7(0x336)]===0x2;},DataManager[_0x2459ae(0x4d5)]=function(_0x16e4d0){const _0x359517=_0x2459ae;if(!_0x16e4d0)return 0x63;else return _0x16e4d0[_0x359517(0x321)][_0x359517(0x455)](/<MAX:[ ](\d+)>/i)?parseInt(RegExp['$1']):this[_0x359517(0x278)](_0x16e4d0);},DataManager[_0x2459ae(0x278)]=function(_0x2b45ba){const _0x46c104=_0x2459ae;if(this['isItem'](_0x2b45ba))return VisuMZ['ItemsEquipsCore'][_0x46c104(0x27d)]['ItemScene'][_0x46c104(0x2b7)];else{if(this[_0x46c104(0x1e8)](_0x2b45ba))return VisuMZ[_0x46c104(0x368)][_0x46c104(0x27d)][_0x46c104(0x3ef)][_0x46c104(0x41d)];else{if(this[_0x46c104(0x379)](_0x2b45ba))return VisuMZ[_0x46c104(0x368)][_0x46c104(0x27d)][_0x46c104(0x3ef)][_0x46c104(0x32a)];}}},ColorManager[_0x2459ae(0x417)]=function(_0x359758){const _0x24b6d8=_0x2459ae;if(!_0x359758)return this[_0x24b6d8(0x4ba)]();else{if(_0x359758[_0x24b6d8(0x321)]['match'](/<COLOR:[ ](\d+)>/i))return this['textColor'](Number(RegExp['$1'])[_0x24b6d8(0x282)](0x0,0x1f));else return _0x359758[_0x24b6d8(0x321)][_0x24b6d8(0x455)](/<COLOR:[ ]#(.*)>/i)?'#'+String(RegExp['$1']):this['normalColor']();}},ColorManager[_0x2459ae(0x431)]=function(_0x2d7cff){const _0xf97e95=_0x2459ae;return _0x2d7cff=String(_0x2d7cff),_0x2d7cff[_0xf97e95(0x455)](/#(.*)/i)?_0xf97e95(0x3b4)[_0xf97e95(0x342)](String(RegExp['$1'])):this[_0xf97e95(0x1fb)](Number(_0x2d7cff));},Game_Temp[_0x2459ae(0x316)][_0x2459ae(0x43d)]=function(){const _0x3cc625=_0x2459ae;if(this[_0x3cc625(0x33b)])return![];return VisuMZ[_0x3cc625(0x368)][_0x3cc625(0x27d)][_0x3cc625(0x444)]['Enable'];},VisuMZ['ShopMenuStatusStandard']=VisuMZ[_0x2459ae(0x368)]['Settings'][_0x2459ae(0x3e8)][_0x2459ae(0x238)],VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x425)]=Game_BattlerBase[_0x2459ae(0x316)][_0x2459ae(0x33d)],Game_BattlerBase[_0x2459ae(0x316)][_0x2459ae(0x33d)]=function(_0x3eba34){const _0xd6ca37=_0x2459ae;return this['_shopStatusMenuMode']?this[_0xd6ca37(0x45d)]?VisuMZ[_0xd6ca37(0x1ed)]:0x1:VisuMZ[_0xd6ca37(0x368)][_0xd6ca37(0x425)][_0xd6ca37(0x2ff)](this,_0x3eba34);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x21e)]=Game_BattlerBase[_0x2459ae(0x316)][_0x2459ae(0x361)],Game_BattlerBase[_0x2459ae(0x316)][_0x2459ae(0x361)]=function(_0x4fe952){const _0x3ef28b=_0x2459ae;if(!_0x4fe952)return![];if(!VisuMZ[_0x3ef28b(0x368)][_0x3ef28b(0x21e)][_0x3ef28b(0x2ff)](this,_0x4fe952))return![];if(!this[_0x3ef28b(0x4e2)](_0x4fe952))return![];if(!this[_0x3ef28b(0x1f8)](_0x4fe952))return![];return!![];},Game_BattlerBase[_0x2459ae(0x316)][_0x2459ae(0x4e2)]=function(_0x42cb3b){const _0x42e5de=_0x2459ae;if(!this[_0x42e5de(0x1f3)](_0x42cb3b))return![];return!![];},Game_BattlerBase[_0x2459ae(0x316)][_0x2459ae(0x1f3)]=function(_0x50a15c){const _0x322eb5=_0x2459ae,_0x34a028=_0x50a15c[_0x322eb5(0x321)];if(_0x34a028[_0x322eb5(0x455)](/<ENABLE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x2073da=JSON[_0x322eb5(0x4c0)]('['+RegExp['$1'][_0x322eb5(0x455)](/\d+/g)+']');for(const _0x5b9ab6 of _0x2073da){if(!$gameSwitches['value'](_0x5b9ab6))return![];}return!![];}if(_0x34a028[_0x322eb5(0x455)](/<ENABLE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x588d61=JSON[_0x322eb5(0x4c0)]('['+RegExp['$1'][_0x322eb5(0x455)](/\d+/g)+']');for(const _0x4c2775 of _0x588d61){if(!$gameSwitches[_0x322eb5(0x441)](_0x4c2775))return![];}return!![];}if(_0x34a028[_0x322eb5(0x455)](/<ENABLE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0xb339f7=JSON['parse']('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0xac832f of _0xb339f7){if($gameSwitches[_0x322eb5(0x441)](_0xac832f))return!![];}return![];}if(_0x34a028[_0x322eb5(0x455)](/<DISABLE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x17cee6=JSON[_0x322eb5(0x4c0)]('['+RegExp['$1'][_0x322eb5(0x455)](/\d+/g)+']');for(const _0x505cf4 of _0x17cee6){if(!$gameSwitches['value'](_0x505cf4))return!![];}return![];}if(_0x34a028[_0x322eb5(0x455)](/<DISABLE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x36ede9=JSON[_0x322eb5(0x4c0)]('['+RegExp['$1'][_0x322eb5(0x455)](/\d+/g)+']');for(const _0x201749 of _0x36ede9){if(!$gameSwitches['value'](_0x201749))return!![];}return![];}if(_0x34a028[_0x322eb5(0x455)](/<DISABLE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x37c859=JSON[_0x322eb5(0x4c0)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x1b099a of _0x37c859){if($gameSwitches[_0x322eb5(0x441)](_0x1b099a))return![];}return!![];}return!![];},Game_BattlerBase[_0x2459ae(0x316)]['meetsItemConditionsJS']=function(_0xa3d457){const _0x37112a=_0x2459ae,_0xfd60bc=_0xa3d457[_0x37112a(0x321)],_0x53a97e=VisuMZ[_0x37112a(0x368)][_0x37112a(0x517)];return _0x53a97e[_0xa3d457['id']]?_0x53a97e[_0xa3d457['id']][_0x37112a(0x2ff)](this,_0xa3d457):!![];},Game_Actor['prototype'][_0x2459ae(0x47b)]=function(_0x5e8251){const _0x56c9a5=_0x2459ae;_0x5e8251=this['convertInitEquipsToItems'](_0x5e8251);const _0x3a0c11=this[_0x56c9a5(0x440)]();this['_equips']=[];for(let _0x5780eb=0x0;_0x5780eb<_0x3a0c11['length'];_0x5780eb++){this[_0x56c9a5(0x453)][_0x5780eb]=new Game_Item();}for(let _0x182631=0x0;_0x182631<_0x3a0c11[_0x56c9a5(0x335)];_0x182631++){const _0x470b60=_0x3a0c11[_0x182631],_0x19f164=this[_0x56c9a5(0x50b)](_0x5e8251,_0x470b60);if(this['canEquip'](_0x19f164))this[_0x56c9a5(0x453)][_0x182631][_0x56c9a5(0x26e)](_0x19f164);}this[_0x56c9a5(0x2bd)](!![]),this[_0x56c9a5(0x4a4)]();},Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x22c)]=function(_0x2a325a){const _0x1a316d=_0x2459ae,_0x46fbb5=[];for(let _0x988655=0x0;_0x988655<_0x2a325a['length'];_0x988655++){const _0x311414=_0x2a325a[_0x988655];if(_0x311414<=0x0)continue;const _0x597eec=$dataSystem['equipTypes'][_0x988655+0x1];_0x597eec===$dataSystem[_0x1a316d(0x375)][0x1]||_0x988655===0x1&&this[_0x1a316d(0x339)]()?_0x46fbb5['push']($dataWeapons[_0x311414]):_0x46fbb5[_0x1a316d(0x42c)]($dataArmors[_0x311414]);}return _0x46fbb5;},Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x50b)]=function(_0x4199d6,_0x10b806){const _0x226a36=_0x2459ae;for(const _0x363444 of _0x4199d6){if(!_0x363444)continue;if(_0x363444[_0x226a36(0x41b)]===_0x10b806)return _0x4199d6[_0x226a36(0x4de)](_0x4199d6[_0x226a36(0x33a)](_0x363444),0x1),_0x363444;}return null;},Game_Actor['prototype'][_0x2459ae(0x440)]=function(){const _0x367d65=_0x2459ae,_0x1551e8=JsonEx[_0x367d65(0x332)](this[_0x367d65(0x411)]||this[_0x367d65(0x203)]()[_0x367d65(0x440)]);if(_0x1551e8[_0x367d65(0x335)]>=0x2&&this[_0x367d65(0x339)]())_0x1551e8[0x1]=0x1;return _0x1551e8;},Game_Actor['prototype'][_0x2459ae(0x2ed)]=function(_0x5cfc4d){const _0xb59cb4=_0x2459ae;_0x5cfc4d[_0xb59cb4(0x287)](0x0),_0x5cfc4d[_0xb59cb4(0x287)](-0x1),this[_0xb59cb4(0x411)]=_0x5cfc4d,this[_0xb59cb4(0x4a4)]();},Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x349)]=function(){const _0x11e59a=_0x2459ae;this['_forcedSlots']=undefined,this[_0x11e59a(0x4a4)]();},Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x253)]=function(){const _0x5858a1=_0x2459ae,_0x1e47a7=this[_0x5858a1(0x440)]();for(let _0x16985e=0x0;_0x16985e<_0x1e47a7[_0x5858a1(0x335)];_0x16985e++){if(!this['_equips'][_0x16985e])this[_0x5858a1(0x453)][_0x16985e]=new Game_Item();}this['releaseUnequippableItems'](![]),this[_0x5858a1(0x4a4)]();},VisuMZ[_0x2459ae(0x368)]['Game_Actor_changeEquip']=Game_Actor['prototype'][_0x2459ae(0x497)],Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x497)]=function(_0x2823b1,_0x3a6f79){const _0x4dffd5=_0x2459ae;if(!this[_0x4dffd5(0x29d)]){const _0xc11c0b=JsonEx[_0x4dffd5(0x332)](this);_0xc11c0b[_0x4dffd5(0x29d)]=!![],VisuMZ[_0x4dffd5(0x368)][_0x4dffd5(0x4f3)][_0x4dffd5(0x2ff)](this,_0x2823b1,_0x3a6f79),this[_0x4dffd5(0x1d2)](_0xc11c0b);}else VisuMZ['ItemsEquipsCore'][_0x4dffd5(0x4f3)][_0x4dffd5(0x2ff)](this,_0x2823b1,_0x3a6f79);},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x32b)]=Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x475)],Game_Actor[_0x2459ae(0x316)]['forceChangeEquip']=function(_0x2a9827,_0x464f3c){const _0x3470fc=_0x2459ae;if(!this[_0x3470fc(0x29d)]){const _0x3b9871=JsonEx['makeDeepCopy'](this);_0x3b9871[_0x3470fc(0x29d)]=!![],VisuMZ[_0x3470fc(0x368)][_0x3470fc(0x32b)][_0x3470fc(0x2ff)](this,_0x2a9827,_0x464f3c),this['equipAdjustHpMp'](_0x3b9871);}else VisuMZ['ItemsEquipsCore'][_0x3470fc(0x32b)]['call'](this,_0x2a9827,_0x464f3c);},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x32c)]=Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x46b)],Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x46b)]=function(_0x5c1cd1){const _0x5296e4=_0x2459ae;if(!this[_0x5296e4(0x29d)]){const _0x1f247b=JsonEx['makeDeepCopy'](this);_0x1f247b[_0x5296e4(0x29d)]=!![],VisuMZ[_0x5296e4(0x368)]['Game_Actor_discardEquip'][_0x5296e4(0x2ff)](this,_0x5c1cd1),this[_0x5296e4(0x1d2)](_0x1f247b);}else VisuMZ[_0x5296e4(0x368)]['Game_Actor_discardEquip'][_0x5296e4(0x2ff)](this,_0x5c1cd1);},Game_Actor['prototype'][_0x2459ae(0x2bd)]=function(_0x8a4e38){const _0x26582a=_0x2459ae;for(;;){const _0x365d65=this[_0x26582a(0x440)](),_0x5c78b7=this[_0x26582a(0x276)]();let _0x187dc5=![];for(let _0xdcc231=0x0;_0xdcc231<_0x5c78b7[_0x26582a(0x335)];_0xdcc231++){const _0x34cdcd=_0x5c78b7[_0xdcc231];if(_0x34cdcd&&(!this[_0x26582a(0x3aa)](_0x34cdcd)||_0x34cdcd[_0x26582a(0x41b)]!==_0x365d65[_0xdcc231])){!_0x8a4e38&&this[_0x26582a(0x260)](null,_0x34cdcd);if(!this['_tempActor']){const _0x3dd0ed=JsonEx[_0x26582a(0x332)](this);_0x3dd0ed[_0x26582a(0x29d)]=!![],this[_0x26582a(0x453)][_0xdcc231][_0x26582a(0x26e)](null),this['equipAdjustHpMp'](_0x3dd0ed);}else this[_0x26582a(0x453)][_0xdcc231]['setObject'](null);_0x187dc5=!![];}}if(!_0x187dc5)break;}},Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x1d2)]=function(_0x2c5dcf){const _0x461837=_0x2459ae;if(this[_0x461837(0x29d)])return;if(!VisuMZ[_0x461837(0x368)]['Settings'][_0x461837(0x4e3)][_0x461837(0x303)])return;const _0x7f2a21=Math[_0x461837(0x343)](_0x2c5dcf[_0x461837(0x3c7)]()*this[_0x461837(0x28c)]),_0x5657c9=Math['round'](_0x2c5dcf[_0x461837(0x1f0)]()*this[_0x461837(0x4d1)]);if(this['hp']>0x0)this[_0x461837(0x22d)](_0x7f2a21);if(this['mp']>0x0)this[_0x461837(0x493)](_0x5657c9);},Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x224)]=function(){const _0x37ab19=_0x2459ae,_0x1df83a=this[_0x37ab19(0x440)]()[_0x37ab19(0x335)];for(let _0x3f29d1=0x0;_0x3f29d1<_0x1df83a;_0x3f29d1++){if(this[_0x37ab19(0x45e)](_0x3f29d1))this[_0x37ab19(0x497)](_0x3f29d1,null);}},Game_Actor['prototype'][_0x2459ae(0x45e)]=function(_0x2f7cd8){const _0x112569=_0x2459ae;return this[_0x112569(0x297)]()[_0x112569(0x308)](this['equipSlots']()[_0x2f7cd8])?![]:this[_0x112569(0x289)](_0x2f7cd8);},Game_Actor[_0x2459ae(0x316)]['nonRemovableEtypes']=function(){const _0x13bbbc=_0x2459ae;return VisuMZ[_0x13bbbc(0x368)][_0x13bbbc(0x27d)][_0x13bbbc(0x4e3)][_0x13bbbc(0x419)];},Game_Actor['prototype'][_0x2459ae(0x3c1)]=function(){const _0x72d3e8=_0x2459ae,_0x4f408d=this[_0x72d3e8(0x440)]()[_0x72d3e8(0x335)];for(let _0x195436=0x0;_0x195436<_0x4f408d;_0x195436++){if(this[_0x72d3e8(0x413)](_0x195436))this['changeEquip'](_0x195436,null);}for(let _0x22c034=0x0;_0x22c034<_0x4f408d;_0x22c034++){if(this['isOptimizeEquipOk'](_0x22c034))this[_0x72d3e8(0x497)](_0x22c034,this[_0x72d3e8(0x358)](_0x22c034));}},Game_Actor['prototype'][_0x2459ae(0x413)]=function(_0x1c3877){const _0x20d5e0=_0x2459ae;return this[_0x20d5e0(0x2bb)]()[_0x20d5e0(0x308)](this[_0x20d5e0(0x440)]()[_0x1c3877])?![]:this[_0x20d5e0(0x289)](_0x1c3877);},Game_Actor[_0x2459ae(0x316)]['nonOptimizeEtypes']=function(){const _0xfa7da9=_0x2459ae;return VisuMZ[_0xfa7da9(0x368)][_0xfa7da9(0x27d)][_0xfa7da9(0x4e3)][_0xfa7da9(0x488)];},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x2be)]=Game_Actor['prototype']['tradeItemWithParty'],Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x260)]=function(_0xfb9845,_0xabb9ac){const _0x512eac=_0x2459ae;if(this[_0x512eac(0x29d)])return![];$gameTemp[_0x512eac(0x33b)]=!![];const _0x36ebca=VisuMZ['ItemsEquipsCore'][_0x512eac(0x2be)][_0x512eac(0x2ff)](this,_0xfb9845,_0xabb9ac);return $gameTemp[_0x512eac(0x33b)]=![],_0x36ebca;},Game_Actor['prototype'][_0x2459ae(0x1fc)]=function(_0x278f44,_0x4261a8){const _0x4e8d5c=_0x2459ae,_0xc8454d=this[_0x4e8d5c(0x3ce)](_0x278f44);if(_0xc8454d<0x0)return;const _0x3fd713=_0x278f44===0x1?$dataWeapons[_0x4261a8]:$dataArmors[_0x4261a8];this[_0x4e8d5c(0x497)](_0xc8454d,_0x3fd713);},Game_Actor[_0x2459ae(0x316)]['getNextAvailableEtypeId']=function(_0x3b58a8){const _0x282e43=_0x2459ae;let _0x340ad4=0x0;const _0x1fdc6e=this[_0x282e43(0x440)](),_0x527bfc=this[_0x282e43(0x276)]();for(let _0x40778a=0x0;_0x40778a<_0x1fdc6e[_0x282e43(0x335)];_0x40778a++){if(_0x1fdc6e[_0x40778a]===_0x3b58a8){_0x340ad4=_0x40778a;if(!_0x527bfc[_0x40778a])return _0x340ad4;}}return _0x340ad4;},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x3e4)]=Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x22b)],Game_Actor['prototype'][_0x2459ae(0x22b)]=function(_0x590e6a){const _0x5f572b=_0x2459ae;let _0x59ad1b=VisuMZ[_0x5f572b(0x368)][_0x5f572b(0x3e4)][_0x5f572b(0x2ff)](this,_0x590e6a);for(const _0x23c6d2 of this[_0x5f572b(0x276)]()){if(_0x23c6d2)_0x59ad1b+=this[_0x5f572b(0x3d5)](_0x23c6d2,_0x590e6a);}return _0x59ad1b;},Game_Actor[_0x2459ae(0x316)][_0x2459ae(0x3d5)]=function(_0x1f6df9,_0x5d399a){const _0x97bccd=_0x2459ae;if(this[_0x97bccd(0x367)])return 0x0;const _0xee65aa=(DataManager['isWeapon'](_0x1f6df9)?_0x97bccd(0x430):_0x97bccd(0x4dc))['format'](_0x1f6df9['id']),_0x116eec='%1-%2'[_0x97bccd(0x342)](_0xee65aa,_0x5d399a);if(VisuMZ[_0x97bccd(0x368)]['paramJS'][_0x116eec]){this['_calculatingJSParameters']=!![];const _0x436666=VisuMZ[_0x97bccd(0x368)]['paramJS'][_0x116eec]['call'](this,_0x1f6df9,_0x5d399a);return this[_0x97bccd(0x367)]=![],_0x436666;}else return 0x0;},Game_Actor[_0x2459ae(0x316)]['setShopStatusWindowMode']=function(_0x3d1deb){const _0x38754b=_0x2459ae;this[_0x38754b(0x3ae)]=!![],this[_0x38754b(0x45d)]=_0x3d1deb;},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x3da)]=Game_Party['prototype'][_0x2459ae(0x3d6)],Game_Party[_0x2459ae(0x316)][_0x2459ae(0x3d6)]=function(){const _0x446f47=_0x2459ae;VisuMZ['ItemsEquipsCore'][_0x446f47(0x3da)][_0x446f47(0x2ff)](this),this[_0x446f47(0x427)]();},Game_Party[_0x2459ae(0x316)]['initNewItemsList']=function(){const _0x25f0e5=_0x2459ae;this[_0x25f0e5(0x1e4)]=[];},Game_Party[_0x2459ae(0x316)]['isNewItem']=function(_0xa3d6f9){const _0x4b62e5=_0x2459ae;if(!$gameTemp[_0x4b62e5(0x43d)]())return![];if(this[_0x4b62e5(0x1e4)]===undefined)this['initNewItemsList']();let _0x2d3447='';if(DataManager[_0x4b62e5(0x3c0)](_0xa3d6f9))_0x2d3447=_0x4b62e5(0x4cd)[_0x4b62e5(0x342)](_0xa3d6f9['id']);else{if(DataManager[_0x4b62e5(0x1e8)](_0xa3d6f9))_0x2d3447=_0x4b62e5(0x4e1)[_0x4b62e5(0x342)](_0xa3d6f9['id']);else{if(DataManager['isArmor'](_0xa3d6f9))_0x2d3447=_0x4b62e5(0x2a6)['format'](_0xa3d6f9['id']);else return;}}return this[_0x4b62e5(0x1e4)][_0x4b62e5(0x308)](_0x2d3447);},Game_Party['prototype'][_0x2459ae(0x23f)]=function(_0x550764){const _0x16a3a5=_0x2459ae;if(!$gameTemp[_0x16a3a5(0x43d)]())return;if(this['_newItemsList']===undefined)this['initNewItemsList']();let _0xf433d8='';if(DataManager[_0x16a3a5(0x3c0)](_0x550764))_0xf433d8='item-%1'['format'](_0x550764['id']);else{if(DataManager['isWeapon'](_0x550764))_0xf433d8=_0x16a3a5(0x4e1)[_0x16a3a5(0x342)](_0x550764['id']);else{if(DataManager[_0x16a3a5(0x379)](_0x550764))_0xf433d8='armor-%1'[_0x16a3a5(0x342)](_0x550764['id']);else return;}}if(!this[_0x16a3a5(0x1e4)][_0x16a3a5(0x308)](_0xf433d8))this[_0x16a3a5(0x1e4)]['push'](_0xf433d8);},Game_Party[_0x2459ae(0x316)]['clearNewItem']=function(_0x188d41){const _0x5aed7d=_0x2459ae;if(!$gameTemp[_0x5aed7d(0x43d)]())return;if(this[_0x5aed7d(0x1e4)]===undefined)this[_0x5aed7d(0x427)]();let _0x12c804='';if(DataManager[_0x5aed7d(0x3c0)](_0x188d41))_0x12c804='item-%1'['format'](_0x188d41['id']);else{if(DataManager['isWeapon'](_0x188d41))_0x12c804=_0x5aed7d(0x4e1)[_0x5aed7d(0x342)](_0x188d41['id']);else{if(DataManager['isArmor'](_0x188d41))_0x12c804=_0x5aed7d(0x2a6)['format'](_0x188d41['id']);else return;}}this[_0x5aed7d(0x1e4)][_0x5aed7d(0x308)](_0x12c804)&&this[_0x5aed7d(0x1e4)]['splice'](this[_0x5aed7d(0x1e4)][_0x5aed7d(0x33a)](_0x12c804),0x1);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x511)]=Game_Party[_0x2459ae(0x316)][_0x2459ae(0x39c)],Game_Party[_0x2459ae(0x316)][_0x2459ae(0x39c)]=function(_0x2a2c2b,_0x444d73,_0x5f5c98){const _0x3c4488=_0x2459ae,_0x3885ad=this[_0x3c4488(0x30a)](_0x2a2c2b);VisuMZ[_0x3c4488(0x368)][_0x3c4488(0x511)]['call'](this,_0x2a2c2b,_0x444d73,_0x5f5c98);if(this['numItems'](_0x2a2c2b)>_0x3885ad)this[_0x3c4488(0x23f)](_0x2a2c2b);},Game_Party[_0x2459ae(0x316)]['maxItems']=function(_0x465624){const _0x111e17=_0x2459ae;return DataManager[_0x111e17(0x4d5)](_0x465624);},VisuMZ[_0x2459ae(0x368)]['Scene_ItemBase_activateItemWindow']=Scene_ItemBase[_0x2459ae(0x316)][_0x2459ae(0x2e3)],Scene_ItemBase[_0x2459ae(0x316)][_0x2459ae(0x2e3)]=function(){const _0x285122=_0x2459ae;VisuMZ[_0x285122(0x368)]['Scene_ItemBase_activateItemWindow'][_0x285122(0x2ff)](this),this[_0x285122(0x24c)]['callUpdateHelp']();},Scene_Item['prototype']['isBottomHelpMode']=function(){const _0x546589=_0x2459ae;if(ConfigManager[_0x546589(0x3f9)]&&ConfigManager[_0x546589(0x45f)]!==undefined)return ConfigManager[_0x546589(0x45f)];else{if(this[_0x546589(0x1dc)]())return this[_0x546589(0x3d7)]()[_0x546589(0x455)](/LOWER/i);else Scene_ItemBase['prototype'][_0x546589(0x21b)]['call'](this);}},Scene_Item[_0x2459ae(0x316)][_0x2459ae(0x21b)]=function(){const _0x2a1675=_0x2459ae;if(ConfigManager[_0x2a1675(0x3f9)]&&ConfigManager[_0x2a1675(0x465)]!==undefined)return ConfigManager['uiInputPosition'];else{if(this['isUseItemsEquipsCoreUpdatedLayout']())return this[_0x2a1675(0x3d7)]()[_0x2a1675(0x455)](/RIGHT/i);else Scene_ItemBase[_0x2a1675(0x316)][_0x2a1675(0x21b)]['call'](this);}},Scene_Item['prototype'][_0x2459ae(0x3d7)]=function(){const _0x51c915=_0x2459ae;return VisuMZ['ItemsEquipsCore']['Settings']['ItemScene'][_0x51c915(0x3c2)];},Scene_Item[_0x2459ae(0x316)][_0x2459ae(0x2f4)]=function(){const _0x36a65b=_0x2459ae;return this[_0x36a65b(0x49d)]&&this['_categoryWindow'][_0x36a65b(0x2f4)]();},Scene_Item[_0x2459ae(0x316)][_0x2459ae(0x1dc)]=function(){const _0x19bffa=_0x2459ae;return VisuMZ[_0x19bffa(0x368)][_0x19bffa(0x27d)]['ItemScene'][_0x19bffa(0x4bf)];},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x37f)]=Scene_Item[_0x2459ae(0x316)][_0x2459ae(0x2f2)],Scene_Item['prototype'][_0x2459ae(0x2f2)]=function(){const _0x203478=_0x2459ae;VisuMZ[_0x203478(0x368)]['Scene_Item_create'][_0x203478(0x2ff)](this),this[_0x203478(0x2f4)]()&&this[_0x203478(0x4f7)]();},Scene_Item[_0x2459ae(0x316)]['helpWindowRect']=function(){const _0x2f67e=_0x2459ae;return this[_0x2f67e(0x1dc)]()?this[_0x2f67e(0x42d)]():Scene_ItemBase['prototype'][_0x2f67e(0x23e)]['call'](this);},Scene_Item[_0x2459ae(0x316)]['helpWindowRectItemsEquipsCore']=function(){const _0x21e834=_0x2459ae,_0xdfaad4=0x0,_0x507520=this[_0x21e834(0x27f)](),_0x19bb54=Graphics[_0x21e834(0x4b4)],_0x48f269=this[_0x21e834(0x4cb)]();return new Rectangle(_0xdfaad4,_0x507520,_0x19bb54,_0x48f269);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x1f2)]=Scene_Item['prototype'][_0x2459ae(0x272)],Scene_Item['prototype'][_0x2459ae(0x272)]=function(){const _0x135907=_0x2459ae;VisuMZ['ItemsEquipsCore'][_0x135907(0x1f2)]['call'](this),this[_0x135907(0x2f4)]()&&this[_0x135907(0x270)]();},Scene_Item['prototype']['postCreateCategoryWindowItemsEquipsCore']=function(){const _0x508687=_0x2459ae;delete this[_0x508687(0x49d)][_0x508687(0x3d8)]['ok'],delete this['_categoryWindow'][_0x508687(0x3d8)][_0x508687(0x3db)];},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x398)]=Scene_Item[_0x2459ae(0x316)]['categoryWindowRect'],Scene_Item['prototype'][_0x2459ae(0x381)]=function(){const _0x2b28f3=_0x2459ae;return this[_0x2b28f3(0x1dc)]()?this[_0x2b28f3(0x268)]():VisuMZ[_0x2b28f3(0x368)][_0x2b28f3(0x398)]['call'](this);},Scene_Item[_0x2459ae(0x316)][_0x2459ae(0x268)]=function(){const _0xf51a2c=0x0,_0x175cb3=this['mainAreaTop'](),_0x4da2f7=Graphics['boxWidth'],_0x3cb724=this['calcWindowHeight'](0x1,!![]);return new Rectangle(_0xf51a2c,_0x175cb3,_0x4da2f7,_0x3cb724);},VisuMZ[_0x2459ae(0x368)]['Scene_Item_createItemWindow']=Scene_Item[_0x2459ae(0x316)]['createItemWindow'],Scene_Item[_0x2459ae(0x316)][_0x2459ae(0x4c4)]=function(){const _0x1bafa7=_0x2459ae;VisuMZ[_0x1bafa7(0x368)][_0x1bafa7(0x3bc)][_0x1bafa7(0x2ff)](this),this['isUseModernControls']()&&this[_0x1bafa7(0x491)](),this[_0x1bafa7(0x330)]()&&this['createStatusWindow']();},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x4e6)]=Scene_Item[_0x2459ae(0x316)]['itemWindowRect'],Scene_Item[_0x2459ae(0x316)]['itemWindowRect']=function(){const _0x3af558=_0x2459ae;if(this[_0x3af558(0x1dc)]())return this[_0x3af558(0x239)]();else{const _0x611493=VisuMZ[_0x3af558(0x368)]['Scene_Item_itemWindowRect'][_0x3af558(0x2ff)](this);return this[_0x3af558(0x330)]()&&this[_0x3af558(0x49c)]()&&(_0x611493['width']-=this[_0x3af558(0x443)]()),_0x611493;}},Scene_Item[_0x2459ae(0x316)][_0x2459ae(0x239)]=function(){const _0x1d9562=_0x2459ae,_0x4699ab=this[_0x1d9562(0x21b)]()?this['statusWidth']():0x0,_0x30224b=this['_categoryWindow']['y']+this[_0x1d9562(0x49d)]['height'],_0x1c9605=Graphics[_0x1d9562(0x4b4)]-this[_0x1d9562(0x443)](),_0x4b89b5=this['mainAreaBottom']()-_0x30224b;return new Rectangle(_0x4699ab,_0x30224b,_0x1c9605,_0x4b89b5);},Scene_Item['prototype']['postCreateItemWindowModernControls']=function(){const _0x22f866=_0x2459ae;this[_0x22f866(0x24c)][_0x22f866(0x216)](_0x22f866(0x3db),this['popScene'][_0x22f866(0x4b1)](this));},Scene_Item['prototype'][_0x2459ae(0x330)]=function(){const _0x3820b9=_0x2459ae;return this[_0x3820b9(0x1dc)]()?!![]:VisuMZ['ItemsEquipsCore'][_0x3820b9(0x27d)][_0x3820b9(0x3ef)]['ShowShopStatus'];},Scene_Item[_0x2459ae(0x316)]['adjustItemWidthByStatus']=function(){const _0x4b4dc5=_0x2459ae;return VisuMZ[_0x4b4dc5(0x368)][_0x4b4dc5(0x27d)]['ItemScene'][_0x4b4dc5(0x4d8)];},Scene_Item[_0x2459ae(0x316)][_0x2459ae(0x254)]=function(){const _0x42a1af=_0x2459ae,_0x3c9dc2=this[_0x42a1af(0x4e8)]();this[_0x42a1af(0x2cc)]=new Window_ShopStatus(_0x3c9dc2),this[_0x42a1af(0x3d2)](this[_0x42a1af(0x2cc)]),this[_0x42a1af(0x24c)][_0x42a1af(0x3a1)](this[_0x42a1af(0x2cc)]);const _0x599b52=VisuMZ[_0x42a1af(0x368)][_0x42a1af(0x27d)][_0x42a1af(0x3ef)][_0x42a1af(0x323)];this[_0x42a1af(0x2cc)][_0x42a1af(0x2b1)](_0x599b52||0x0);},Scene_Item[_0x2459ae(0x316)]['statusWindowRect']=function(){const _0x447fbe=_0x2459ae;return this['isUseItemsEquipsCoreUpdatedLayout']()?this[_0x447fbe(0x3a8)]():VisuMZ[_0x447fbe(0x368)][_0x447fbe(0x27d)][_0x447fbe(0x3ef)][_0x447fbe(0x4df)][_0x447fbe(0x2ff)](this);},Scene_Item[_0x2459ae(0x316)][_0x2459ae(0x3a8)]=function(){const _0x18f87f=_0x2459ae,_0x1a4205=this[_0x18f87f(0x443)](),_0xd77d20=this[_0x18f87f(0x24c)][_0x18f87f(0x496)],_0x31d155=this[_0x18f87f(0x21b)]()?0x0:Graphics['boxWidth']-this['statusWidth'](),_0x1f5aa8=this[_0x18f87f(0x24c)]['y'];return new Rectangle(_0x31d155,_0x1f5aa8,_0x1a4205,_0xd77d20);},Scene_Item[_0x2459ae(0x316)][_0x2459ae(0x443)]=function(){const _0x170667=_0x2459ae;return Scene_Shop['prototype'][_0x170667(0x443)]();},Scene_Item[_0x2459ae(0x316)][_0x2459ae(0x234)]=function(){const _0x220c17=_0x2459ae;if(!this[_0x220c17(0x3d7)]())return![];if(!this[_0x220c17(0x2f4)]())return![];if(!this[_0x220c17(0x24c)])return![];if(!this[_0x220c17(0x24c)][_0x220c17(0x498)])return![];return this[_0x220c17(0x3d7)]()&&this['isUseModernControls']();},Scene_Item[_0x2459ae(0x316)][_0x2459ae(0x3b9)]=function(){const _0x209017=_0x2459ae;if(this['buttonAssistItemListRequirement']())return this[_0x209017(0x24c)]['maxCols']()===0x1?TextManager[_0x209017(0x2c2)]('left',_0x209017(0x309)):TextManager[_0x209017(0x2c2)](_0x209017(0x3ed),'pagedown');return Scene_ItemBase[_0x209017(0x316)][_0x209017(0x3b9)]['call'](this);},Scene_Item[_0x2459ae(0x316)]['buttonAssistText1']=function(){const _0x581c63=_0x2459ae;if(this['buttonAssistItemListRequirement']())return VisuMZ[_0x581c63(0x368)][_0x581c63(0x27d)][_0x581c63(0x3ef)][_0x581c63(0x1e1)];return Scene_ItemBase[_0x581c63(0x316)][_0x581c63(0x1fa)]['call'](this);},Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x27c)]=function(){const _0x24d945=_0x2459ae;if(ConfigManager[_0x24d945(0x3f9)]&&ConfigManager[_0x24d945(0x45f)]!==undefined)return ConfigManager[_0x24d945(0x45f)];else{if(this[_0x24d945(0x1dc)]())return this[_0x24d945(0x3d7)]()[_0x24d945(0x455)](/LOWER/i);else Scene_MenuBase[_0x24d945(0x316)][_0x24d945(0x21b)][_0x24d945(0x2ff)](this);}},Scene_Equip[_0x2459ae(0x316)]['isRightInputMode']=function(){const _0x43e470=_0x2459ae;if(ConfigManager[_0x43e470(0x3f9)]&&ConfigManager[_0x43e470(0x465)]!==undefined)return ConfigManager[_0x43e470(0x465)];else{if(this['isUseItemsEquipsCoreUpdatedLayout']())return this[_0x43e470(0x3d7)]()[_0x43e470(0x455)](/RIGHT/i);else Scene_MenuBase[_0x43e470(0x316)][_0x43e470(0x21b)][_0x43e470(0x2ff)](this);}},Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x3d7)]=function(){const _0x126483=_0x2459ae;return VisuMZ[_0x126483(0x368)][_0x126483(0x27d)][_0x126483(0x4e3)][_0x126483(0x3c2)];},Scene_Equip['prototype'][_0x2459ae(0x2f4)]=function(){const _0x2812df=_0x2459ae;return this[_0x2812df(0x3bf)]&&this['_commandWindow']['isUseModernControls']();},Scene_Equip['prototype'][_0x2459ae(0x1dc)]=function(){const _0x538347=_0x2459ae;return VisuMZ['ItemsEquipsCore'][_0x538347(0x27d)][_0x538347(0x4e3)][_0x538347(0x4bf)];},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x405)]=Scene_Equip[_0x2459ae(0x316)]['create'],Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x2f2)]=function(){const _0x357fd3=_0x2459ae;VisuMZ[_0x357fd3(0x368)]['Scene_Equip_create'][_0x357fd3(0x2ff)](this),this[_0x357fd3(0x2f4)]()&&this['commandEquip']();},Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x23e)]=function(){const _0x3b6f8e=_0x2459ae;return this[_0x3b6f8e(0x1dc)]()?this[_0x3b6f8e(0x42d)]():Scene_MenuBase[_0x3b6f8e(0x316)][_0x3b6f8e(0x23e)][_0x3b6f8e(0x2ff)](this);},Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x42d)]=function(){const _0x28d9f8=_0x2459ae,_0x115cc6=0x0,_0x177586=this[_0x28d9f8(0x27f)](),_0x12d791=Graphics[_0x28d9f8(0x4b4)],_0x19ebec=this[_0x28d9f8(0x4cb)]();return new Rectangle(_0x115cc6,_0x177586,_0x12d791,_0x19ebec);},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x3b5)]=Scene_Equip['prototype'][_0x2459ae(0x4e8)],Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x4e8)]=function(){const _0x4a4093=_0x2459ae;return this['isUseItemsEquipsCoreUpdatedLayout']()?this[_0x4a4093(0x3a8)]():VisuMZ[_0x4a4093(0x368)][_0x4a4093(0x3b5)][_0x4a4093(0x2ff)](this);},Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x3a8)]=function(){const _0x3badf3=_0x2459ae,_0x12fe10=this[_0x3badf3(0x21b)]()?0x0:Graphics[_0x3badf3(0x4b4)]-this['statusWidth'](),_0x4439db=this[_0x3badf3(0x412)](),_0x55a585=this[_0x3badf3(0x443)](),_0x2970e5=this['mainAreaHeight']();return new Rectangle(_0x12fe10,_0x4439db,_0x55a585,_0x2970e5);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x31b)]=Scene_Equip['prototype'][_0x2459ae(0x41e)],Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x41e)]=function(){const _0x9c7baa=_0x2459ae;return this[_0x9c7baa(0x1dc)]()?this['commandWindowRectItemsEquipsCore']():VisuMZ[_0x9c7baa(0x368)][_0x9c7baa(0x31b)][_0x9c7baa(0x2ff)](this);},Scene_Equip['prototype'][_0x2459ae(0x3a0)]=function(){const _0x15af32=_0x2459ae,_0x12e929=VisuMZ[_0x15af32(0x368)]['Settings'][_0x15af32(0x4e3)];return _0x12e929[_0x15af32(0x210)]||_0x12e929[_0x15af32(0x228)];},Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x2c7)]=function(){const _0x1e50b0=_0x2459ae,_0x1c89f3=this[_0x1e50b0(0x3a0)](),_0x587e5a=this['isRightInputMode']()?this[_0x1e50b0(0x443)]():0x0,_0x1a98b5=this[_0x1e50b0(0x412)](),_0x4f1322=Graphics[_0x1e50b0(0x4b4)]-this['statusWidth'](),_0xf5c6b6=_0x1c89f3?this[_0x1e50b0(0x3d4)](0x1,!![]):0x0;return new Rectangle(_0x587e5a,_0x1a98b5,_0x4f1322,_0xf5c6b6);},VisuMZ[_0x2459ae(0x368)]['Scene_Equip_createSlotWindow']=Scene_Equip[_0x2459ae(0x316)]['createSlotWindow'],Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x39a)]=function(){const _0x1109e7=_0x2459ae;VisuMZ[_0x1109e7(0x368)][_0x1109e7(0x362)]['call'](this),this[_0x1109e7(0x2f4)]()&&this[_0x1109e7(0x1d8)]();},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x1f7)]=Scene_Equip['prototype'][_0x2459ae(0x2ba)],Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x2ba)]=function(){const _0x4ff90e=_0x2459ae;return this[_0x4ff90e(0x1dc)]()?this[_0x4ff90e(0x3a3)]():VisuMZ[_0x4ff90e(0x368)][_0x4ff90e(0x1f7)]['call'](this);},Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x3a3)]=function(){const _0x345e92=_0x2459ae,_0x51d121=this[_0x345e92(0x41e)](),_0x254aab=this[_0x345e92(0x21b)]()?this[_0x345e92(0x443)]():0x0,_0x2446df=_0x51d121['y']+_0x51d121[_0x345e92(0x496)],_0x5e9b33=Graphics[_0x345e92(0x4b4)]-this[_0x345e92(0x443)](),_0x2975c6=this['mainAreaHeight']()-_0x51d121['height'];return new Rectangle(_0x254aab,_0x2446df,_0x5e9b33,_0x2975c6);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x400)]=Scene_Equip['prototype'][_0x2459ae(0x437)],Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x437)]=function(){const _0x366fcd=_0x2459ae;return this['isUseItemsEquipsCoreUpdatedLayout']()?this[_0x366fcd(0x2ba)]():VisuMZ[_0x366fcd(0x368)][_0x366fcd(0x400)]['call'](this);},Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x443)]=function(){const _0x59ca1a=_0x2459ae;return this[_0x59ca1a(0x1dc)]()?this[_0x59ca1a(0x4af)]():VisuMZ[_0x59ca1a(0x368)][_0x59ca1a(0x27d)][_0x59ca1a(0x4e3)]['StatusWindowWidth'];},Scene_Equip[_0x2459ae(0x316)]['geUpdatedLayoutStatusWidth']=function(){const _0x5c229a=_0x2459ae;return Math[_0x5c229a(0x2d2)](Graphics[_0x5c229a(0x4b4)]/0x2);},Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x1d8)]=function(){const _0x1da5d8=_0x2459ae;this[_0x1da5d8(0x1f6)][_0x1da5d8(0x216)](_0x1da5d8(0x3db),this[_0x1da5d8(0x1ef)][_0x1da5d8(0x4b1)](this)),this['_slotWindow']['setHandler']('pagedown',this[_0x1da5d8(0x40d)]['bind'](this)),this['_slotWindow'][_0x1da5d8(0x216)](_0x1da5d8(0x3ed),this[_0x1da5d8(0x3a9)][_0x1da5d8(0x4b1)](this));},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x380)]=Scene_Equip[_0x2459ae(0x316)]['commandEquip'],Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x2d0)]=function(){const _0x271368=_0x2459ae;this[_0x271368(0x2f4)]()&&(this[_0x271368(0x3bf)][_0x271368(0x32e)](),this[_0x271368(0x3bf)]['deactivate']()),VisuMZ[_0x271368(0x368)][_0x271368(0x380)]['call'](this);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x2e1)]=Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x4c1)],Scene_Equip[_0x2459ae(0x316)]['onSlotOk']=function(){const _0x407f11=_0x2459ae;this[_0x407f11(0x1f6)]['index']()>=0x0?(VisuMZ[_0x407f11(0x368)]['Scene_Equip_onSlotOk'][_0x407f11(0x2ff)](this),this[_0x407f11(0x3de)]()):(this[_0x407f11(0x1f6)][_0x407f11(0x43e)](0x0),this[_0x407f11(0x1f6)][_0x407f11(0x252)]());},Scene_Equip['prototype'][_0x2459ae(0x3de)]=function(){const _0x112c02=_0x2459ae,_0x5a7d8f=this[_0x112c02(0x1f6)][_0x112c02(0x298)](),_0x50768d=this['_itemWindow']['_data'][_0x112c02(0x33a)](_0x5a7d8f),_0x22ae74=Math[_0x112c02(0x2d2)](this[_0x112c02(0x24c)]['maxVisibleItems']()/0x2)-0x1;this[_0x112c02(0x24c)][_0x112c02(0x4a4)](),this['_itemWindow'][_0x112c02(0x43e)](_0x50768d>=0x0?_0x50768d:0x0),this[_0x112c02(0x24c)]['setTopRow'](this[_0x112c02(0x24c)]['index']()-_0x22ae74);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x246)]=Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x2d9)],Scene_Equip[_0x2459ae(0x316)]['onSlotCancel']=function(){const _0x202dc9=_0x2459ae;VisuMZ[_0x202dc9(0x368)][_0x202dc9(0x246)][_0x202dc9(0x2ff)](this),this[_0x202dc9(0x2f4)]()&&(this[_0x202dc9(0x3bf)][_0x202dc9(0x43e)](0x0),this[_0x202dc9(0x1f6)]['deactivate']());},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x38b)]=Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x438)],Scene_Equip[_0x2459ae(0x316)]['onActorChange']=function(){const _0x79e548=_0x2459ae;VisuMZ[_0x79e548(0x368)]['Scene_Equip_onActorChange'][_0x79e548(0x2ff)](this),this[_0x79e548(0x2f4)]()&&(this[_0x79e548(0x3bf)][_0x79e548(0x4fb)](),this[_0x79e548(0x3bf)][_0x79e548(0x32e)](),this[_0x79e548(0x1f6)][_0x79e548(0x43e)](0x0),this[_0x79e548(0x1f6)][_0x79e548(0x252)]());},Scene_Equip['prototype']['buttonAssistSlotWindowShift']=function(){const _0x5cf365=_0x2459ae;if(!this[_0x5cf365(0x1f6)])return![];if(!this[_0x5cf365(0x1f6)][_0x5cf365(0x498)])return![];return this[_0x5cf365(0x1f6)][_0x5cf365(0x445)]();},Scene_Equip[_0x2459ae(0x316)][_0x2459ae(0x4a9)]=function(){const _0x3b5cfb=_0x2459ae;if(this[_0x3b5cfb(0x21a)]())return TextManager['getInputButtonString'](_0x3b5cfb(0x487));return Scene_MenuBase[_0x3b5cfb(0x316)][_0x3b5cfb(0x4a9)][_0x3b5cfb(0x2ff)](this);},Scene_Equip['prototype'][_0x2459ae(0x214)]=function(){const _0x487886=_0x2459ae;if(this['buttonAssistSlotWindowShift']())return VisuMZ[_0x487886(0x368)]['Settings'][_0x487886(0x4e3)][_0x487886(0x502)];return Scene_MenuBase[_0x487886(0x316)][_0x487886(0x214)][_0x487886(0x2ff)](this);},Scene_Equip[_0x2459ae(0x316)]['buttonAssistOffset3']=function(){const _0x1586b0=_0x2459ae;if(this['buttonAssistSlotWindowShift']())return this[_0x1586b0(0x4a8)][_0x1586b0(0x2bf)]/0x5/-0x3;return Scene_MenuBase['prototype'][_0x1586b0(0x463)][_0x1586b0(0x2ff)](this);},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x428)]=Scene_Load[_0x2459ae(0x316)][_0x2459ae(0x23c)],Scene_Load[_0x2459ae(0x316)][_0x2459ae(0x23c)]=function(){const _0x325a12=_0x2459ae;VisuMZ['ItemsEquipsCore']['Scene_Load_reloadMapIfUpdated']['call'](this),this[_0x325a12(0x4be)]();},Scene_Load[_0x2459ae(0x316)][_0x2459ae(0x4be)]=function(){const _0x500b2a=_0x2459ae;if($gameSystem['versionId']()!==$dataSystem[_0x500b2a(0x230)])for(const _0x517661 of $gameActors[_0x500b2a(0x1f4)]){if(_0x517661)_0x517661[_0x500b2a(0x253)]();}},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x27c)]=function(){const _0x5b16d2=_0x2459ae;if(ConfigManager[_0x5b16d2(0x3f9)]&&ConfigManager[_0x5b16d2(0x45f)]!==undefined)return ConfigManager['uiHelpPosition'];else{if(this[_0x5b16d2(0x1dc)]())return this[_0x5b16d2(0x3d7)]()['match'](/LOWER/i);else Scene_MenuBase[_0x5b16d2(0x316)]['isRightInputMode'][_0x5b16d2(0x2ff)](this);}},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x21b)]=function(){const _0xd7baea=_0x2459ae;if(ConfigManager['uiMenuStyle']&&ConfigManager[_0xd7baea(0x465)]!==undefined)return ConfigManager['uiInputPosition'];else{if(this[_0xd7baea(0x1dc)]())return this[_0xd7baea(0x3d7)]()[_0xd7baea(0x455)](/RIGHT/i);else Scene_MenuBase[_0xd7baea(0x316)]['isRightInputMode']['call'](this);}},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x3d7)]=function(){const _0x402dac=_0x2459ae;return VisuMZ[_0x402dac(0x368)]['Settings'][_0x402dac(0x37c)][_0x402dac(0x3c2)];},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x2f4)]=function(){const _0x2e6ae1=_0x2459ae;return this[_0x2e6ae1(0x49d)]&&this[_0x2e6ae1(0x49d)]['isUseModernControls']();},Scene_Shop['prototype']['isUseItemsEquipsCoreUpdatedLayout']=function(){const _0xf40ef3=_0x2459ae;return VisuMZ[_0xf40ef3(0x368)][_0xf40ef3(0x27d)][_0xf40ef3(0x37c)][_0xf40ef3(0x4bf)];},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x399)]=Scene_Shop[_0x2459ae(0x316)]['prepare'],Scene_Shop['prototype'][_0x2459ae(0x273)]=function(_0x98c572,_0x4d3470){const _0x286cac=_0x2459ae;_0x98c572=JsonEx['makeDeepCopy'](_0x98c572),VisuMZ[_0x286cac(0x368)][_0x286cac(0x399)][_0x286cac(0x2ff)](this,_0x98c572,_0x4d3470),this[_0x286cac(0x2fe)]();},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x2fe)]=function(){const _0x101253=_0x2459ae;this[_0x101253(0x2ee)]=0x0;for(const _0x344dde of this['_goods']){this[_0x101253(0x45b)](_0x344dde)?this['_goodsCount']++:_0x344dde[0x0]=-0x1;}},Scene_Shop['prototype']['isGoodShown']=function(_0x2d8079){const _0x2e6333=_0x2459ae;if(_0x2d8079[0x0]>0x2||_0x2d8079[0x0]<0x0)return![];const _0x265f19=[$dataItems,$dataWeapons,$dataArmors][_0x2d8079[0x0]][_0x2d8079[0x1]];if(!_0x265f19)return![];const _0x4ca27a=_0x265f19[_0x2e6333(0x321)]||'';if(_0x4ca27a['match'](/<SHOW SHOP[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x4c6369=JSON[_0x2e6333(0x4c0)]('['+RegExp['$1'][_0x2e6333(0x455)](/\d+/g)+']');for(const _0xd9b68c of _0x4c6369){if(!$gameSwitches[_0x2e6333(0x441)](_0xd9b68c))return![];}return!![];}if(_0x4ca27a[_0x2e6333(0x455)](/<SHOW SHOP ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x2dd679=JSON[_0x2e6333(0x4c0)]('['+RegExp['$1'][_0x2e6333(0x455)](/\d+/g)+']');for(const _0x5bb968 of _0x2dd679){if(!$gameSwitches['value'](_0x5bb968))return![];}return!![];}if(_0x4ca27a[_0x2e6333(0x455)](/<SHOW SHOP ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x10ed33=JSON['parse']('['+RegExp['$1'][_0x2e6333(0x455)](/\d+/g)+']');for(const _0x399d07 of _0x10ed33){if($gameSwitches[_0x2e6333(0x441)](_0x399d07))return!![];}return![];}if(_0x4ca27a['match'](/<HIDE SHOP[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x5bfda1=JSON['parse']('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x24e9eb of _0x5bfda1){if(!$gameSwitches[_0x2e6333(0x441)](_0x24e9eb))return!![];}return![];}if(_0x4ca27a[_0x2e6333(0x455)](/<HIDE SHOP ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x33c3c4=JSON['parse']('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x5940e3 of _0x33c3c4){if(!$gameSwitches[_0x2e6333(0x441)](_0x5940e3))return!![];}return![];}if(_0x4ca27a[_0x2e6333(0x455)](/<HIDE SHOP ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x12deda=JSON[_0x2e6333(0x4c0)]('['+RegExp['$1'][_0x2e6333(0x455)](/\d+/g)+']');for(const _0x18aaad of _0x12deda){if($gameSwitches[_0x2e6333(0x441)](_0x18aaad))return![];}return!![];}return!![];},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x3fa)]=Scene_Shop['prototype'][_0x2459ae(0x2f2)],Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x2f2)]=function(){const _0x1f9f06=_0x2459ae;VisuMZ[_0x1f9f06(0x368)][_0x1f9f06(0x3fa)][_0x1f9f06(0x2ff)](this),this[_0x1f9f06(0x1dc)]()&&this[_0x1f9f06(0x38f)]();},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x38f)]=function(){const _0x4bcaa8=_0x2459ae;this[_0x4bcaa8(0x325)][_0x4bcaa8(0x279)](),this['_buyWindow'][_0x4bcaa8(0x39f)](),this['_buyWindow'][_0x4bcaa8(0x32e)](),this[_0x4bcaa8(0x2cc)][_0x4bcaa8(0x39f)]();},Scene_Shop[_0x2459ae(0x316)]['helpWindowRect']=function(){const _0x59387b=_0x2459ae;return this['isUseItemsEquipsCoreUpdatedLayout']()?this[_0x59387b(0x42d)]():Scene_MenuBase[_0x59387b(0x316)][_0x59387b(0x23e)]['call'](this);},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x42d)]=function(){const _0x21ac74=_0x2459ae,_0x10019c=0x0,_0x2951a3=this[_0x21ac74(0x27f)](),_0x426a2e=Graphics[_0x21ac74(0x4b4)],_0x4e5803=this['helpAreaHeight']();return new Rectangle(_0x10019c,_0x2951a3,_0x426a2e,_0x4e5803);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x3f3)]=Scene_Shop['prototype'][_0x2459ae(0x31f)],Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x31f)]=function(){const _0x5736ba=_0x2459ae;return this['isUseItemsEquipsCoreUpdatedLayout']()?this[_0x5736ba(0x2a0)]():VisuMZ[_0x5736ba(0x368)]['Scene_Shop_goldWindowRect'][_0x5736ba(0x2ff)](this);},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x2a0)]=function(){const _0x37b675=_0x2459ae,_0x4a5260=this[_0x37b675(0x360)](),_0x4fb750=this[_0x37b675(0x3d4)](0x1,!![]),_0x50ace7=this['isRightInputMode']()?0x0:Graphics[_0x37b675(0x4b4)]-_0x4a5260,_0x13ead7=this[_0x37b675(0x412)]();return new Rectangle(_0x50ace7,_0x13ead7,_0x4a5260,_0x4fb750);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x4a3)]=Scene_Shop['prototype'][_0x2459ae(0x41e)],Scene_Shop[_0x2459ae(0x316)]['commandWindowRect']=function(){const _0x20d67e=_0x2459ae;return this['isUseItemsEquipsCoreUpdatedLayout']()?this['commandWindowRectItemsEquipsCore']():VisuMZ['ItemsEquipsCore']['Scene_Shop_commandWindowRect'][_0x20d67e(0x2ff)](this);},Scene_Shop['prototype'][_0x2459ae(0x2c7)]=function(){const _0x2f97a8=_0x2459ae,_0x138ba1=this['isRightInputMode']()?this[_0x2f97a8(0x360)]():0x0,_0x8969f9=this[_0x2f97a8(0x412)](),_0x4e31eb=Graphics[_0x2f97a8(0x4b4)]-this[_0x2f97a8(0x360)](),_0x42e8ef=this['calcWindowHeight'](0x1,!![]);return new Rectangle(_0x138ba1,_0x8969f9,_0x4e31eb,_0x42e8ef);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x359)]=Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x47e)],Scene_Shop[_0x2459ae(0x316)]['numberWindowRect']=function(){const _0x4c4b19=_0x2459ae;return this[_0x4c4b19(0x1dc)]()?this['numberWindowRectItemsEquipsCore']():VisuMZ[_0x4c4b19(0x368)][_0x4c4b19(0x359)][_0x4c4b19(0x2ff)](this);},Scene_Shop['prototype'][_0x2459ae(0x4e5)]=function(){const _0x423c78=_0x2459ae,_0x47542e=this[_0x423c78(0x3bf)]['y']+this[_0x423c78(0x3bf)][_0x423c78(0x496)],_0x15eb65=Graphics[_0x423c78(0x4b4)]-this[_0x423c78(0x443)](),_0xec15ee=this[_0x423c78(0x21b)]()?Graphics[_0x423c78(0x4b4)]-_0x15eb65:0x0,_0x53f79f=this[_0x423c78(0x345)]()-this[_0x423c78(0x3bf)][_0x423c78(0x496)];return new Rectangle(_0xec15ee,_0x47542e,_0x15eb65,_0x53f79f);},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x34a)]=Scene_Shop[_0x2459ae(0x316)]['statusWindowRect'],Scene_Shop['prototype'][_0x2459ae(0x4e8)]=function(){const _0x10c6ab=_0x2459ae;return this['isUseItemsEquipsCoreUpdatedLayout']()?this[_0x10c6ab(0x3a8)]():VisuMZ[_0x10c6ab(0x368)]['Scene_Shop_statusWindowRect']['call'](this);},Scene_Shop['prototype']['statusWindowRectItemsEquipsCore']=function(){const _0x4034f9=_0x2459ae,_0x2da7de=this['statusWidth'](),_0x44661b=this[_0x4034f9(0x345)]()-this[_0x4034f9(0x3bf)]['height'],_0x210184=this[_0x4034f9(0x21b)]()?0x0:Graphics[_0x4034f9(0x4b4)]-_0x2da7de,_0x2ba550=this[_0x4034f9(0x3bf)]['y']+this['_commandWindow'][_0x4034f9(0x496)];return new Rectangle(_0x210184,_0x2ba550,_0x2da7de,_0x44661b);},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x236)]=Scene_Shop['prototype'][_0x2459ae(0x2d3)],Scene_Shop['prototype'][_0x2459ae(0x2d3)]=function(){const _0x2a6d87=_0x2459ae;return this[_0x2a6d87(0x1dc)]()?this[_0x2a6d87(0x4b9)]():VisuMZ[_0x2a6d87(0x368)][_0x2a6d87(0x236)][_0x2a6d87(0x2ff)](this);},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x4b9)]=function(){const _0x2b3456=_0x2459ae,_0x10145e=this[_0x2b3456(0x3bf)]['y']+this[_0x2b3456(0x3bf)][_0x2b3456(0x496)],_0xb17fc5=Graphics['boxWidth']-this[_0x2b3456(0x443)](),_0x2ced2e=this[_0x2b3456(0x345)]()-this[_0x2b3456(0x3bf)][_0x2b3456(0x496)],_0x2a6f4a=this[_0x2b3456(0x21b)]()?Graphics[_0x2b3456(0x4b4)]-_0xb17fc5:0x0;return new Rectangle(_0x2a6f4a,_0x10145e,_0xb17fc5,_0x2ced2e);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x294)]=Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x272)],Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x272)]=function(){const _0x47142b=_0x2459ae;VisuMZ['ItemsEquipsCore'][_0x47142b(0x294)]['call'](this),this['isUseModernControls']()&&this[_0x47142b(0x270)]();},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x466)]=Scene_Shop['prototype'][_0x2459ae(0x381)],Scene_Shop['prototype'][_0x2459ae(0x381)]=function(){const _0x2785bd=_0x2459ae;return this['isUseItemsEquipsCoreUpdatedLayout']()?this[_0x2785bd(0x268)]():VisuMZ['ItemsEquipsCore']['Scene_Shop_categoryWindowRect'][_0x2785bd(0x2ff)](this);},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x268)]=function(){const _0x4dced5=_0x2459ae,_0x402964=this[_0x4dced5(0x3bf)]['y'],_0xd2edfb=this['_commandWindow'][_0x4dced5(0x2bf)],_0x574c0b=this[_0x4dced5(0x3d4)](0x1,!![]),_0x15ea79=this[_0x4dced5(0x21b)]()?Graphics['boxWidth']-_0xd2edfb:0x0;return new Rectangle(_0x15ea79,_0x402964,_0xd2edfb,_0x574c0b);},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x270)]=function(){const _0x194fdd=_0x2459ae;delete this[_0x194fdd(0x49d)][_0x194fdd(0x3d8)]['ok'],delete this[_0x194fdd(0x49d)]['_handlers'][_0x194fdd(0x3db)];},VisuMZ['ItemsEquipsCore']['Scene_Shop_createSellWindow']=Scene_Shop[_0x2459ae(0x316)]['createSellWindow'],Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x2f8)]=function(){const _0x165882=_0x2459ae;VisuMZ[_0x165882(0x368)][_0x165882(0x485)][_0x165882(0x2ff)](this),this[_0x165882(0x1dc)]()&&this[_0x165882(0x43a)]();},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x2b6)]=Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x285)],Scene_Shop['prototype'][_0x2459ae(0x285)]=function(){const _0x37bf42=_0x2459ae;return this[_0x37bf42(0x1dc)]()?this[_0x37bf42(0x426)]():VisuMZ[_0x37bf42(0x368)]['Scene_Shop_sellWindowRect'][_0x37bf42(0x2ff)](this);},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x426)]=function(){const _0x1b5359=_0x2459ae,_0x3cf16d=this[_0x1b5359(0x49d)]['y']+this[_0x1b5359(0x49d)][_0x1b5359(0x496)],_0x553971=Graphics[_0x1b5359(0x4b4)]-this[_0x1b5359(0x443)](),_0x3849d3=this['mainAreaHeight']()-this[_0x1b5359(0x49d)][_0x1b5359(0x496)],_0xd71562=this[_0x1b5359(0x21b)]()?Graphics[_0x1b5359(0x4b4)]-_0x553971:0x0;return new Rectangle(_0xd71562,_0x3cf16d,_0x553971,_0x3849d3);},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x43a)]=function(){const _0x4f01fc=_0x2459ae;this[_0x4f01fc(0x315)][_0x4f01fc(0x3a1)](this[_0x4f01fc(0x2cc)]);},Scene_Shop[_0x2459ae(0x316)]['statusWidth']=function(){const _0x379d87=_0x2459ae;return VisuMZ['ItemsEquipsCore'][_0x379d87(0x27d)][_0x379d87(0x3e8)][_0x379d87(0x472)];},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x2f1)]=Scene_Shop['prototype'][_0x2459ae(0x21d)],Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x21d)]=function(){const _0x2cf0b7=_0x2459ae;VisuMZ[_0x2cf0b7(0x368)][_0x2cf0b7(0x2f1)][_0x2cf0b7(0x2ff)](this),this[_0x2cf0b7(0x1dc)]()&&this[_0x2cf0b7(0x2cc)][_0x2cf0b7(0x39f)]();},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x38d)]=Scene_Shop['prototype']['commandBuy'],Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x394)]=function(){const _0x16e76d=_0x2459ae;VisuMZ[_0x16e76d(0x368)][_0x16e76d(0x38d)][_0x16e76d(0x2ff)](this),this[_0x16e76d(0x1dc)]()&&this[_0x16e76d(0x393)]();},Scene_Shop['prototype']['commandBuyItemsEquipsCore']=function(){const _0x2f982a=_0x2459ae;this[_0x2f982a(0x2ae)]=this[_0x2f982a(0x2ae)]||0x0,this['_buyWindow'][_0x2f982a(0x43e)](this[_0x2f982a(0x2ae)]);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x333)]=Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x217)],Scene_Shop['prototype'][_0x2459ae(0x217)]=function(){const _0x5f5c1d=_0x2459ae;VisuMZ[_0x5f5c1d(0x368)]['Scene_Shop_commandSell'][_0x5f5c1d(0x2ff)](this),this[_0x5f5c1d(0x1dc)]()&&this[_0x5f5c1d(0x2e2)](),this[_0x5f5c1d(0x2f4)]()&&(this['_categoryWindow']['smoothSelect'](0x0),this['onCategoryOk']());},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x2e2)]=function(){const _0x142c57=_0x2459ae;this['_buyWindow']['hide'](),this[_0x142c57(0x3bf)][_0x142c57(0x279)]();},VisuMZ[_0x2459ae(0x368)]['Scene_Shop_onBuyCancel']=Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x46f)],Scene_Shop[_0x2459ae(0x316)]['onBuyCancel']=function(){const _0x6f291b=_0x2459ae;VisuMZ[_0x6f291b(0x368)]['Scene_Shop_onBuyCancel'][_0x6f291b(0x2ff)](this),this['isUseItemsEquipsCoreUpdatedLayout']()&&this[_0x6f291b(0x1fd)]();},Scene_Shop['prototype'][_0x2459ae(0x1fd)]=function(){const _0x261d7e=_0x2459ae;this[_0x261d7e(0x2ae)]=this['_buyWindow'][_0x261d7e(0x373)](),this[_0x261d7e(0x37a)][_0x261d7e(0x39f)](),this[_0x261d7e(0x37a)][_0x261d7e(0x32e)](),this[_0x261d7e(0x37a)][_0x261d7e(0x209)](0x0,0x0),this['_statusWindow'][_0x261d7e(0x39f)](),this[_0x261d7e(0x325)][_0x261d7e(0x279)]();},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x32d)]=Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x3f1)],Scene_Shop[_0x2459ae(0x316)]['onCategoryCancel']=function(){const _0x27ce7f=_0x2459ae;VisuMZ[_0x27ce7f(0x368)][_0x27ce7f(0x32d)][_0x27ce7f(0x2ff)](this),this[_0x27ce7f(0x1dc)]()&&this[_0x27ce7f(0x4f1)]();},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x4f1)]=function(){this['_buyWindow']['show'](),this['_commandWindow']['show']();},VisuMZ[_0x2459ae(0x368)]['Scene_Shop_onSellOk']=Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x3f6)],Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x3f6)]=function(){const _0x73f660=_0x2459ae;VisuMZ['ItemsEquipsCore'][_0x73f660(0x1d7)][_0x73f660(0x2ff)](this),this[_0x73f660(0x1dc)]()&&this['onSellOkItemsEquipsCore']();},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x2fb)]=function(){const _0x18bd0a=_0x2459ae;this['_categoryWindow'][_0x18bd0a(0x39f)]();},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x481)]=Scene_Shop['prototype']['onSellCancel'],Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x2f3)]=function(){const _0x430883=_0x2459ae;VisuMZ[_0x430883(0x368)][_0x430883(0x481)]['call'](this),this[_0x430883(0x2f4)]()&&this[_0x430883(0x3f1)](),this[_0x430883(0x1dc)]()&&this[_0x430883(0x325)][_0x430883(0x279)]();},VisuMZ[_0x2459ae(0x368)]['Scene_Shop_sellingPrice']=Scene_Shop[_0x2459ae(0x316)]['sellingPrice'],Scene_Shop['prototype'][_0x2459ae(0x347)]=function(){const _0x4acd44=_0x2459ae;let _0x5349a2=this['determineBaseSellingPrice']();const _0x4339e3=this['_item'];return _0x5349a2=VisuMZ[_0x4acd44(0x368)]['Settings'][_0x4acd44(0x37c)][_0x4acd44(0x226)]['call'](this,_0x4339e3,_0x5349a2),_0x5349a2;},Scene_Shop[_0x2459ae(0x316)]['determineBaseSellingPrice']=function(){const _0xa3ebfa=_0x2459ae;if(!this['_item'])return 0x0;else{if(this['_item'][_0xa3ebfa(0x321)][_0xa3ebfa(0x455)](/<JS SELL PRICE>\s*([\s\S]*)\s*<\/JS SELL PRICE>/i)){const _0x1c9d46=String(RegExp['$1']);let _0x89b49e=this['_item'],_0x36e8cc=_0x89b49e['price']*this[_0xa3ebfa(0x352)]();try{eval(_0x1c9d46);}catch(_0xc4b03a){if($gameTemp[_0xa3ebfa(0x4f8)]())console[_0xa3ebfa(0x3df)](_0xc4b03a);}if(isNaN(_0x36e8cc))_0x36e8cc=0x0;return Math[_0xa3ebfa(0x2d2)](_0x36e8cc);}else return this[_0xa3ebfa(0x334)][_0xa3ebfa(0x321)][_0xa3ebfa(0x455)](/<SELL PRICE:[ ](\d+)>/i)?parseInt(RegExp['$1']):Math['floor'](this[_0xa3ebfa(0x334)]['price']*this[_0xa3ebfa(0x352)]());}},Scene_Shop['prototype'][_0x2459ae(0x352)]=function(){const _0x39fedf=_0x2459ae;return VisuMZ['ItemsEquipsCore']['Settings'][_0x39fedf(0x37c)][_0x39fedf(0x43b)];},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x234)]=function(){const _0x4e5300=_0x2459ae;if(!this['updatedLayoutStyle']())return![];if(!this[_0x4e5300(0x2f4)]())return![];if(!this[_0x4e5300(0x315)])return![];if(!this[_0x4e5300(0x315)][_0x4e5300(0x498)])return![];return this['updatedLayoutStyle']()&&this[_0x4e5300(0x2f4)]();},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x3b9)]=function(){const _0x521b73=_0x2459ae;if(this[_0x521b73(0x234)]())return this['_sellWindow']['maxCols']()===0x1?TextManager[_0x521b73(0x2c2)]('left','right'):TextManager[_0x521b73(0x2c2)]('pageup',_0x521b73(0x4d3));else{if(this[_0x521b73(0x223)]&&this[_0x521b73(0x223)][_0x521b73(0x498)])return TextManager[_0x521b73(0x2c2)]('left',_0x521b73(0x309));}return Scene_MenuBase[_0x521b73(0x316)]['buttonAssistKey1'][_0x521b73(0x2ff)](this);},Scene_Shop['prototype'][_0x2459ae(0x490)]=function(){const _0x59722e=_0x2459ae;if(this[_0x59722e(0x223)]&&this[_0x59722e(0x223)][_0x59722e(0x498)])return TextManager[_0x59722e(0x2c2)]('up',_0x59722e(0x3af));return Scene_MenuBase[_0x59722e(0x316)][_0x59722e(0x490)][_0x59722e(0x2ff)](this);},Scene_Shop['prototype'][_0x2459ae(0x1fa)]=function(){const _0x5abf4c=_0x2459ae;if(this[_0x5abf4c(0x234)]())return VisuMZ['ItemsEquipsCore'][_0x5abf4c(0x27d)][_0x5abf4c(0x3ef)]['buttonAssistCategory'];else{if(this[_0x5abf4c(0x223)]&&this[_0x5abf4c(0x223)]['active'])return VisuMZ[_0x5abf4c(0x368)][_0x5abf4c(0x27d)][_0x5abf4c(0x37c)][_0x5abf4c(0x418)];}return Scene_MenuBase[_0x5abf4c(0x316)]['buttonAssistText1'][_0x5abf4c(0x2ff)](this);},Scene_Shop[_0x2459ae(0x316)][_0x2459ae(0x2b4)]=function(){const _0x5b380e=_0x2459ae;if(this[_0x5b380e(0x223)]&&this[_0x5b380e(0x223)][_0x5b380e(0x498)])return VisuMZ[_0x5b380e(0x368)]['Settings'][_0x5b380e(0x37c)]['buttonAssistLargeIncrement'];return Scene_MenuBase[_0x5b380e(0x316)][_0x5b380e(0x2b4)][_0x5b380e(0x2ff)](this);};function Sprite_NewLabel(){const _0x39bf2d=_0x2459ae;this[_0x39bf2d(0x3d6)](...arguments);}Sprite_NewLabel[_0x2459ae(0x316)]=Object['create'](Sprite[_0x2459ae(0x316)]),Sprite_NewLabel[_0x2459ae(0x316)][_0x2459ae(0x48e)]=Sprite_NewLabel,Sprite_NewLabel[_0x2459ae(0x316)][_0x2459ae(0x3d6)]=function(){const _0x5ddc90=_0x2459ae;Sprite['prototype']['initialize'][_0x5ddc90(0x2ff)](this),this['createBitmap']();},Sprite_NewLabel[_0x2459ae(0x316)][_0x2459ae(0x2ab)]=function(){const _0x275f7f=_0x2459ae,_0xbd1cca=ImageManager['iconWidth'],_0x5ca066=ImageManager['iconHeight'];this[_0x275f7f(0x4a2)]=new Bitmap(_0xbd1cca,_0x5ca066),this[_0x275f7f(0x49f)](),this[_0x275f7f(0x23d)]();},Sprite_NewLabel[_0x2459ae(0x316)][_0x2459ae(0x49f)]=function(){const _0x2f3ed9=_0x2459ae,_0x37f12e=VisuMZ[_0x2f3ed9(0x368)][_0x2f3ed9(0x27d)][_0x2f3ed9(0x444)][_0x2f3ed9(0x3a4)];if(_0x37f12e<=0x0)return;const _0x280680=ImageManager[_0x2f3ed9(0x49e)](_0x2f3ed9(0x3cc)),_0x3174ec=ImageManager[_0x2f3ed9(0x33e)],_0x31a9e9=ImageManager['iconHeight'],_0x41bc54=_0x37f12e%0x10*_0x3174ec,_0x399408=Math[_0x2f3ed9(0x2d2)](_0x37f12e/0x10)*_0x31a9e9;this[_0x2f3ed9(0x4a2)]['blt'](_0x280680,_0x41bc54,_0x399408,_0x3174ec,_0x31a9e9,0x0,0x0);},Sprite_NewLabel['prototype'][_0x2459ae(0x23d)]=function(){const _0x175bd2=_0x2459ae,_0x3f3c12=VisuMZ['ItemsEquipsCore'][_0x175bd2(0x27d)][_0x175bd2(0x444)],_0x17fd45=_0x3f3c12[_0x175bd2(0x386)];if(_0x17fd45==='')return;const _0x1342f7=ImageManager[_0x175bd2(0x33e)],_0x1f94b5=ImageManager[_0x175bd2(0x3c4)];this[_0x175bd2(0x4a2)][_0x175bd2(0x3d3)]=_0x3f3c12['FontFace']||$gameSystem[_0x175bd2(0x31c)](),this[_0x175bd2(0x4a2)]['textColor']=this[_0x175bd2(0x4eb)](),this[_0x175bd2(0x4a2)][_0x175bd2(0x500)]=_0x3f3c12[_0x175bd2(0x3ec)],this[_0x175bd2(0x4a2)][_0x175bd2(0x262)](_0x17fd45,0x0,_0x1f94b5/0x2,_0x1342f7,_0x1f94b5/0x2,_0x175bd2(0x245));},Sprite_NewLabel['prototype']['getTextColor']=function(){const _0x2ebfd6=_0x2459ae,_0x29798c=VisuMZ[_0x2ebfd6(0x368)][_0x2ebfd6(0x27d)][_0x2ebfd6(0x444)][_0x2ebfd6(0x211)];return _0x29798c[_0x2ebfd6(0x455)](/#(.*)/i)?'#'+String(RegExp['$1']):ColorManager[_0x2ebfd6(0x1fb)](_0x29798c);},Window_Base[_0x2459ae(0x316)]['drawItemName']=function(_0x579660,_0x3e972d,_0x557fc3,_0x29c7e2){const _0x566768=_0x2459ae;if(_0x579660){const _0x53c93a=_0x557fc3+(this[_0x566768(0x1f1)]()-ImageManager[_0x566768(0x3c4)])/0x2,_0x5172bb=ImageManager[_0x566768(0x33e)]+0x4,_0x4dfe18=Math[_0x566768(0x2c4)](0x0,_0x29c7e2-_0x5172bb);this[_0x566768(0x37e)](ColorManager[_0x566768(0x417)](_0x579660)),this['drawIcon'](_0x579660[_0x566768(0x26f)],_0x3e972d,_0x53c93a),this[_0x566768(0x262)](_0x579660[_0x566768(0x478)],_0x3e972d+_0x5172bb,_0x557fc3,_0x4dfe18),this[_0x566768(0x366)]();}},Window_Base[_0x2459ae(0x316)][_0x2459ae(0x28f)]=function(_0x8fe6f1,_0x413dab,_0x3d317c,_0x516284){const _0x1d739b=_0x2459ae;if(this[_0x1d739b(0x436)](_0x8fe6f1)){this[_0x1d739b(0x3b8)]();const _0xe60dca=VisuMZ[_0x1d739b(0x368)][_0x1d739b(0x27d)][_0x1d739b(0x3ef)],_0x5be20b=_0xe60dca[_0x1d739b(0x22a)],_0x1013e4=_0x5be20b[_0x1d739b(0x342)]($gameParty[_0x1d739b(0x30a)](_0x8fe6f1));this['contents'][_0x1d739b(0x500)]=_0xe60dca[_0x1d739b(0x4d2)],this['drawText'](_0x1013e4,_0x413dab,_0x3d317c,_0x516284,'right'),this[_0x1d739b(0x3b8)]();}},Window_Base[_0x2459ae(0x316)]['isDrawItemNumber']=function(_0x58f8f5){const _0x41d38c=_0x2459ae;if(DataManager[_0x41d38c(0x340)](_0x58f8f5))return $dataSystem['optKeyItemsNumber'];return!![];},Window_Base[_0x2459ae(0x316)]['drawItemDarkRect']=function(_0x1eb958,_0x315cd7,_0x2f8f4e,_0xbca81f,_0x198ed2){const _0x5ca538=_0x2459ae;_0x198ed2=Math[_0x5ca538(0x2c4)](_0x198ed2||0x1,0x1);while(_0x198ed2--){_0xbca81f=_0xbca81f||this[_0x5ca538(0x1f1)](),this[_0x5ca538(0x28d)][_0x5ca538(0x4ea)]=0xa0;const _0x5bb071=ColorManager[_0x5ca538(0x515)]();this[_0x5ca538(0x28d)][_0x5ca538(0x4ef)](_0x1eb958+0x1,_0x315cd7+0x1,_0x2f8f4e-0x2,_0xbca81f-0x2,_0x5bb071),this[_0x5ca538(0x28d)][_0x5ca538(0x4ea)]=0xff;}},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x395)]=Window_Selectable[_0x2459ae(0x316)][_0x2459ae(0x3d6)],Window_Selectable[_0x2459ae(0x316)]['initialize']=function(_0xb9b3f4){const _0x5de13c=_0x2459ae;this[_0x5de13c(0x519)](),VisuMZ[_0x5de13c(0x368)][_0x5de13c(0x395)]['call'](this,_0xb9b3f4);},Window_Selectable[_0x2459ae(0x316)][_0x2459ae(0x519)]=function(){const _0x40867a=_0x2459ae;this[_0x40867a(0x26b)]={},this[_0x40867a(0x392)]=0xff,this[_0x40867a(0x247)]=VisuMZ['ItemsEquipsCore'][_0x40867a(0x27d)][_0x40867a(0x444)]['FadeSpeed'],this[_0x40867a(0x1eb)]=VisuMZ[_0x40867a(0x368)][_0x40867a(0x27d)][_0x40867a(0x444)]['FadeLimit'];},Window_Selectable[_0x2459ae(0x316)][_0x2459ae(0x1e3)]=function(){return![];},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x42a)]=Window_Selectable['prototype']['setHelpWindowItem'],Window_Selectable['prototype'][_0x2459ae(0x275)]=function(_0x5c511f){const _0xa9ae71=_0x2459ae;VisuMZ[_0xa9ae71(0x368)][_0xa9ae71(0x42a)][_0xa9ae71(0x2ff)](this,_0x5c511f);if(this[_0xa9ae71(0x1e3)]())this[_0xa9ae71(0x423)](_0x5c511f);},Window_Selectable[_0x2459ae(0x316)][_0x2459ae(0x423)]=function(_0x37b4bf){const _0x41a8de=_0x2459ae;if(!_0x37b4bf)return;$gameParty[_0x41a8de(0x4f9)](_0x37b4bf);let _0x230e14='';if(DataManager[_0x41a8de(0x3c0)](_0x37b4bf))_0x230e14=_0x41a8de(0x4cd)['format'](_0x37b4bf['id']);else{if(DataManager[_0x41a8de(0x1e8)](_0x37b4bf))_0x230e14='weapon-%1'[_0x41a8de(0x342)](_0x37b4bf['id']);else{if(DataManager[_0x41a8de(0x379)](_0x37b4bf))_0x230e14=_0x41a8de(0x2a6)[_0x41a8de(0x342)](_0x37b4bf['id']);else return;}}const _0x379deb=this[_0x41a8de(0x26b)][_0x230e14];if(_0x379deb)_0x379deb[_0x41a8de(0x279)]();},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x3e0)]=Window_Selectable[_0x2459ae(0x316)][_0x2459ae(0x4a4)],Window_Selectable[_0x2459ae(0x316)][_0x2459ae(0x4a4)]=function(){const _0x310152=_0x2459ae;this[_0x310152(0x40a)](),VisuMZ['ItemsEquipsCore'][_0x310152(0x3e0)][_0x310152(0x2ff)](this);},Window_Selectable[_0x2459ae(0x316)][_0x2459ae(0x40a)]=function(){const _0x28337a=_0x2459ae;for(const _0x11bfab of Object[_0x28337a(0x429)](this[_0x28337a(0x26b)])){_0x11bfab[_0x28337a(0x279)]();}},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x4c5)]=Window_Selectable[_0x2459ae(0x316)]['update'],Window_Selectable[_0x2459ae(0x316)][_0x2459ae(0x2f7)]=function(){const _0x43469f=_0x2459ae;this['updateNewLabelOpacity'](),VisuMZ[_0x43469f(0x368)][_0x43469f(0x4c5)][_0x43469f(0x2ff)](this);},Window_Selectable[_0x2459ae(0x316)]['updateNewLabelOpacity']=function(){const _0x647157=_0x2459ae;if(!this[_0x647157(0x1e3)]())return;const _0x40da28=this['_newLabelOpacityUpperLimit'];this[_0x647157(0x392)]+=this[_0x647157(0x247)];(this['_newLabelOpacity']>=_0x40da28||this[_0x647157(0x392)]<=0x0)&&(this[_0x647157(0x247)]*=-0x1);this[_0x647157(0x392)]=this[_0x647157(0x392)][_0x647157(0x282)](0x0,_0x40da28);for(const _0x3a4ad3 of Object[_0x647157(0x429)](this[_0x647157(0x26b)])){_0x3a4ad3['opacity']=this['_newLabelOpacity'];}},Window_Selectable['prototype'][_0x2459ae(0x24b)]=function(_0x89f976){const _0x6c513=_0x2459ae,_0x58cfbf=this['_newLabelSprites'];if(_0x58cfbf[_0x89f976])return _0x58cfbf[_0x89f976];else{const _0x15c95f=new Sprite_NewLabel();return _0x58cfbf[_0x89f976]=_0x15c95f,this[_0x6c513(0x44a)](_0x15c95f),_0x15c95f;}},Window_Selectable[_0x2459ae(0x316)]['placeNewLabel']=function(_0x2d9156,_0x5758ef,_0x4ac0ab){const _0x2764fa=_0x2459ae;let _0x5c4ede='';if(DataManager[_0x2764fa(0x3c0)](_0x2d9156))_0x5c4ede='item-%1'[_0x2764fa(0x342)](_0x2d9156['id']);else{if(DataManager['isWeapon'](_0x2d9156))_0x5c4ede=_0x2764fa(0x4e1)['format'](_0x2d9156['id']);else{if(DataManager[_0x2764fa(0x379)](_0x2d9156))_0x5c4ede=_0x2764fa(0x2a6)[_0x2764fa(0x342)](_0x2d9156['id']);else return;}}const _0x46fca9=this[_0x2764fa(0x24b)](_0x5c4ede);_0x46fca9[_0x2764fa(0x2e8)](_0x5758ef,_0x4ac0ab),_0x46fca9[_0x2764fa(0x39f)](),_0x46fca9[_0x2764fa(0x20d)]=this[_0x2764fa(0x392)];},Window_ItemCategory[_0x2459ae(0x3fe)]=VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x27d)]['Categories'][_0x2459ae(0x482)],Window_ItemCategory['categoryItemTypes']=['HiddenItemA',_0x2459ae(0x508),'Nonconsumable','Consumable',_0x2459ae(0x20e),_0x2459ae(0x215),_0x2459ae(0x30b),_0x2459ae(0x3ad)],VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x47d)]=Window_ItemCategory[_0x2459ae(0x316)]['initialize'],Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x3d6)]=function(_0x3194f4){const _0x2d4b91=_0x2459ae;VisuMZ['ItemsEquipsCore'][_0x2d4b91(0x47d)][_0x2d4b91(0x2ff)](this,_0x3194f4),this[_0x2d4b91(0x34b)](_0x3194f4);},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x34b)]=function(_0x57d12f){const _0x33a7f5=_0x2459ae,_0x4239c6=new Rectangle(0x0,0x0,_0x57d12f['width'],_0x57d12f['height']);this[_0x33a7f5(0x49a)]=new Window_Base(_0x4239c6),this[_0x33a7f5(0x49a)][_0x33a7f5(0x20d)]=0x0,this[_0x33a7f5(0x1d9)](this[_0x33a7f5(0x49a)]),this[_0x33a7f5(0x2a1)]();},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x2f4)]=function(){const _0x105a64=_0x2459ae;return Imported['VisuMZ_0_CoreEngine']&&Window_HorzCommand[_0x105a64(0x316)][_0x105a64(0x2f4)]['call'](this);},Window_ItemCategory['prototype'][_0x2459ae(0x266)]=function(){},Window_ItemCategory['prototype']['playOkSound']=function(){const _0x4f59cf=_0x2459ae;if(!this[_0x4f59cf(0x2f4)]())Window_HorzCommand[_0x4f59cf(0x316)][_0x4f59cf(0x371)][_0x4f59cf(0x2ff)](this);},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x26a)]=function(){const _0x51b8f4=_0x2459ae;return this['_list']?this[_0x51b8f4(0x284)]():0x4;},Window_ItemCategory[_0x2459ae(0x316)]['update']=function(){const _0x5eda03=_0x2459ae;Window_HorzCommand[_0x5eda03(0x316)][_0x5eda03(0x2f7)][_0x5eda03(0x2ff)](this),this[_0x5eda03(0x24c)]&&this[_0x5eda03(0x24c)]['setCategory'](this[_0x5eda03(0x434)]());},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x4f4)]=function(){const _0x50e766=_0x2459ae;if(this[_0x50e766(0x306)]()){const _0x2e17d5=this[_0x50e766(0x373)]();if(this[_0x50e766(0x24c)]&&this[_0x50e766(0x24c)]['maxCols']()<=0x1)Input['isRepeated'](_0x50e766(0x309))&&this[_0x50e766(0x40b)](Input[_0x50e766(0x30c)]('right')),Input[_0x50e766(0x504)](_0x50e766(0x29f))&&this['cursorLeft'](Input[_0x50e766(0x30c)](_0x50e766(0x29f)));else this[_0x50e766(0x24c)]&&this['_itemWindow'][_0x50e766(0x26a)]()>0x1&&(Input['isRepeated']('pagedown')&&!Input['isPressed'](_0x50e766(0x487))&&this[_0x50e766(0x40b)](Input[_0x50e766(0x30c)](_0x50e766(0x4d3))),Input[_0x50e766(0x504)]('pageup')&&!Input[_0x50e766(0x314)](_0x50e766(0x487))&&this['cursorLeft'](Input[_0x50e766(0x30c)](_0x50e766(0x3ed))));this['index']()!==_0x2e17d5&&this[_0x50e766(0x232)]();}},Window_ItemCategory[_0x2459ae(0x316)]['processHandling']=function(){const _0x3db8d2=_0x2459ae;if(this[_0x3db8d2(0x2f4)]())return;Window_HorzCommand[_0x3db8d2(0x316)][_0x3db8d2(0x34f)][_0x3db8d2(0x2ff)](this);},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x402)]=function(){const _0x2b2a77=_0x2459ae;return this['isUseModernControls']()?![]:Window_HorzCommand['prototype'][_0x2b2a77(0x402)]['call'](this);},Window_ItemCategory['prototype'][_0x2459ae(0x204)]=function(){const _0x9535c=_0x2459ae;if(this[_0x9535c(0x24a)]()){TouchInput[_0x9535c(0x30c)]()&&this['onTouchSelect'](!![]);if(TouchInput[_0x9535c(0x49b)]())this['onTouchOk']();else TouchInput[_0x9535c(0x4d9)]()&&this[_0x9535c(0x512)]();}},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x50e)]=function(_0x4ff2c1){const _0x366017=_0x2459ae;this[_0x366017(0x2f4)]()?this[_0x366017(0x495)](!![]):Window_HorzCommand['prototype'][_0x366017(0x50e)][_0x366017(0x2ff)](this,_0x4ff2c1);},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x495)]=function(_0x3e0a7b){const _0x52cd80=_0x2459ae;this[_0x52cd80(0x326)]=![];if(this['isCursorMovable']()){const _0x2a4af2=this[_0x52cd80(0x373)](),_0x291bd4=this['hitIndex']();_0x291bd4>=0x0&&_0x291bd4!==this['index']()&&this[_0x52cd80(0x420)](_0x291bd4),_0x3e0a7b&&this[_0x52cd80(0x373)]()!==_0x2a4af2&&this[_0x52cd80(0x232)]();}},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x36e)]=function(){const _0x531948=_0x2459ae;for(const _0x34b71f of Window_ItemCategory[_0x531948(0x3fe)]){this['addItemCategory'](_0x34b71f);}this['select'](this[_0x531948(0x373)]());},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x2cd)]=function(_0x8dcd28){const _0x320787=_0x2459ae,_0x216afb=_0x8dcd28[_0x320787(0x341)],_0x4acc43=_0x8dcd28[_0x320787(0x3a4)],_0x301586=_0x8dcd28['SwitchID']||0x0;if(_0x301586>0x0&&!$gameSwitches[_0x320787(0x441)](_0x301586))return;let _0x13b08e='',_0x2ef07b='category',_0x133d19=_0x216afb;if(_0x216afb[_0x320787(0x455)](/Category:(.*)/i))_0x13b08e=String(RegExp['$1'])[_0x320787(0x264)]();else{if(Window_ItemCategory['categoryItemTypes'][_0x320787(0x308)](_0x216afb))_0x13b08e=VisuMZ[_0x320787(0x368)][_0x320787(0x27d)][_0x320787(0x448)][_0x216afb];else{if([_0x320787(0x305),_0x320787(0x286)][_0x320787(0x308)](_0x216afb))_0x13b08e=TextManager['item'];else{if(_0x216afb===_0x320787(0x505))_0x13b08e=TextManager['keyItem'];else{if(_0x216afb==='AllWeapons')_0x13b08e=TextManager[_0x320787(0x456)];else{if(_0x216afb==='AllArmors')_0x13b08e=TextManager[_0x320787(0x26c)];else{if(_0x216afb[_0x320787(0x455)](/WTYPE:(\d+)/i))_0x13b08e=$dataSystem[_0x320787(0x4bc)][Number(RegExp['$1'])]||'';else{if(_0x216afb[_0x320787(0x455)](/ATYPE:(\d+)/i))_0x13b08e=$dataSystem[_0x320787(0x4a5)][Number(RegExp['$1'])]||'';else _0x216afb['match'](/ETYPE:(\d+)/i)&&(_0x13b08e=$dataSystem[_0x320787(0x375)][Number(RegExp['$1'])]||'');}}}}}}}_0x4acc43>0x0&&this[_0x320787(0x461)]()!==_0x320787(0x50f)&&(_0x13b08e=_0x320787(0x388)[_0x320787(0x342)](_0x4acc43,_0x13b08e)),this[_0x320787(0x256)](_0x13b08e,_0x2ef07b,!![],_0x133d19);},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x3e2)]=function(){const _0x1a2e6f=_0x2459ae;return VisuMZ[_0x1a2e6f(0x368)][_0x1a2e6f(0x27d)][_0x1a2e6f(0x448)][_0x1a2e6f(0x3bd)];},Window_ItemCategory['prototype'][_0x2459ae(0x28b)]=function(_0x3e48cc){const _0x5a996a=_0x2459ae,_0x2c3847=this[_0x5a996a(0x3eb)](_0x3e48cc);if(_0x2c3847===_0x5a996a(0x2ce))this[_0x5a996a(0x2e0)](_0x3e48cc);else _0x2c3847===_0x5a996a(0x30d)?this[_0x5a996a(0x4d4)](_0x3e48cc):Window_HorzCommand[_0x5a996a(0x316)]['drawItem']['call'](this,_0x3e48cc);},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x461)]=function(){const _0x1e168e=_0x2459ae;return VisuMZ[_0x1e168e(0x368)][_0x1e168e(0x27d)]['Categories']['Style'];},Window_ItemCategory['prototype'][_0x2459ae(0x3eb)]=function(_0x1f74ee){const _0x14c6e9=_0x2459ae;if(_0x1f74ee<0x0)return _0x14c6e9(0x50f);const _0x2c0ff2=this[_0x14c6e9(0x461)]();if(_0x2c0ff2!==_0x14c6e9(0x357))return _0x2c0ff2;else{const _0x532f24=this['commandName'](_0x1f74ee);if(_0x532f24[_0x14c6e9(0x455)](/\\I\[(\d+)\]/i)){const _0x2a9e48=this[_0x14c6e9(0x1e7)](_0x1f74ee),_0x15883c=this[_0x14c6e9(0x3dc)](_0x532f24)['width'];return _0x15883c<=_0x2a9e48[_0x14c6e9(0x2bf)]?_0x14c6e9(0x2ce):_0x14c6e9(0x30d);}else return _0x14c6e9(0x50f);}},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x2e0)]=function(_0x41dc9e){const _0x510d1c=_0x2459ae,_0x3a9a45=this[_0x510d1c(0x1e7)](_0x41dc9e),_0x4ad337=this[_0x510d1c(0x300)](_0x41dc9e),_0x426329=this[_0x510d1c(0x3dc)](_0x4ad337)[_0x510d1c(0x2bf)];this[_0x510d1c(0x41f)](this[_0x510d1c(0x50d)](_0x41dc9e));const _0x206308=this[_0x510d1c(0x3e2)]();if(_0x206308===_0x510d1c(0x309))this[_0x510d1c(0x3e7)](_0x4ad337,_0x3a9a45['x']+_0x3a9a45[_0x510d1c(0x2bf)]-_0x426329,_0x3a9a45['y'],_0x426329);else{if(_0x206308==='center'){const _0x8b0a5=_0x3a9a45['x']+Math[_0x510d1c(0x2d2)]((_0x3a9a45[_0x510d1c(0x2bf)]-_0x426329)/0x2);this['drawTextEx'](_0x4ad337,_0x8b0a5,_0x3a9a45['y'],_0x426329);}else this[_0x510d1c(0x3e7)](_0x4ad337,_0x3a9a45['x'],_0x3a9a45['y'],_0x426329);}},Window_ItemCategory[_0x2459ae(0x316)]['drawItemStyleIcon']=function(_0x382fce){const _0x386b10=_0x2459ae,_0x202450=this[_0x386b10(0x300)](_0x382fce);if(_0x202450['match'](/\\I\[(\d+)\]/i)){const _0x23d843=Number(RegExp['$1'])||0x0,_0x553487=this[_0x386b10(0x1e7)](_0x382fce),_0x2bf3af=_0x553487['x']+Math[_0x386b10(0x2d2)]((_0x553487[_0x386b10(0x2bf)]-ImageManager[_0x386b10(0x33e)])/0x2),_0xf24c2=_0x553487['y']+(_0x553487['height']-ImageManager[_0x386b10(0x3c4)])/0x2;this['drawIcon'](_0x23d843,_0x2bf3af,_0xf24c2);}},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x23b)]=Window_ItemCategory[_0x2459ae(0x316)]['setItemWindow'],Window_ItemCategory['prototype'][_0x2459ae(0x48c)]=function(_0x1c3805){const _0x2362bc=_0x2459ae;VisuMZ[_0x2362bc(0x368)][_0x2362bc(0x23b)][_0x2362bc(0x2ff)](this,_0x1c3805),_0x1c3805[_0x2362bc(0x49d)]=this;},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x506)]=function(){const _0x31603f=_0x2459ae;Window_HorzCommand['prototype'][_0x31603f(0x506)][_0x31603f(0x2ff)](this);if(this[_0x31603f(0x49a)])this[_0x31603f(0x2a1)]();},Window_ItemCategory[_0x2459ae(0x316)][_0x2459ae(0x2a1)]=function(){const _0x4337d6=_0x2459ae,_0x3008b9=this[_0x4337d6(0x49a)];_0x3008b9[_0x4337d6(0x4ad)]['clear']();const _0x525c6e=this[_0x4337d6(0x3eb)](this[_0x4337d6(0x373)]());if(_0x525c6e==='icon'){const _0xc2cbf0=this['itemLineRect'](this[_0x4337d6(0x373)]());let _0x47d708=this[_0x4337d6(0x300)](this['index']());_0x47d708=_0x47d708['replace'](/\\I\[(\d+)\]/gi,''),_0x3008b9[_0x4337d6(0x3b8)](),this[_0x4337d6(0x372)](_0x47d708,_0xc2cbf0),this[_0x4337d6(0x503)](_0x47d708,_0xc2cbf0),this['categoryNameWindowCenter'](_0x47d708,_0xc2cbf0);}},Window_ItemCategory[_0x2459ae(0x316)]['categoryNameWindowDrawBackground']=function(_0x33bced,_0x47dfcb){},Window_ItemCategory['prototype'][_0x2459ae(0x503)]=function(_0xc9ac07,_0x2d337d){const _0x28a976=_0x2459ae,_0x346e0b=this['_categoryNameWindow'];_0x346e0b['drawText'](_0xc9ac07,0x0,_0x2d337d['y'],_0x346e0b['innerWidth'],_0x28a976(0x245));},Window_ItemCategory['prototype'][_0x2459ae(0x424)]=function(_0x10039c,_0x27578e){const _0x5a8205=_0x2459ae,_0x630639=this[_0x5a8205(0x49a)],_0x382719=$gameSystem[_0x5a8205(0x44b)](),_0x4ca2e6=_0x27578e['x']+Math['floor'](_0x27578e[_0x5a8205(0x2bf)]/0x2)+_0x382719;_0x630639['x']=_0x630639['width']/-0x2+_0x4ca2e6,_0x630639['y']=Math[_0x5a8205(0x2d2)](_0x27578e[_0x5a8205(0x496)]/0x2);},Window_ItemList['prototype']['processCursorMoveModernControls']=function(){const _0x37e0d1=_0x2459ae;if(this[_0x37e0d1(0x306)]()){const _0x5e7155=this[_0x37e0d1(0x373)]();if(this[_0x37e0d1(0x26a)]()<=0x1)!this[_0x37e0d1(0x46e)](_0x37e0d1(0x4d3))&&Input[_0x37e0d1(0x30c)]('pagedown')&&this['cursorPagedown'](),!this[_0x37e0d1(0x46e)](_0x37e0d1(0x3ed))&&Input[_0x37e0d1(0x30c)]('pageup')&&this['cursorPageup']();else this[_0x37e0d1(0x26a)]()>0x1&&(Input['isRepeated'](_0x37e0d1(0x309))&&this['cursorRight'](Input[_0x37e0d1(0x30c)]('right')),Input[_0x37e0d1(0x504)]('left')&&this[_0x37e0d1(0x255)](Input['isTriggered'](_0x37e0d1(0x29f))),this['limitedPageUpDownSceneCheck']()?(Input['isTriggered'](_0x37e0d1(0x4d3))&&Input[_0x37e0d1(0x314)](_0x37e0d1(0x487))&&this[_0x37e0d1(0x421)](),Input[_0x37e0d1(0x30c)](_0x37e0d1(0x3ed))&&Input['isPressed'](_0x37e0d1(0x487))&&this[_0x37e0d1(0x2a3)]()):(Input[_0x37e0d1(0x30c)](_0x37e0d1(0x4d3))&&this[_0x37e0d1(0x421)](),Input[_0x37e0d1(0x30c)](_0x37e0d1(0x3ed))&&this[_0x37e0d1(0x2a3)]()));Input[_0x37e0d1(0x504)](_0x37e0d1(0x3af))&&(Input[_0x37e0d1(0x314)](_0x37e0d1(0x487))&&this[_0x37e0d1(0x328)]()?this[_0x37e0d1(0x421)]():this[_0x37e0d1(0x2af)](Input[_0x37e0d1(0x30c)](_0x37e0d1(0x3af)))),Input[_0x37e0d1(0x504)]('up')&&(Input['isPressed'](_0x37e0d1(0x487))&&this[_0x37e0d1(0x328)]()?this[_0x37e0d1(0x2a3)]():this[_0x37e0d1(0x36d)](Input[_0x37e0d1(0x30c)]('up'))),Imported['VisuMZ_0_CoreEngine']&&this['processCursorHomeEndTrigger'](),this[_0x37e0d1(0x373)]()!==_0x5e7155&&this[_0x37e0d1(0x232)]();}},Window_ItemList[_0x2459ae(0x316)]['limitedPageUpDownSceneCheck']=function(){const _0x3dcb69=_0x2459ae,_0x335dfd=SceneManager[_0x3dcb69(0x415)],_0x255e2e=[Scene_Item,Scene_Shop];return _0x255e2e['includes'](_0x335dfd[_0x3dcb69(0x48e)]);},Window_ItemList[_0x2459ae(0x316)][_0x2459ae(0x252)]=function(){const _0x23daac=_0x2459ae;Window_Selectable['prototype'][_0x23daac(0x252)][_0x23daac(0x2ff)](this),this[_0x23daac(0x49d)]&&this[_0x23daac(0x49d)][_0x23daac(0x2f4)]()&&this[_0x23daac(0x49d)][_0x23daac(0x252)]();},Window_ItemList[_0x2459ae(0x316)][_0x2459ae(0x4fb)]=function(){const _0x572ec7=_0x2459ae;Window_Selectable[_0x572ec7(0x316)][_0x572ec7(0x4fb)][_0x572ec7(0x2ff)](this),this[_0x572ec7(0x49d)]&&this[_0x572ec7(0x49d)][_0x572ec7(0x2f4)]()&&this[_0x572ec7(0x49d)][_0x572ec7(0x4fb)]();},Window_ItemList['prototype'][_0x2459ae(0x4c9)]=function(_0xdad090){const _0x46d141=_0x2459ae;this[_0x46d141(0x218)]!==_0xdad090&&(this[_0x46d141(0x218)]=_0xdad090,this[_0x46d141(0x4a4)](),this[_0x46d141(0x49d)]&&this[_0x46d141(0x49d)]['isUseModernControls']()?this[_0x46d141(0x43e)](0x0):this[_0x46d141(0x2e4)](0x0,0x0));},VisuMZ[_0x2459ae(0x368)]['Window_ItemList_maxCols']=Window_ItemList[_0x2459ae(0x316)][_0x2459ae(0x26a)],Window_ItemList[_0x2459ae(0x316)]['maxCols']=function(){const _0x3e5631=_0x2459ae;if(SceneManager['_scene'][_0x3e5631(0x48e)]===Scene_Battle)return VisuMZ['ItemsEquipsCore'][_0x3e5631(0x248)][_0x3e5631(0x2ff)](this);else return SceneManager[_0x3e5631(0x415)][_0x3e5631(0x48e)]===Scene_Map?VisuMZ[_0x3e5631(0x368)][_0x3e5631(0x248)]['call'](this):VisuMZ['ItemsEquipsCore'][_0x3e5631(0x27d)]['ItemScene']['ListWindowCols'];},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x473)]=Window_ItemList[_0x2459ae(0x316)][_0x2459ae(0x2c1)],Window_ItemList[_0x2459ae(0x316)]['colSpacing']=function(){const _0x10b315=_0x2459ae;return this[_0x10b315(0x26a)]()<=0x1?Window_Selectable[_0x10b315(0x316)][_0x10b315(0x2c1)]['call'](this):VisuMZ[_0x10b315(0x368)][_0x10b315(0x473)][_0x10b315(0x2ff)](this);},Window_ItemList[_0x2459ae(0x316)]['includes']=function(_0x5a118b){const _0x37e6c9=_0x2459ae;switch(this['_category']){case'AllItems':return DataManager['isItem'](_0x5a118b);case'RegularItems':return DataManager['isItem'](_0x5a118b)&&_0x5a118b['itypeId']===0x1;case _0x37e6c9(0x505):return DataManager[_0x37e6c9(0x3c0)](_0x5a118b)&&_0x5a118b[_0x37e6c9(0x336)]===0x2;case _0x37e6c9(0x3c5):return DataManager['isItem'](_0x5a118b)&&_0x5a118b['itypeId']===0x3;case _0x37e6c9(0x508):return DataManager['isItem'](_0x5a118b)&&_0x5a118b[_0x37e6c9(0x336)]===0x4;case _0x37e6c9(0x2f9):return DataManager[_0x37e6c9(0x3c0)](_0x5a118b)&&_0x5a118b['consumable'];case _0x37e6c9(0x33c):return DataManager[_0x37e6c9(0x3c0)](_0x5a118b)&&!_0x5a118b[_0x37e6c9(0x479)];case _0x37e6c9(0x20e):return DataManager['isItem'](_0x5a118b)&&[0x0][_0x37e6c9(0x308)](_0x5a118b[_0x37e6c9(0x353)]);case _0x37e6c9(0x215):return DataManager[_0x37e6c9(0x3c0)](_0x5a118b)&&[0x0,0x1][_0x37e6c9(0x308)](_0x5a118b[_0x37e6c9(0x353)]);case _0x37e6c9(0x30b):return DataManager[_0x37e6c9(0x3c0)](_0x5a118b)&&[0x0,0x2]['includes'](_0x5a118b[_0x37e6c9(0x353)]);case _0x37e6c9(0x3ad):return DataManager['isItem'](_0x5a118b)&&[0x3][_0x37e6c9(0x308)](_0x5a118b[_0x37e6c9(0x353)]);case'AllWeapons':return DataManager[_0x37e6c9(0x1e8)](_0x5a118b);case _0x37e6c9(0x1e9):return DataManager[_0x37e6c9(0x379)](_0x5a118b);default:if(this[_0x37e6c9(0x218)][_0x37e6c9(0x455)](/WTYPE:(\d+)/i))return DataManager['isWeapon'](_0x5a118b)&&_0x5a118b[_0x37e6c9(0x1f5)]===Number(RegExp['$1']);else{if(this[_0x37e6c9(0x218)]['match'](/WTYPE:(.*)/i)){const _0x4cd90b=$dataSystem[_0x37e6c9(0x4bc)][_0x37e6c9(0x33a)](String(RegExp['$1'])[_0x37e6c9(0x264)]());return DataManager[_0x37e6c9(0x1e8)](_0x5a118b)&&_0x5a118b[_0x37e6c9(0x1f5)]===_0x4cd90b;}else{if(this[_0x37e6c9(0x218)][_0x37e6c9(0x455)](/ATYPE:(\d+)/i))return DataManager['isArmor'](_0x5a118b)&&_0x5a118b[_0x37e6c9(0x460)]===Number(RegExp['$1']);else{if(this['_category'][_0x37e6c9(0x455)](/ATYPE:(.*)/i)){const _0x90c7c6=$dataSystem[_0x37e6c9(0x4a5)]['indexOf'](String(RegExp['$1'])['trim']());return DataManager[_0x37e6c9(0x379)](_0x5a118b)&&_0x5a118b[_0x37e6c9(0x460)]===_0x90c7c6;}else{if(this[_0x37e6c9(0x218)][_0x37e6c9(0x455)](/ETYPE:(\d+)/i))return!!_0x5a118b&&_0x5a118b[_0x37e6c9(0x41b)]===Number(RegExp['$1']);else{if(this[_0x37e6c9(0x218)]['match'](/ETYPE:(.*)/i)){const _0x432305=$dataSystem[_0x37e6c9(0x375)]['indexOf'](String(RegExp['$1'])['trim']());return DataManager[_0x37e6c9(0x379)](_0x5a118b)&&_0x5a118b[_0x37e6c9(0x41b)]===_0x432305;}else{if(this[_0x37e6c9(0x218)][_0x37e6c9(0x455)](/Category:(.*)/i))return!!_0x5a118b&&_0x5a118b[_0x37e6c9(0x385)][_0x37e6c9(0x308)](String(RegExp['$1'])[_0x37e6c9(0x480)]()['trim']());}}}}}}}return![];},Window_ItemList['prototype']['isShowNew']=function(){return!![];},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x317)]=Window_ItemList['prototype'][_0x2459ae(0x28b)],Window_ItemList[_0x2459ae(0x316)][_0x2459ae(0x28b)]=function(_0x45b203){const _0x4ee5aa=_0x2459ae;VisuMZ[_0x4ee5aa(0x368)][_0x4ee5aa(0x317)]['call'](this,_0x45b203),this['placeItemNewLabel'](_0x45b203);},Window_ItemList[_0x2459ae(0x316)]['drawItemNumber']=function(_0x584037,_0x236de0,_0x3b072a,_0x3f8639){Window_Selectable['prototype']['drawItemNumber']['call'](this,_0x584037,_0x236de0,_0x3b072a,_0x3f8639);},Window_ItemList[_0x2459ae(0x316)][_0x2459ae(0x3f7)]=function(_0x256f7c){const _0x19a5ba=_0x2459ae,_0x19e265=this[_0x19a5ba(0x249)](_0x256f7c);if(!_0x19e265||!this[_0x19a5ba(0x1e3)]())return;if(!$gameParty['isNewItem'](_0x19e265))return;const _0x4cc411=this[_0x19a5ba(0x1e7)](_0x256f7c),_0x5e7603=_0x4cc411['x'],_0x5dccc2=_0x4cc411['y']+(this['lineHeight']()-ImageManager['iconHeight'])/0x2,_0x2486dd=VisuMZ[_0x19a5ba(0x368)][_0x19a5ba(0x27d)]['New'][_0x19a5ba(0x363)],_0x587d6d=VisuMZ[_0x19a5ba(0x368)][_0x19a5ba(0x27d)]['New'][_0x19a5ba(0x3ff)];this['placeNewLabel'](_0x19e265,_0x5e7603+_0x2486dd,_0x5dccc2+_0x587d6d);},Window_ItemList[_0x2459ae(0x316)][_0x2459ae(0x3a1)]=function(_0x192ca6){const _0x1137f0=_0x2459ae;this[_0x1137f0(0x2cc)]=_0x192ca6,this[_0x1137f0(0x506)]();},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x322)]=Window_ItemList['prototype'][_0x2459ae(0x310)],Window_ItemList['prototype'][_0x2459ae(0x310)]=function(){const _0x1e2e18=_0x2459ae;VisuMZ[_0x1e2e18(0x368)][_0x1e2e18(0x322)][_0x1e2e18(0x2ff)](this),this[_0x1e2e18(0x2cc)]&&this[_0x1e2e18(0x2cc)][_0x1e2e18(0x48e)]===Window_ShopStatus&&this[_0x1e2e18(0x2cc)][_0x1e2e18(0x4fd)](this[_0x1e2e18(0x298)]());},Window_BattleItem[_0x2459ae(0x316)]['isEnabled']=function(_0x3f3196){const _0x22e831=_0x2459ae;return BattleManager[_0x22e831(0x39d)]()?BattleManager[_0x22e831(0x39d)]()[_0x22e831(0x4a0)](_0x3f3196):Window_ItemList['prototype']['isEnabled'][_0x22e831(0x2ff)](this,_0x3f3196);},Window_EventItem[_0x2459ae(0x316)][_0x2459ae(0x1e3)]=function(){return![];},Window_EquipStatus[_0x2459ae(0x316)][_0x2459ae(0x1dc)]=function(){const _0x33f6c9=_0x2459ae;return VisuMZ['ItemsEquipsCore'][_0x33f6c9(0x27d)]['EquipScene'][_0x33f6c9(0x4bf)];},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x2c6)]=Window_EquipStatus[_0x2459ae(0x316)]['refresh'],Window_EquipStatus[_0x2459ae(0x316)][_0x2459ae(0x4a4)]=function(){const _0x1b1731=_0x2459ae;this[_0x1b1731(0x4d7)](),this[_0x1b1731(0x3b8)]();if(this[_0x1b1731(0x296)])this[_0x1b1731(0x296)][_0x1b1731(0x4a4)]();this[_0x1b1731(0x1dc)]()?this[_0x1b1731(0x3fc)]():VisuMZ[_0x1b1731(0x368)][_0x1b1731(0x2c6)][_0x1b1731(0x2ff)](this);},Window_EquipStatus['prototype'][_0x2459ae(0x3fc)]=function(){const _0x1d546b=_0x2459ae;this[_0x1d546b(0x4ad)][_0x1d546b(0x2a2)]();if(!this[_0x1d546b(0x296)])return;if(this[_0x1d546b(0x432)]()){const _0x30fb59=ImageManager['loadPicture'](this[_0x1d546b(0x296)][_0x1d546b(0x2d5)]());_0x30fb59[_0x1d546b(0x2b0)](this['onMenuImageLoad'][_0x1d546b(0x4b1)](this));}else this['refreshItemsEquipsCoreNoMenuImage']();},Window_EquipStatus[_0x2459ae(0x316)]['isMainMenuCoreMenuImageOptionAvailable']=function(){const _0x2475c5=_0x2459ae;return Imported[_0x2475c5(0x35e)]&&this[_0x2475c5(0x296)][_0x2475c5(0x2d5)]()!==''&&VisuMZ[_0x2475c5(0x368)][_0x2475c5(0x27d)][_0x2475c5(0x4e3)]['MenuPortraits'];},Window_EquipStatus[_0x2459ae(0x316)][_0x2459ae(0x263)]=function(){const _0xc22220=_0x2459ae;VisuMZ[_0xc22220(0x368)][_0xc22220(0x27d)]['EquipScene'][_0xc22220(0x213)][_0xc22220(0x2ff)](this),this[_0xc22220(0x1da)]();},Window_EquipStatus[_0x2459ae(0x316)][_0x2459ae(0x391)]=function(){const _0x57bfd=_0x2459ae;VisuMZ['ItemsEquipsCore'][_0x57bfd(0x27d)]['EquipScene'][_0x57bfd(0x25f)]['call'](this),this['drawParamsItemsEquipsCore']();},Window_EquipStatus[_0x2459ae(0x316)][_0x2459ae(0x1da)]=function(){const _0x8a2b50=_0x2459ae;this[_0x8a2b50(0x3b8)](),VisuMZ[_0x8a2b50(0x368)][_0x8a2b50(0x27d)][_0x8a2b50(0x4e3)][_0x8a2b50(0x3ea)]['call'](this);},Window_EquipStatus[_0x2459ae(0x316)][_0x2459ae(0x320)]=function(_0x120c90,_0x51dac,_0x4dac0c,_0x3c1b81,_0x2135b7){const _0x4d3c12=_0x2459ae,_0x5c3d98=ImageManager[_0x4d3c12(0x2c9)](_0x120c90[_0x4d3c12(0x2d5)]()),_0x53dee7=this['innerWidth']-_0x5c3d98[_0x4d3c12(0x2bf)];_0x51dac+=_0x53dee7/0x2;if(_0x53dee7<0x0)_0x3c1b81-=_0x53dee7;Window_StatusBase[_0x4d3c12(0x316)][_0x4d3c12(0x320)]['call'](this,_0x120c90,_0x51dac,_0x4dac0c,_0x3c1b81,_0x2135b7);},Window_EquipStatus['prototype']['actorParams']=function(){const _0x2d3aab=_0x2459ae;return Imported[_0x2d3aab(0x222)]?VisuMZ[_0x2d3aab(0x442)][_0x2d3aab(0x27d)]['Param'][_0x2d3aab(0x4b7)]:[0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7];},Window_EquipStatus[_0x2459ae(0x316)][_0x2459ae(0x483)]=function(){const _0x34d982=_0x2459ae;return VisuMZ[_0x34d982(0x368)]['Settings']['EquipScene'][_0x34d982(0x4aa)];},Window_EquipStatus[_0x2459ae(0x316)][_0x2459ae(0x30e)]=function(){const _0x276301=_0x2459ae;return Imported[_0x276301(0x222)]&&VisuMZ[_0x276301(0x442)]['Settings'][_0x276301(0x4c8)]['DrawIcons'];},Window_EquipStatus[_0x2459ae(0x316)]['drawUpdatedParamName']=function(_0x4532df,_0x50ee1b,_0x452760,_0x49f0f7){const _0x57565f=_0x2459ae,_0x405f1a=this[_0x57565f(0x40e)]();Imported[_0x57565f(0x222)]?this[_0x57565f(0x29a)](_0x50ee1b+_0x405f1a,_0x452760,_0x49f0f7,_0x4532df,![]):this[_0x57565f(0x262)](TextManager[_0x57565f(0x33d)](_0x4532df),_0x50ee1b+_0x405f1a,_0x452760,_0x49f0f7);},Window_EquipStatus[_0x2459ae(0x316)][_0x2459ae(0x484)]=function(_0x2c85ee,_0x53c739,_0x1501fa,_0x364f78){const _0x10bfcd=_0x2459ae,_0x4fddcd=this['itemPadding']();let _0x464bd8=0x0;Imported[_0x10bfcd(0x222)]?_0x464bd8=this[_0x10bfcd(0x296)][_0x10bfcd(0x2c0)](_0x2c85ee,!![]):_0x464bd8=this[_0x10bfcd(0x296)][_0x10bfcd(0x33d)](_0x2c85ee);const _0x4a9457=_0x464bd8;this[_0x10bfcd(0x262)](_0x464bd8,_0x53c739,_0x1501fa,_0x364f78-_0x4fddcd,'right');},Window_EquipStatus['prototype']['drawUpdatedAfterParamValue']=function(_0x4fdc35,_0x5dce4a,_0x17767b,_0x407e83){const _0x158981=_0x2459ae,_0x24053f=this[_0x158981(0x40e)]();let _0x5ce0af=0x0,_0x4b4597=0x0,_0x302df0='';if(this[_0x158981(0x29d)]){Imported['VisuMZ_0_CoreEngine']?(_0x5ce0af=this[_0x158981(0x296)][_0x158981(0x2c0)](_0x4fdc35,![]),_0x4b4597=this[_0x158981(0x29d)][_0x158981(0x2c0)](_0x4fdc35,![]),_0x302df0=this['_tempActor'][_0x158981(0x2c0)](_0x4fdc35,!![])):(_0x5ce0af=this[_0x158981(0x296)][_0x158981(0x33d)](_0x4fdc35),_0x4b4597=this[_0x158981(0x29d)][_0x158981(0x33d)](_0x4fdc35),_0x302df0=this[_0x158981(0x29d)][_0x158981(0x33d)](_0x4fdc35));const _0x33fcdf=_0x5ce0af,_0x5c3fdd=_0x4b4597;diffValue=_0x5c3fdd-_0x33fcdf,this['changeTextColor'](ColorManager[_0x158981(0x25d)](diffValue)),this[_0x158981(0x262)](_0x302df0,_0x5dce4a,_0x17767b,_0x407e83-_0x24053f,_0x158981(0x309));}},Window_EquipStatus['prototype'][_0x2459ae(0x1df)]=function(_0x532b8f,_0x5af5e3,_0x532206,_0x3793ee){const _0x477728=_0x2459ae,_0x41d469=this[_0x477728(0x40e)]();let _0x16c757=0x0,_0x4c6bf4=0x0,_0x4019b2=![];if(this['_tempActor']){Imported[_0x477728(0x222)]?(_0x16c757=this[_0x477728(0x296)]['paramValueByName'](_0x532b8f,![]),_0x4c6bf4=this['_tempActor'][_0x477728(0x2c0)](_0x532b8f,![]),_0x4019b2=String(this[_0x477728(0x296)][_0x477728(0x2c0)](_0x532b8f,!![]))[_0x477728(0x455)](/([%％])/i)):(_0x16c757=this[_0x477728(0x296)][_0x477728(0x33d)](_0x532b8f),_0x4c6bf4=this[_0x477728(0x29d)][_0x477728(0x33d)](_0x532b8f),_0x4019b2=_0x16c757%0x1!==0x0||_0x4c6bf4%0x1!==0x0);const _0x50ce81=_0x16c757,_0x211998=_0x4c6bf4,_0x5e7fd5=_0x211998-_0x50ce81;let _0x429444=_0x5e7fd5;if(_0x4019b2)_0x429444=Math[_0x477728(0x343)](_0x5e7fd5*0x64)+'%';_0x5e7fd5!==0x0&&(this[_0x477728(0x37e)](ColorManager[_0x477728(0x25d)](_0x5e7fd5)),_0x429444=(_0x5e7fd5>0x0?_0x477728(0x2b2):_0x477728(0x35b))['format'](_0x429444),this[_0x477728(0x262)](_0x429444,_0x5af5e3+_0x41d469,_0x532206,_0x3793ee,_0x477728(0x29f)));}},Window_EquipStatus[_0x2459ae(0x316)][_0x2459ae(0x290)]=function(_0x3abf24,_0x2192cb,_0x167d20,_0x2cbe19,_0x33f8b0){const _0xfed30d=_0x2459ae;if(VisuMZ[_0xfed30d(0x368)][_0xfed30d(0x27d)]['EquipScene'][_0xfed30d(0x42b)]===![])return;_0x33f8b0=Math[_0xfed30d(0x2c4)](_0x33f8b0||0x1,0x1);while(_0x33f8b0--){_0x2cbe19=_0x2cbe19||this[_0xfed30d(0x1f1)](),this[_0xfed30d(0x4ad)]['paintOpacity']=0xa0;const _0x56fded=ColorManager[_0xfed30d(0x1e5)]();this[_0xfed30d(0x4ad)][_0xfed30d(0x4ef)](_0x3abf24+0x1,_0x2192cb+0x1,_0x167d20-0x2,_0x2cbe19-0x2,_0x56fded),this[_0xfed30d(0x4ad)]['paintOpacity']=0xff;}},ColorManager[_0x2459ae(0x1e5)]=function(){const _0x4d771c=_0x2459ae,_0x5ced98=VisuMZ['ItemsEquipsCore'][_0x4d771c(0x27d)][_0x4d771c(0x4e3)];let _0x1c91c1=_0x5ced98[_0x4d771c(0x242)]!==undefined?_0x5ced98[_0x4d771c(0x242)]:0x13;return ColorManager[_0x4d771c(0x431)](_0x1c91c1);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x25c)]=Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x3d6)],Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x3d6)]=function(_0x34590){const _0x3dbc48=_0x2459ae;VisuMZ['ItemsEquipsCore'][_0x3dbc48(0x25c)][_0x3dbc48(0x2ff)](this,_0x34590),this[_0x3dbc48(0x433)](_0x34590);},Window_EquipCommand['prototype'][_0x2459ae(0x433)]=function(_0x19eef5){const _0x7fa472=_0x2459ae,_0x385438=new Rectangle(0x0,0x0,_0x19eef5[_0x7fa472(0x2bf)],_0x19eef5[_0x7fa472(0x496)]);this[_0x7fa472(0x258)]=new Window_Base(_0x385438),this[_0x7fa472(0x258)]['opacity']=0x0,this[_0x7fa472(0x1d9)](this[_0x7fa472(0x258)]),this[_0x7fa472(0x486)]();},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x506)]=function(){const _0x1c1300=_0x2459ae;Window_HorzCommand[_0x1c1300(0x316)][_0x1c1300(0x506)]['call'](this);if(this['_commandNameWindow'])this['updateCommandNameWindow']();},Window_EquipCommand['prototype'][_0x2459ae(0x486)]=function(){const _0x20205a=_0x2459ae,_0x34da5c=this[_0x20205a(0x258)];_0x34da5c['contents'][_0x20205a(0x2a2)]();const _0x200cb7=this[_0x20205a(0x37b)](this['index']());if(_0x200cb7===_0x20205a(0x30d)){const _0x27fb48=this[_0x20205a(0x1e7)](this[_0x20205a(0x373)]());let _0x277f8a=this['commandName'](this[_0x20205a(0x373)]());_0x277f8a=_0x277f8a[_0x20205a(0x1db)](/\\I\[(\d+)\]/gi,''),_0x34da5c['resetFontSettings'](),this['commandNameWindowDrawBackground'](_0x277f8a,_0x27fb48),this[_0x20205a(0x4e0)](_0x277f8a,_0x27fb48),this[_0x20205a(0x29c)](_0x277f8a,_0x27fb48);}},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x2e6)]=function(_0x474d0d,_0xe2aa0f){},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x4e0)]=function(_0x31ce78,_0x504ce4){const _0x19778f=_0x2459ae,_0x1c7adc=this['_commandNameWindow'];_0x1c7adc[_0x19778f(0x262)](_0x31ce78,0x0,_0x504ce4['y'],_0x1c7adc['innerWidth'],_0x19778f(0x245));},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x29c)]=function(_0x11b141,_0x58dda1){const _0x56cf24=_0x2459ae,_0x198597=this[_0x56cf24(0x258)],_0x2afc16=$gameSystem[_0x56cf24(0x44b)](),_0x3f8bc7=_0x58dda1['x']+Math[_0x56cf24(0x2d2)](_0x58dda1[_0x56cf24(0x2bf)]/0x2)+_0x2afc16;_0x198597['x']=_0x198597[_0x56cf24(0x2bf)]/-0x2+_0x3f8bc7,_0x198597['y']=Math[_0x56cf24(0x2d2)](_0x58dda1[_0x56cf24(0x496)]/0x2);},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x2f4)]=function(){const _0xee319a=_0x2459ae;return Imported['VisuMZ_0_CoreEngine']&&Window_HorzCommand[_0xee319a(0x316)][_0xee319a(0x2f4)]['call'](this);},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x371)]=function(){const _0x57808a=_0x2459ae;if(this[_0x57808a(0x251)]()===_0x57808a(0x4c7))Window_HorzCommand[_0x57808a(0x316)][_0x57808a(0x371)][_0x57808a(0x2ff)](this);},Window_EquipCommand[_0x2459ae(0x316)]['processCursorMoveModernControls']=function(){const _0x39ac1c=_0x2459ae;!this[_0x39ac1c(0x44e)]()&&Window_HorzCommand[_0x39ac1c(0x316)][_0x39ac1c(0x4f4)]['call'](this);},Window_EquipCommand['prototype']['processCursorSpecialCheckModernControls']=function(){const _0x3554ce=_0x2459ae;if(!this[_0x3554ce(0x306)]())return![];if(SceneManager[_0x3554ce(0x415)][_0x3554ce(0x48e)]!==Scene_Equip)return![];return Input[_0x3554ce(0x30c)]('down')&&(this[_0x3554ce(0x232)](),SceneManager[_0x3554ce(0x415)][_0x3554ce(0x2d0)](),SceneManager[_0x3554ce(0x415)][_0x3554ce(0x1f6)][_0x3554ce(0x43e)](-0x1)),![];},Window_EquipCommand['prototype'][_0x2459ae(0x26a)]=function(){const _0x22bdc3=_0x2459ae;return this[_0x22bdc3(0x331)]?this[_0x22bdc3(0x331)][_0x22bdc3(0x335)]:0x3;},Window_EquipCommand['prototype'][_0x2459ae(0x204)]=function(){const _0x24c080=_0x2459ae;if(this[_0x24c080(0x3a5)]()&&this[_0x24c080(0x302)]&&SceneManager[_0x24c080(0x415)][_0x24c080(0x48e)]===Scene_Equip){if(this[_0x24c080(0x402)]()&&TouchInput['isHovered']())this[_0x24c080(0x1e0)](![]);else TouchInput[_0x24c080(0x30c)]()&&this['onTouchSelectModernControls'](!![]);if(TouchInput['isClicked']())this[_0x24c080(0x233)]();else TouchInput[_0x24c080(0x4d9)]()&&this[_0x24c080(0x512)]();}},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x1e0)]=function(_0x1afb47){const _0x20927c=_0x2459ae;this['_doubleTouch']=![];const _0x1f33f4=this['index'](),_0x3e4a64=this['hitIndex'](),_0xf56950=SceneManager[_0x20927c(0x415)][_0x20927c(0x1f6)];if(_0xf56950['isOpen']()&&_0xf56950[_0x20927c(0x302)]){if(_0x3e4a64>=0x0)_0x3e4a64===this[_0x20927c(0x373)]()&&(this[_0x20927c(0x326)]=!![]),this[_0x20927c(0x252)](),this[_0x20927c(0x420)](_0x3e4a64);else _0xf56950['hitIndex']()>=0x0&&(this[_0x20927c(0x4fb)](),this[_0x20927c(0x32e)]());}_0x1afb47&&this[_0x20927c(0x373)]()!==_0x1f33f4&&this[_0x20927c(0x232)]();},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x36e)]=function(){const _0x3bdc97=_0x2459ae;this[_0x3bdc97(0x518)](),this[_0x3bdc97(0x3fb)](),this[_0x3bdc97(0x280)]();},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x4a4)]=function(){const _0x5f1e8b=_0x2459ae;Window_HorzCommand[_0x5f1e8b(0x316)]['refresh']['call'](this),this['refreshCursor']();},Window_EquipCommand[_0x2459ae(0x316)]['addEquipCommand']=function(){const _0x3bac5b=_0x2459ae;if(!this[_0x3bac5b(0x3c8)]())return;const _0x46cecb=this[_0x3bac5b(0x22f)](),_0x2a6736=VisuMZ['ItemsEquipsCore'][_0x3bac5b(0x27d)][_0x3bac5b(0x4e3)][_0x3bac5b(0x281)],_0x5aa7f1=_0x46cecb===_0x3bac5b(0x50f)?TextManager[_0x3bac5b(0x2fa)]:_0x3bac5b(0x388)['format'](_0x2a6736,TextManager['equip2']),_0x47e5d4=this[_0x3bac5b(0x3b6)]();this[_0x3bac5b(0x256)](_0x5aa7f1,_0x3bac5b(0x4c7),_0x47e5d4);},Window_EquipCommand['prototype'][_0x2459ae(0x3c8)]=function(){const _0x18d0f4=_0x2459ae;return!this[_0x18d0f4(0x2f4)]();},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x3b6)]=function(){return!![];},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x3fb)]=function(){const _0x5d1a56=_0x2459ae;if(!this[_0x5d1a56(0x2c5)]())return;const _0x22c81d=this[_0x5d1a56(0x22f)](),_0x249035=VisuMZ['ItemsEquipsCore'][_0x5d1a56(0x27d)][_0x5d1a56(0x4e3)]['CmdIconOptimize'],_0x3b8dac=_0x22c81d===_0x5d1a56(0x50f)?TextManager[_0x5d1a56(0x40c)]:_0x5d1a56(0x388)[_0x5d1a56(0x342)](_0x249035,TextManager[_0x5d1a56(0x40c)]),_0x4d4655=this['isOptimizeCommandEnabled']();this[_0x5d1a56(0x256)](_0x3b8dac,_0x5d1a56(0x40c),_0x4d4655);},Window_EquipCommand['prototype'][_0x2459ae(0x2c5)]=function(){const _0x327d2e=_0x2459ae;return VisuMZ[_0x327d2e(0x368)][_0x327d2e(0x27d)][_0x327d2e(0x4e3)][_0x327d2e(0x210)];},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x4b3)]=function(){return!![];},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x280)]=function(){const _0x14a44d=_0x2459ae;if(!this[_0x14a44d(0x36a)]())return;const _0xf2644c=this[_0x14a44d(0x22f)](),_0x2d0427=VisuMZ['ItemsEquipsCore'][_0x14a44d(0x27d)][_0x14a44d(0x4e3)][_0x14a44d(0x269)],_0x9f1856=_0xf2644c===_0x14a44d(0x50f)?TextManager[_0x14a44d(0x2a2)]:'\x5cI[%1]%2'[_0x14a44d(0x342)](_0x2d0427,TextManager['clear']),_0x27a589=this[_0x14a44d(0x2a8)]();this['addCommand'](_0x9f1856,'clear',_0x27a589);},Window_EquipCommand[_0x2459ae(0x316)]['isClearCommandAdded']=function(){const _0x15e3d9=_0x2459ae;return VisuMZ['ItemsEquipsCore'][_0x15e3d9(0x27d)]['EquipScene'][_0x15e3d9(0x228)];},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x2a8)]=function(){return!![];},Window_EquipCommand['prototype'][_0x2459ae(0x3e2)]=function(){const _0x1cdeab=_0x2459ae;return VisuMZ['ItemsEquipsCore']['Settings'][_0x1cdeab(0x4e3)][_0x1cdeab(0x390)];},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x28b)]=function(_0x187cbb){const _0x1c4f7b=_0x2459ae,_0x15c0ff=this[_0x1c4f7b(0x37b)](_0x187cbb);if(_0x15c0ff===_0x1c4f7b(0x2ce))this[_0x1c4f7b(0x2e0)](_0x187cbb);else _0x15c0ff===_0x1c4f7b(0x30d)?this['drawItemStyleIcon'](_0x187cbb):Window_HorzCommand[_0x1c4f7b(0x316)][_0x1c4f7b(0x28b)][_0x1c4f7b(0x2ff)](this,_0x187cbb);},Window_EquipCommand['prototype'][_0x2459ae(0x22f)]=function(){const _0x2f9ac7=_0x2459ae;return VisuMZ[_0x2f9ac7(0x368)]['Settings'][_0x2f9ac7(0x4e3)][_0x2f9ac7(0x4ab)];},Window_EquipCommand['prototype']['commandStyleCheck']=function(_0x551756){const _0x17885d=_0x2459ae;if(_0x551756<0x0)return'text';const _0x43951e=this['commandStyle']();if(_0x43951e!==_0x17885d(0x357))return _0x43951e;else{if(this[_0x17885d(0x284)]()>0x0){const _0x3570df=this['commandName'](_0x551756);if(_0x3570df[_0x17885d(0x455)](/\\I\[(\d+)\]/i)){const _0x3b4954=this['itemLineRect'](_0x551756),_0x35e687=this[_0x17885d(0x3dc)](_0x3570df)[_0x17885d(0x2bf)];return _0x35e687<=_0x3b4954[_0x17885d(0x2bf)]?_0x17885d(0x2ce):_0x17885d(0x30d);}}}return'text';},Window_EquipCommand['prototype'][_0x2459ae(0x2e0)]=function(_0xd33c97){const _0x192031=_0x2459ae,_0x5356c8=this['itemLineRect'](_0xd33c97),_0x2e45c8=this['commandName'](_0xd33c97),_0x4e9066=this[_0x192031(0x3dc)](_0x2e45c8)[_0x192031(0x2bf)];this[_0x192031(0x41f)](this[_0x192031(0x50d)](_0xd33c97));const _0xd152da=this[_0x192031(0x3e2)]();if(_0xd152da==='right')this[_0x192031(0x3e7)](_0x2e45c8,_0x5356c8['x']+_0x5356c8[_0x192031(0x2bf)]-_0x4e9066,_0x5356c8['y'],_0x4e9066);else{if(_0xd152da==='center'){const _0x130798=_0x5356c8['x']+Math[_0x192031(0x2d2)]((_0x5356c8['width']-_0x4e9066)/0x2);this[_0x192031(0x3e7)](_0x2e45c8,_0x130798,_0x5356c8['y'],_0x4e9066);}else this[_0x192031(0x3e7)](_0x2e45c8,_0x5356c8['x'],_0x5356c8['y'],_0x4e9066);}},Window_EquipCommand[_0x2459ae(0x316)][_0x2459ae(0x4d4)]=function(_0x1d7fea){const _0x1d66b4=_0x2459ae;this[_0x1d66b4(0x300)](_0x1d7fea)[_0x1d66b4(0x455)](/\\I\[(\d+)\]/i);const _0x38d23b=Number(RegExp['$1'])||0x0,_0x2adcbd=this[_0x1d66b4(0x1e7)](_0x1d7fea),_0x455a95=_0x2adcbd['x']+Math[_0x1d66b4(0x2d2)]((_0x2adcbd['width']-ImageManager[_0x1d66b4(0x33e)])/0x2),_0x12fe67=_0x2adcbd['y']+(_0x2adcbd['height']-ImageManager[_0x1d66b4(0x3c4)])/0x2;this[_0x1d66b4(0x31e)](_0x38d23b,_0x455a95,_0x12fe67);},Window_EquipSlot[_0x2459ae(0x316)][_0x2459ae(0x2f4)]=function(){const _0x30e828=_0x2459ae;return Imported[_0x30e828(0x222)]&&Window_HorzCommand[_0x30e828(0x316)][_0x30e828(0x2f4)]['call'](this);},Window_EquipSlot[_0x2459ae(0x316)]['activate']=function(){const _0x4656dc=_0x2459ae;Window_StatusBase[_0x4656dc(0x316)][_0x4656dc(0x252)][_0x4656dc(0x2ff)](this),this[_0x4656dc(0x506)]();},Window_EquipSlot['prototype'][_0x2459ae(0x2c3)]=function(){Window_StatusBase['prototype']['processCursorMove']['call'](this),this['checkShiftRemoveShortcut']();},Window_EquipSlot[_0x2459ae(0x316)][_0x2459ae(0x1ec)]=function(){const _0x3f85b1=_0x2459ae;if(!this[_0x3f85b1(0x445)]())return;if(Input['isTriggered'](_0x3f85b1(0x487))&&this[_0x3f85b1(0x298)]()){const _0x4104fc=SceneManager[_0x3f85b1(0x415)][_0x3f85b1(0x296)];_0x4104fc&&(this[_0x3f85b1(0x458)](this[_0x3f85b1(0x373)]())?(this['processShiftRemoveShortcut'](),this[_0x3f85b1(0x310)]()):this[_0x3f85b1(0x2aa)]());}},Window_EquipSlot[_0x2459ae(0x316)][_0x2459ae(0x458)]=function(_0x21e5f0){const _0x486eb7=_0x2459ae,_0x2c0726=SceneManager['_scene'][_0x486eb7(0x296)];if(!_0x2c0726)return;if(!_0x2c0726[_0x486eb7(0x289)](this[_0x486eb7(0x373)]()))return![];const _0x3f8494=_0x2c0726[_0x486eb7(0x440)]()[this[_0x486eb7(0x373)]()];if(_0x2c0726[_0x486eb7(0x297)]()[_0x486eb7(0x308)](_0x3f8494))return![];return!![];;},Window_EquipSlot[_0x2459ae(0x316)][_0x2459ae(0x3a6)]=function(){const _0xb85987=_0x2459ae;SoundManager['playEquip']();const _0xb14414=SceneManager[_0xb85987(0x415)][_0xb85987(0x296)];_0xb14414['changeEquip'](this['index'](),null),this[_0xb85987(0x4a4)](),this[_0xb85987(0x24c)][_0xb85987(0x4a4)](),this[_0xb85987(0x506)]();const _0x30de6d=SceneManager[_0xb85987(0x415)][_0xb85987(0x2cc)];if(_0x30de6d)_0x30de6d[_0xb85987(0x4a4)]();},Window_EquipSlot[_0x2459ae(0x316)][_0x2459ae(0x445)]=function(){const _0xf8fc8b=_0x2459ae;if(!this[_0xf8fc8b(0x498)])return![];if(!VisuMZ[_0xf8fc8b(0x368)][_0xf8fc8b(0x27d)][_0xf8fc8b(0x4e3)][_0xf8fc8b(0x2ef)])return![];return!![];},Window_EquipSlot['prototype'][_0x2459ae(0x4f4)]=function(){const _0x3b4e0c=_0x2459ae;!this[_0x3b4e0c(0x44e)]()&&Window_StatusBase[_0x3b4e0c(0x316)][_0x3b4e0c(0x4f4)]['call'](this);},Window_EquipSlot[_0x2459ae(0x316)][_0x2459ae(0x44e)]=function(){const _0x4b649f=_0x2459ae;if(!this[_0x4b649f(0x306)]())return![];if(SceneManager[_0x4b649f(0x415)][_0x4b649f(0x48e)]!==Scene_Equip)return![];if(this[_0x4b649f(0x267)]())return this[_0x4b649f(0x232)](),Input['clear'](),SceneManager[_0x4b649f(0x415)][_0x4b649f(0x2d9)](),![];else{if(Input[_0x4b649f(0x504)](_0x4b649f(0x3af))){const _0x2df899=this[_0x4b649f(0x373)]();return Input[_0x4b649f(0x314)](_0x4b649f(0x487))?this[_0x4b649f(0x421)]():this[_0x4b649f(0x2af)](Input[_0x4b649f(0x30c)](_0x4b649f(0x3af))),this[_0x4b649f(0x373)]()!==_0x2df899&&this[_0x4b649f(0x232)](),!![];}else{if(this[_0x4b649f(0x355)]()&&Input[_0x4b649f(0x30c)](_0x4b649f(0x487)))return!![];}}return![];},Window_EquipSlot['prototype']['allowCommandWindowCursorUp']=function(){const _0x34147f=_0x2459ae;if(this[_0x34147f(0x373)]()!==0x0)return![];const _0x18cdc2=VisuMZ[_0x34147f(0x368)][_0x34147f(0x27d)][_0x34147f(0x4e3)];if(!_0x18cdc2[_0x34147f(0x210)]&&!_0x18cdc2[_0x34147f(0x228)])return![];return Input[_0x34147f(0x30c)]('up');},Window_EquipSlot[_0x2459ae(0x316)][_0x2459ae(0x355)]=function(){const _0x334fd2=_0x2459ae;return VisuMZ[_0x334fd2(0x368)][_0x334fd2(0x27d)][_0x334fd2(0x4e3)][_0x334fd2(0x2ef)];},Window_EquipSlot[_0x2459ae(0x316)][_0x2459ae(0x204)]=function(){const _0x1d6bea=_0x2459ae;if(this[_0x1d6bea(0x3a5)]()&&this['visible']&&SceneManager[_0x1d6bea(0x415)][_0x1d6bea(0x48e)]===Scene_Equip){if(this['isHoverEnabled']()&&TouchInput['isHovered']())this[_0x1d6bea(0x1e0)](![]);else TouchInput[_0x1d6bea(0x30c)]()&&this['onTouchSelectModernControls'](!![]);if(TouchInput[_0x1d6bea(0x49b)]())this['onTouchOk']();else TouchInput[_0x1d6bea(0x4d9)]()&&this[_0x1d6bea(0x512)]();}},Window_EquipSlot[_0x2459ae(0x316)][_0x2459ae(0x1e0)]=function(_0x19e6da){const _0x1d63d1=_0x2459ae;this['_doubleTouch']=![];const _0x3457f7=this[_0x1d63d1(0x373)](),_0x58f809=this[_0x1d63d1(0x2da)](),_0x574e3e=SceneManager[_0x1d63d1(0x415)]['_commandWindow'];if(_0x574e3e[_0x1d63d1(0x3a5)]()&&_0x574e3e[_0x1d63d1(0x302)]){if(_0x58f809>=0x0)_0x58f809===this[_0x1d63d1(0x373)]()&&(this[_0x1d63d1(0x326)]=!![]),this[_0x1d63d1(0x252)](),this[_0x1d63d1(0x420)](_0x58f809);else _0x574e3e[_0x1d63d1(0x2da)]()>=0x0&&(this['deactivate'](),this[_0x1d63d1(0x32e)]());}_0x19e6da&&this[_0x1d63d1(0x373)]()!==_0x3457f7&&this[_0x1d63d1(0x232)]();},Window_EquipSlot[_0x2459ae(0x316)][_0x2459ae(0x2ea)]=function(){return this['index']();},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x36c)]=Window_EquipItem[_0x2459ae(0x316)][_0x2459ae(0x308)],Window_EquipItem[_0x2459ae(0x316)][_0x2459ae(0x308)]=function(_0x2aa015){const _0x4ffdc5=_0x2459ae;return _0x2aa015===null&&this['nonRemovableEtypes']()[_0x4ffdc5(0x308)](this[_0x4ffdc5(0x41b)]())?this[_0x4ffdc5(0x1f4)][_0x4ffdc5(0x335)]>0x0?![]:!![]:VisuMZ[_0x4ffdc5(0x368)][_0x4ffdc5(0x36c)][_0x4ffdc5(0x2ff)](this,_0x2aa015);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x365)]=Window_EquipItem[_0x2459ae(0x316)]['isEnabled'],Window_EquipItem[_0x2459ae(0x316)]['isEnabled']=function(_0x542c91){const _0x2d1f03=_0x2459ae;if(_0x542c91&&this[_0x2d1f03(0x296)]){if(this[_0x2d1f03(0x297)]()[_0x2d1f03(0x308)](this['etypeId']()))return![];if(this['itemHasEquipLimit'](_0x542c91))return![];if(this[_0x2d1f03(0x288)](_0x542c91))return![];if(this[_0x2d1f03(0x42e)](_0x542c91))return![];}return VisuMZ[_0x2d1f03(0x368)][_0x2d1f03(0x365)]['call'](this,_0x542c91);},Window_EquipItem[_0x2459ae(0x316)]['itemHasEquipLimit']=function(_0x7d5f4d){const _0x2563a9=_0x2459ae,_0x191eac=_0x7d5f4d[_0x2563a9(0x321)];if(_0x191eac['match'](/<EQUIP COPY LIMIT:[ ](\d+)>/i)){const _0x40c1fd=Number(RegExp['$1'])||0x1;let _0x11102b=0x0;const _0x5c5149=this[_0x2563a9(0x296)][_0x2563a9(0x276)](),_0xea04a5=SceneManager[_0x2563a9(0x415)][_0x2563a9(0x1f6)][_0x2563a9(0x2ea)]();_0x5c5149[_0xea04a5]=null;for(const _0x52de0d of _0x5c5149){if(!_0x52de0d)continue;if(DataManager['isWeapon'](_0x7d5f4d)===DataManager[_0x2563a9(0x1e8)](_0x52de0d)){if(_0x7d5f4d['id']===_0x52de0d['id'])_0x11102b+=0x1;}}return _0x11102b>=_0x40c1fd;}else return![];},Window_EquipItem[_0x2459ae(0x316)]['isSoleWeaponType']=function(_0x259ee5){const _0x367e40=_0x2459ae;if(!DataManager['isWeapon'](_0x259ee5))return![];const _0x11baaf=/<EQUIP WEAPON TYPE LIMIT:[ ](\d+)>/i;let _0x3c9596=0x0;const _0x1fbb3b=this[_0x367e40(0x296)]['equips'](),_0x4bd235=SceneManager[_0x367e40(0x415)]['_slotWindow'][_0x367e40(0x2ea)]();_0x1fbb3b[_0x4bd235]=null;for(const _0x2a5c09 of _0x1fbb3b){if(!_0x2a5c09)continue;if(!DataManager[_0x367e40(0x1e8)](_0x2a5c09))continue;if(_0x259ee5[_0x367e40(0x1f5)]===_0x2a5c09[_0x367e40(0x1f5)]){_0x3c9596+=0x1;if(_0x259ee5[_0x367e40(0x321)][_0x367e40(0x455)](_0x11baaf)){const _0x1e1165=Number(RegExp['$1'])||0x1;if(_0x3c9596>=_0x1e1165)return!![];}if(_0x2a5c09[_0x367e40(0x321)][_0x367e40(0x455)](_0x11baaf)){const _0x16759a=Number(RegExp['$1'])||0x1;if(_0x3c9596>=_0x16759a)return!![];}}}return![];},Window_EquipItem['prototype'][_0x2459ae(0x42e)]=function(_0x3e22a1){const _0x2bf402=_0x2459ae;if(!DataManager[_0x2bf402(0x379)](_0x3e22a1))return![];const _0x53cb3d=/<EQUIP ARMOR TYPE LIMIT:[ ](\d+)>/i;let _0x43311b=0x0;const _0x41d058=this[_0x2bf402(0x296)]['equips'](),_0x1f8fda=SceneManager[_0x2bf402(0x415)][_0x2bf402(0x1f6)][_0x2bf402(0x2ea)]();_0x41d058[_0x1f8fda]=null;for(const _0x47f8e4 of _0x41d058){if(!_0x47f8e4)continue;if(!DataManager[_0x2bf402(0x379)](_0x47f8e4))continue;if(_0x3e22a1[_0x2bf402(0x460)]===_0x47f8e4[_0x2bf402(0x460)]){_0x43311b+=0x1;if(_0x3e22a1[_0x2bf402(0x321)][_0x2bf402(0x455)](_0x53cb3d)){const _0x1cf41a=Number(RegExp['$1'])||0x1;if(_0x43311b>=_0x1cf41a)return!![];}if(_0x47f8e4['note'][_0x2bf402(0x455)](_0x53cb3d)){const _0x268c1f=Number(RegExp['$1'])||0x1;if(_0x43311b>=_0x268c1f)return!![];}}}return![];},Window_EquipItem['prototype']['nonRemovableEtypes']=function(){const _0x2317cd=_0x2459ae;return VisuMZ[_0x2317cd(0x368)][_0x2317cd(0x27d)]['EquipScene']['NonRemoveETypes'];},Window_EquipItem['prototype'][_0x2459ae(0x28b)]=function(_0x1108d0){const _0x403b07=_0x2459ae,_0x4ae2f9=this['itemAt'](_0x1108d0);_0x4ae2f9?Window_ItemList[_0x403b07(0x316)][_0x403b07(0x28b)]['call'](this,_0x1108d0):this[_0x403b07(0x244)](_0x1108d0);},Window_EquipItem[_0x2459ae(0x316)][_0x2459ae(0x244)]=function(_0x154af9){const _0x46e885=_0x2459ae;this[_0x46e885(0x41f)](this[_0x46e885(0x414)](null));const _0x3f7fc9=VisuMZ[_0x46e885(0x368)][_0x46e885(0x27d)][_0x46e885(0x4e3)],_0xcda8c5=this[_0x46e885(0x1e7)](_0x154af9),_0x4e0f1a=_0xcda8c5['y']+(this[_0x46e885(0x1f1)]()-ImageManager[_0x46e885(0x3c4)])/0x2,_0x263969=ImageManager[_0x46e885(0x33e)]+0x4,_0x3cc01b=Math[_0x46e885(0x2c4)](0x0,_0xcda8c5['width']-_0x263969);this[_0x46e885(0x366)](),this['drawIcon'](_0x3f7fc9[_0x46e885(0x207)],_0xcda8c5['x'],_0x4e0f1a),this['drawText'](_0x3f7fc9[_0x46e885(0x364)],_0xcda8c5['x']+_0x263969,_0xcda8c5['y'],_0x3cc01b),this['changePaintOpacity'](!![]);},Window_EquipItem['prototype'][_0x2459ae(0x310)]=function(){const _0x5aa873=_0x2459ae;Window_ItemList['prototype'][_0x5aa873(0x310)]['call'](this);if(this[_0x5aa873(0x296)]&&this['_statusWindow']&&this[_0x5aa873(0x4e9)]>=0x0){const _0x145330=JsonEx[_0x5aa873(0x332)](this[_0x5aa873(0x296)]);_0x145330[_0x5aa873(0x29d)]=!![],_0x145330[_0x5aa873(0x475)](this[_0x5aa873(0x4e9)],this[_0x5aa873(0x298)]()),this[_0x5aa873(0x2cc)][_0x5aa873(0x41a)](_0x145330);}},VisuMZ['ItemsEquipsCore'][_0x2459ae(0x237)]=Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x3d6)],Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x3d6)]=function(_0x290761){const _0x42c748=_0x2459ae;VisuMZ[_0x42c748(0x368)][_0x42c748(0x237)][_0x42c748(0x2ff)](this,_0x290761),this['createCommandNameWindow'](_0x290761);},Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x433)]=function(_0x2870d5){const _0x32fbc2=_0x2459ae,_0x4c95be=new Rectangle(0x0,0x0,_0x2870d5[_0x32fbc2(0x2bf)],_0x2870d5[_0x32fbc2(0x496)]);this[_0x32fbc2(0x258)]=new Window_Base(_0x4c95be),this[_0x32fbc2(0x258)][_0x32fbc2(0x20d)]=0x0,this[_0x32fbc2(0x1d9)](this[_0x32fbc2(0x258)]),this[_0x32fbc2(0x486)]();},Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x506)]=function(){const _0x11136c=_0x2459ae;Window_HorzCommand['prototype'][_0x11136c(0x506)][_0x11136c(0x2ff)](this);if(this['_commandNameWindow'])this[_0x11136c(0x486)]();},Window_ShopCommand['prototype'][_0x2459ae(0x486)]=function(){const _0x4ee343=_0x2459ae,_0x223c91=this[_0x4ee343(0x258)];_0x223c91['contents']['clear']();const _0x54fb13=this[_0x4ee343(0x37b)](this[_0x4ee343(0x373)]());if(_0x54fb13===_0x4ee343(0x30d)){const _0x14594a=this[_0x4ee343(0x1e7)](this[_0x4ee343(0x373)]());let _0x55b541=this[_0x4ee343(0x300)](this[_0x4ee343(0x373)]());_0x55b541=_0x55b541[_0x4ee343(0x1db)](/\\I\[(\d+)\]/gi,''),_0x223c91[_0x4ee343(0x3b8)](),this[_0x4ee343(0x2e6)](_0x55b541,_0x14594a),this[_0x4ee343(0x4e0)](_0x55b541,_0x14594a),this[_0x4ee343(0x29c)](_0x55b541,_0x14594a);}},Window_ShopCommand[_0x2459ae(0x316)]['commandNameWindowDrawBackground']=function(_0x53a696,_0x36d8f3){},Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x4e0)]=function(_0x92a288,_0x412c6a){const _0x1018ec=_0x2459ae,_0x5e78ca=this[_0x1018ec(0x258)];_0x5e78ca['drawText'](_0x92a288,0x0,_0x412c6a['y'],_0x5e78ca[_0x1018ec(0x4dd)],_0x1018ec(0x245));},Window_ShopCommand['prototype']['commandNameWindowCenter']=function(_0xacb920,_0xa7fbe5){const _0x7da343=_0x2459ae,_0x25e9ec=this['_commandNameWindow'],_0x274d87=$gameSystem[_0x7da343(0x44b)](),_0xc3500c=_0xa7fbe5['x']+Math[_0x7da343(0x2d2)](_0xa7fbe5['width']/0x2)+_0x274d87;_0x25e9ec['x']=_0x25e9ec[_0x7da343(0x2bf)]/-0x2+_0xc3500c,_0x25e9ec['y']=Math[_0x7da343(0x2d2)](_0xa7fbe5[_0x7da343(0x496)]/0x2);},Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x26a)]=function(){const _0x1f06e1=_0x2459ae;return this[_0x1f06e1(0x331)]?this[_0x1f06e1(0x331)]['length']:0x3;},Window_ShopCommand['prototype'][_0x2459ae(0x25b)]=function(){const _0x25c548=_0x2459ae;return VisuMZ[_0x25c548(0x368)][_0x25c548(0x27d)]['ShopScene'][_0x25c548(0x2c8)];},Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x36e)]=function(){const _0x5d17da=_0x2459ae;this[_0x5d17da(0x3b3)](),this[_0x5d17da(0x514)](),this[_0x5d17da(0x507)]();},Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x4a4)]=function(){const _0x5590ab=_0x2459ae;Window_HorzCommand[_0x5590ab(0x316)][_0x5590ab(0x4a4)][_0x5590ab(0x2ff)](this),this[_0x5590ab(0x469)]();},Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x3b3)]=function(){const _0x11fdf6=_0x2459ae,_0x1c12ff=this[_0x11fdf6(0x22f)](),_0x2abede=VisuMZ['ItemsEquipsCore'][_0x11fdf6(0x27d)][_0x11fdf6(0x37c)]['CmdIconBuy'],_0x496c95=_0x1c12ff==='text'?TextManager['buy']:'\x5cI[%1]%2'[_0x11fdf6(0x342)](_0x2abede,TextManager[_0x11fdf6(0x2ad)]),_0x17d303=this[_0x11fdf6(0x1fe)]();if(this['hideDisabledCommands']()&&!_0x17d303)return;this[_0x11fdf6(0x256)](_0x496c95,_0x11fdf6(0x2ad),_0x17d303);},Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x1fe)]=function(){const _0x1569f2=_0x2459ae;return SceneManager['_scene'][_0x1569f2(0x48e)]===Scene_Shop?SceneManager[_0x1569f2(0x415)]['_goodsCount']>0x0:!![];},Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x514)]=function(){const _0x367062=_0x2459ae,_0x45b985=this[_0x367062(0x22f)](),_0x128f89=VisuMZ[_0x367062(0x368)][_0x367062(0x27d)][_0x367062(0x37c)][_0x367062(0x4ca)],_0x419305=_0x45b985==='text'?TextManager[_0x367062(0x28e)]:'\x5cI[%1]%2'[_0x367062(0x342)](_0x128f89,TextManager[_0x367062(0x28e)]),_0x228868=this['isSellCommandEnabled']();if(this['hideDisabledCommands']()&&!_0x228868)return;this[_0x367062(0x256)](_0x419305,_0x367062(0x28e),_0x228868);},Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x4c2)]=function(){const _0x5ad203=_0x2459ae;return!this[_0x5ad203(0x3ab)];},Window_ShopCommand['prototype'][_0x2459ae(0x507)]=function(){const _0x1ca6c3=_0x2459ae,_0x144a0e=this[_0x1ca6c3(0x22f)](),_0xe99bc2=VisuMZ[_0x1ca6c3(0x368)][_0x1ca6c3(0x27d)]['ShopScene']['CmdIconCancel'],_0x3ed7f6=VisuMZ[_0x1ca6c3(0x368)][_0x1ca6c3(0x27d)]['ShopScene'][_0x1ca6c3(0x1ee)],_0x436a51=_0x144a0e===_0x1ca6c3(0x50f)?_0x3ed7f6:_0x1ca6c3(0x388)['format'](_0xe99bc2,_0x3ed7f6);this[_0x1ca6c3(0x256)](_0x436a51,'cancel');},Window_ShopCommand[_0x2459ae(0x316)]['itemTextAlign']=function(){const _0x572fef=_0x2459ae;return VisuMZ['ItemsEquipsCore'][_0x572fef(0x27d)][_0x572fef(0x37c)][_0x572fef(0x390)];},Window_ShopCommand['prototype']['drawItem']=function(_0x2245c2){const _0x1003e2=_0x2459ae,_0x581f86=this['commandStyleCheck'](_0x2245c2);if(_0x581f86==='iconText')this[_0x1003e2(0x2e0)](_0x2245c2);else _0x581f86===_0x1003e2(0x30d)?this[_0x1003e2(0x4d4)](_0x2245c2):Window_HorzCommand[_0x1003e2(0x316)][_0x1003e2(0x28b)][_0x1003e2(0x2ff)](this,_0x2245c2);},Window_ShopCommand[_0x2459ae(0x316)][_0x2459ae(0x22f)]=function(){const _0x16f5b3=_0x2459ae;return VisuMZ[_0x16f5b3(0x368)]['Settings'][_0x16f5b3(0x37c)][_0x16f5b3(0x4ab)];},Window_ShopCommand['prototype'][_0x2459ae(0x37b)]=function(_0x4be8a9){const _0xf72f69=_0x2459ae;if(_0x4be8a9<0x0)return _0xf72f69(0x50f);const _0x30526f=this[_0xf72f69(0x22f)]();if(_0x30526f!==_0xf72f69(0x357))return _0x30526f;else{if(this['maxItems']()>0x0){const _0x50e4e5=this[_0xf72f69(0x300)](_0x4be8a9);if(_0x50e4e5[_0xf72f69(0x455)](/\\I\[(\d+)\]/i)){const _0x1f8c7a=this[_0xf72f69(0x1e7)](_0x4be8a9),_0x549ede=this['textSizeEx'](_0x50e4e5)['width'];return _0x549ede<=_0x1f8c7a[_0xf72f69(0x2bf)]?_0xf72f69(0x2ce):'icon';}}}return _0xf72f69(0x50f);},Window_ShopCommand[_0x2459ae(0x316)]['drawItemStyleIconText']=function(_0x4d7783){const _0x5c3c50=_0x2459ae,_0x2f355e=this[_0x5c3c50(0x1e7)](_0x4d7783),_0x15bde9=this[_0x5c3c50(0x300)](_0x4d7783),_0x32b398=this[_0x5c3c50(0x3dc)](_0x15bde9)[_0x5c3c50(0x2bf)];this[_0x5c3c50(0x41f)](this[_0x5c3c50(0x50d)](_0x4d7783));const _0x53f415=this[_0x5c3c50(0x3e2)]();if(_0x53f415===_0x5c3c50(0x309))this['drawTextEx'](_0x15bde9,_0x2f355e['x']+_0x2f355e[_0x5c3c50(0x2bf)]-_0x32b398,_0x2f355e['y'],_0x32b398);else{if(_0x53f415===_0x5c3c50(0x245)){const _0x105315=_0x2f355e['x']+Math[_0x5c3c50(0x2d2)]((_0x2f355e['width']-_0x32b398)/0x2);this[_0x5c3c50(0x3e7)](_0x15bde9,_0x105315,_0x2f355e['y'],_0x32b398);}else this[_0x5c3c50(0x3e7)](_0x15bde9,_0x2f355e['x'],_0x2f355e['y'],_0x32b398);}},Window_ShopCommand['prototype'][_0x2459ae(0x4d4)]=function(_0x28159c){const _0x1583af=_0x2459ae;this[_0x1583af(0x300)](_0x28159c)['match'](/\\I\[(\d+)\]/i);const _0x1b6855=Number(RegExp['$1'])||0x0,_0x5884c0=this[_0x1583af(0x1e7)](_0x28159c),_0x261fad=_0x5884c0['x']+Math[_0x1583af(0x2d2)]((_0x5884c0[_0x1583af(0x2bf)]-ImageManager[_0x1583af(0x33e)])/0x2),_0x1f4b8d=_0x5884c0['y']+(_0x5884c0[_0x1583af(0x496)]-ImageManager[_0x1583af(0x3c4)])/0x2;this[_0x1583af(0x31e)](_0x1b6855,_0x261fad,_0x1f4b8d);},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x28a)]=Window_ShopBuy[_0x2459ae(0x316)]['refresh'],Window_ShopBuy[_0x2459ae(0x316)]['refresh']=function(){const _0xd32e02=_0x2459ae;this[_0xd32e02(0x462)](),VisuMZ['ItemsEquipsCore'][_0xd32e02(0x28a)][_0xd32e02(0x2ff)](this);},Window_ShopBuy['prototype']['updateMoneyAmount']=function(){const _0x4fc2a5=_0x2459ae;SceneManager[_0x4fc2a5(0x415)][_0x4fc2a5(0x48e)]===Scene_Shop&&(this[_0x4fc2a5(0x32f)]=SceneManager[_0x4fc2a5(0x415)][_0x4fc2a5(0x35d)]());},VisuMZ[_0x2459ae(0x368)][_0x2459ae(0x243)]=Window_ShopBuy[_0x2459ae(0x316)][_0x2459ae(0x22e)],Window_ShopBuy['prototype'][_0x2459ae(0x22e)]=function(_0x16f979){const _0x3b7566=_0x2459ae;if(!_0x16f979)return 0x0;const _0x2a3511=VisuMZ['ItemsEquipsCore'][_0x3b7566(0x243)][_0x3b7566(0x2ff)](this,_0x16f979);return this['modifiedBuyPriceItemsEquipsCore'](_0x16f979,_0x2a3511);},Window_ShopBuy[_0x2459ae(0x316)][_0x2459ae(0x3cb)]=function(_0x1551c1,_0x204966){const _0x340c7a=_0x2459ae,_0x1bf01a=_0x1551c1[_0x340c7a(0x321)];if(_0x1bf01a['match'](/<JS BUY PRICE>\s*([\s\S]*)\s*<\/JS BUY PRICE>/i)){const _0x424285=String(RegExp['$1']);try{eval(_0x424285);}catch(_0x178a5e){if($gameTemp[_0x340c7a(0x4f8)]())console[_0x340c7a(0x3df)](_0x178a5e);}}_0x204966=VisuMZ[_0x340c7a(0x368)][_0x340c7a(0x27d)]['ShopScene']['BuyPriceJS'][_0x340c7a(0x2ff)](this,_0x1551c1,_0x204966);if(isNaN(_0x204966))_0x204966=0x0;return Math[_0x340c7a(0x2d2)](_0x204966);},Window_ShopBuy[_0x2459ae(0x316)][_0x2459ae(0x28b)]=function(_0x57e8c0){const _0x96a2d8=_0x2459ae;this[_0x96a2d8(0x3b8)]();const _0x51751b=this[_0x96a2d8(0x249)](_0x57e8c0),_0x299cd6=this[_0x96a2d8(0x1e7)](_0x57e8c0),_0x21b374=_0x299cd6[_0x96a2d8(0x2bf)];this[_0x96a2d8(0x41f)](this[_0x96a2d8(0x414)](_0x51751b)),this[_0x96a2d8(0x34c)](_0x51751b,_0x299cd6['x'],_0x299cd6['y'],_0x21b374),this[_0x96a2d8(0x39b)](_0x51751b,_0x299cd6),this[_0x96a2d8(0x41f)](!![]);},Window_ShopBuy[_0x2459ae(0x316)][_0x2459ae(0x39b)]=function(_0x134e54,_0x316f78){const _0x2097da=_0x2459ae,_0x3bd558=this[_0x2097da(0x22e)](_0x134e54);this['drawCurrencyValue'](_0x3bd558,TextManager[_0x2097da(0x1ff)],_0x316f78['x'],_0x316f78['y'],_0x316f78[_0x2097da(0x2bf)]);},Window_ShopSell[_0x2459ae(0x316)][_0x2459ae(0x26a)]=function(){const _0x924778=_0x2459ae;return SceneManager[_0x924778(0x415)][_0x924778(0x1dc)]()?0x1:0x2;},VisuMZ['ItemsEquipsCore']['Window_ShopSell_isEnabled']=Window_ShopSell[_0x2459ae(0x316)][_0x2459ae(0x414)],Window_ShopSell['prototype']['isEnabled']=function(_0xa8797d){const _0xc83082=_0x2459ae;if(!_0xa8797d)return![];const _0x518d25=_0xa8797d['note'];if(_0x518d25[_0xc83082(0x455)](/<CANNOT SELL>/i))return![];if(_0x518d25[_0xc83082(0x455)](/<CAN SELL>/i))return!![];if(_0x518d25[_0xc83082(0x455)](/<CANNOT SELL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x2e9d3d=JSON['parse']('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x53840b of _0x2e9d3d){if(!$gameSwitches['value'](_0x53840b))return![];}}if(_0x518d25['match'](/<CANNOT SELL ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x5a1e6e=JSON[_0xc83082(0x4c0)]('['+RegExp['$1'][_0xc83082(0x455)](/\d+/g)+']');for(const _0x4f506b of _0x5a1e6e){if(!$gameSwitches[_0xc83082(0x441)](_0x4f506b))return![];}}if(_0x518d25[_0xc83082(0x455)](/<CANNOT SELL ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x27842b=JSON[_0xc83082(0x4c0)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x891502 of _0x27842b){if($gameSwitches[_0xc83082(0x441)](_0x891502))return![];}}return VisuMZ[_0xc83082(0x368)][_0xc83082(0x2d8)][_0xc83082(0x2ff)](this,_0xa8797d);},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x292)]=function(){return![];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x344)]=function(){const _0x25f725=_0x2459ae;Window_StatusBase[_0x25f725(0x316)][_0x25f725(0x344)][_0x25f725(0x2ff)](this);for(const _0x48a05a of $gameParty[_0x25f725(0x3cf)]()){ImageManager[_0x25f725(0x509)](_0x48a05a['characterName']());}},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x47a)]=function(){const _0xf3a920=_0x2459ae;return VisuMZ[_0xf3a920(0x368)][_0xf3a920(0x27d)][_0xf3a920(0x3e8)]['Translucent'];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x4a4)]=function(){const _0x5b5c4b=_0x2459ae;this[_0x5b5c4b(0x4ad)][_0x5b5c4b(0x2a2)](),this[_0x5b5c4b(0x28d)][_0x5b5c4b(0x2a2)](),this[_0x5b5c4b(0x334)]&&(this['resetFontSettings'](),this[_0x5b5c4b(0x41f)](!![]),this[_0x5b5c4b(0x2e7)](),this[_0x5b5c4b(0x1d6)]()?this['drawEquipData']():this[_0x5b5c4b(0x468)]());},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x201)]=function(_0x4c54c2,_0x2b7f54){const _0x47c1c8=_0x2459ae;if(!this[_0x47c1c8(0x1d6)]()&&!DataManager[_0x47c1c8(0x3c0)](this['_item']))return;const _0x12d3bf=this[_0x47c1c8(0x4dd)]-this['itemPadding']()-_0x4c54c2,_0x6160c7=this[_0x47c1c8(0x206)]('0000');this[_0x47c1c8(0x37e)](ColorManager[_0x47c1c8(0x27a)]()),this[_0x47c1c8(0x262)](TextManager[_0x47c1c8(0x44d)],_0x4c54c2+this[_0x47c1c8(0x40e)](),_0x2b7f54,_0x12d3bf-_0x6160c7),this[_0x47c1c8(0x366)](),this[_0x47c1c8(0x28f)](this[_0x47c1c8(0x334)],_0x4c54c2,_0x2b7f54,_0x12d3bf);},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x290)]=function(_0x60573b,_0x4fcbf5,_0x120dfc,_0x41d95d,_0x5a6d33){const _0x379ddf=_0x2459ae;if(VisuMZ[_0x379ddf(0x368)][_0x379ddf(0x27d)][_0x379ddf(0x3e8)][_0x379ddf(0x42b)]===![])return;_0x5a6d33=Math[_0x379ddf(0x2c4)](_0x5a6d33||0x1,0x1);while(_0x5a6d33--){_0x41d95d=_0x41d95d||this[_0x379ddf(0x1f1)](),this[_0x379ddf(0x28d)]['paintOpacity']=0xa0;const _0x269965=ColorManager[_0x379ddf(0x3e9)]();this[_0x379ddf(0x28d)][_0x379ddf(0x4ef)](_0x60573b+0x1,_0x4fcbf5+0x1,_0x120dfc-0x2,_0x41d95d-0x2,_0x269965),this[_0x379ddf(0x28d)]['paintOpacity']=0xff;}},ColorManager[_0x2459ae(0x3e9)]=function(){const _0x4ef712=_0x2459ae,_0x166f14=VisuMZ[_0x4ef712(0x368)][_0x4ef712(0x27d)][_0x4ef712(0x3e8)];let _0x2ff777=_0x166f14[_0x4ef712(0x242)]!==undefined?_0x166f14[_0x4ef712(0x242)]:0x13;return ColorManager['getColor'](_0x2ff777);},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x312)]=function(){const _0x483984=_0x2459ae;VisuMZ[_0x483984(0x368)][_0x483984(0x27d)][_0x483984(0x3e8)]['DrawEquipData'][_0x483984(0x2ff)](this);},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x3d9)]=function(_0x1ecfc5,_0x50f266,_0x3904a5){const _0x599b56=_0x2459ae;if(!this[_0x599b56(0x1d6)]())return![];const _0x4585f5=$dataSystem[_0x599b56(0x375)][this['_item'][_0x599b56(0x41b)]];return this[_0x599b56(0x3d1)](_0x4585f5,_0x1ecfc5,_0x50f266,_0x3904a5,!![]),this['drawItemDarkRect'](_0x1ecfc5,_0x50f266,_0x3904a5),this[_0x599b56(0x3b8)](),!![];},Window_ShopStatus['prototype'][_0x2459ae(0x4b2)]=function(){const _0x10a2a7=_0x2459ae,_0x41dbb2=VisuMZ[_0x10a2a7(0x368)][_0x10a2a7(0x27d)]['ItemScene']['ItemQuantityFmt'];return _0x41dbb2[_0x10a2a7(0x342)]($gameParty[_0x10a2a7(0x30a)](this[_0x10a2a7(0x334)]));},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x470)]=function(){const _0x1a552e=_0x2459ae;return Imported[_0x1a552e(0x222)]?VisuMZ[_0x1a552e(0x442)]['Settings'][_0x1a552e(0x4c8)][_0x1a552e(0x4b7)]:[0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7];},Window_ShopStatus['prototype'][_0x2459ae(0x45c)]=function(){const _0x5a258a=_0x2459ae;return VisuMZ[_0x5a258a(0x368)]['Settings'][_0x5a258a(0x3e8)][_0x5a258a(0x446)];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x46d)]=function(_0x27907f,_0x17b2ec,_0x273d55,_0x3db7a9){const _0x3961ff=_0x2459ae;this[_0x3961ff(0x3b8)](),this[_0x3961ff(0x4ad)][_0x3961ff(0x500)]=this[_0x3961ff(0x45c)]();let _0x1527c1=this[_0x3961ff(0x206)](TextManager[_0x3961ff(0x33d)](_0x27907f))+0x4+_0x17b2ec;return Imported['VisuMZ_0_CoreEngine']?(this[_0x3961ff(0x29a)](_0x17b2ec,_0x273d55,_0x3db7a9,_0x27907f,!![]),VisuMZ[_0x3961ff(0x442)]['Settings'][_0x3961ff(0x4c8)][_0x3961ff(0x1d3)]&&(_0x1527c1+=ImageManager['iconWidth']+0x4)):(this[_0x3961ff(0x37e)](ColorManager['systemColor']()),this[_0x3961ff(0x262)](TextManager[_0x3961ff(0x33d)](_0x27907f),_0x17b2ec,_0x273d55,_0x3db7a9)),this[_0x3961ff(0x3b8)](),_0x1527c1;},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x351)]=function(_0x4f3db5,_0xdb9906,_0x56885d,_0x4efd66,_0x2945e0){const _0x1fa59b=_0x2459ae;_0x56885d+=this[_0x1fa59b(0x40e)](),_0x2945e0-=this[_0x1fa59b(0x40e)]()*0x2;const _0x4deb0b=VisuMZ[_0x1fa59b(0x368)][_0x1fa59b(0x27d)]['StatusWindow'];this[_0x1fa59b(0x4ad)][_0x1fa59b(0x500)]=_0x4deb0b['ParamChangeFontSize'],this[_0x1fa59b(0x41f)](_0x4f3db5['canEquip'](this[_0x1fa59b(0x334)]));if(_0x4f3db5['isEquipped'](this['_item'])){const _0x480314=_0x4deb0b[_0x1fa59b(0x23a)];this[_0x1fa59b(0x262)](_0x480314,_0x56885d,_0x4efd66,_0x2945e0,_0x1fa59b(0x245));}else{if(_0x4f3db5['canEquip'](this[_0x1fa59b(0x334)])){const _0x50f0cd=this[_0x1fa59b(0x3bb)](_0x4f3db5,this['_item'][_0x1fa59b(0x41b)]),_0x59759f=JsonEx['makeDeepCopy'](_0x4f3db5);_0x59759f[_0x1fa59b(0x29d)]=!![];const _0x56f376=_0x59759f[_0x1fa59b(0x440)]()['indexOf'](this[_0x1fa59b(0x334)][_0x1fa59b(0x41b)]);if(_0x56f376>=0x0)_0x59759f[_0x1fa59b(0x475)](_0x56f376,this[_0x1fa59b(0x334)]);let _0x4f5ee5=0x0,_0x5f3531=0x0,_0x5f4dc6=0x0;Imported[_0x1fa59b(0x222)]?(_0x4f5ee5=_0x59759f[_0x1fa59b(0x2c0)](_0xdb9906),_0x5f3531=_0x4f5ee5-_0x4f3db5[_0x1fa59b(0x2c0)](_0xdb9906),this[_0x1fa59b(0x37e)](ColorManager[_0x1fa59b(0x25d)](_0x5f3531)),_0x5f4dc6=(_0x5f3531>=0x0?'+':'')+VisuMZ[_0x1fa59b(0x407)](_0x5f3531,0x0,_0xdb9906)):(_0x4f5ee5=_0x59759f[_0x1fa59b(0x33d)](_0xdb9906),_0x5f3531=_0x4f5ee5-_0x4f3db5[_0x1fa59b(0x33d)](_0xdb9906),this[_0x1fa59b(0x37e)](ColorManager[_0x1fa59b(0x25d)](_0x5f3531)),_0x5f4dc6=(_0x5f3531>=0x0?'+':'')+_0x5f3531);if(_0x5f4dc6==='+0')_0x5f4dc6=_0x4deb0b[_0x1fa59b(0x4f0)];this['drawText'](_0x5f4dc6,_0x56885d,_0x4efd66,_0x2945e0,_0x1fa59b(0x245));}else{const _0x3cc56a=_0x4deb0b[_0x1fa59b(0x4c6)];this[_0x1fa59b(0x262)](_0x3cc56a,_0x56885d,_0x4efd66,_0x2945e0,'center');}}this[_0x1fa59b(0x3b8)](),this[_0x1fa59b(0x41f)](!![]);},Window_ShopStatus[_0x2459ae(0x316)]['drawItemData']=function(){const _0x175d85=_0x2459ae;VisuMZ[_0x175d85(0x368)][_0x175d85(0x27d)][_0x175d85(0x3e8)][_0x175d85(0x382)][_0x175d85(0x2ff)](this);},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x2e7)]=function(){const _0x151350=_0x2459ae;this[_0x151350(0x396)]={};if(!this['_item'])return;const _0xff25b7=this[_0x151350(0x334)][_0x151350(0x321)];if(_0xff25b7['match'](/<STATUS INFO>\s*([\s\S]*)\s*<\/STATUS INFO>/i)){const _0x283dca=String(RegExp['$1'])['split'](/[\r\n]+/);for(const _0x5d1e6e of _0x283dca){if(_0x5d1e6e[_0x151350(0x455)](/(.*):[ ](.*)/i)){const _0x33d2e8=String(RegExp['$1'])['toUpperCase']()[_0x151350(0x264)](),_0x161cd6=String(RegExp['$2'])[_0x151350(0x264)]();this[_0x151350(0x396)][_0x33d2e8]=_0x161cd6;}}}},Window_ShopStatus[_0x2459ae(0x316)]['itemDataFontSize']=function(){const _0x42ca5a=_0x2459ae;return Math[_0x42ca5a(0x2c4)](0x1,$gameSystem[_0x42ca5a(0x477)]()-0x4);},Window_ShopStatus[_0x2459ae(0x316)]['resetFontSettings']=function(){const _0x45e38b=_0x2459ae;Window_StatusBase[_0x45e38b(0x316)][_0x45e38b(0x3b8)]['call'](this),this[_0x45e38b(0x4ad)][_0x45e38b(0x500)]=this[_0x45e38b(0x3dd)]||this[_0x45e38b(0x4ad)][_0x45e38b(0x500)],this[_0x45e38b(0x4ad)][_0x45e38b(0x1fb)]=this[_0x45e38b(0x354)]||this[_0x45e38b(0x4ad)][_0x45e38b(0x1fb)];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x3f4)]=function(){const _0x6b876b=_0x2459ae;return this[_0x6b876b(0x4ad)][_0x6b876b(0x500)]/$gameSystem['mainFontSize']();},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x31e)]=function(_0x443115,_0x35343b,_0x251100){const _0x5a21da=_0x2459ae,_0x415972=ImageManager[_0x5a21da(0x49e)](_0x5a21da(0x3cc)),_0xc94eec=ImageManager[_0x5a21da(0x33e)],_0x36cc6d=ImageManager[_0x5a21da(0x3c4)],_0x500553=_0x443115%0x10*_0xc94eec,_0x164e45=Math['floor'](_0x443115/0x10)*_0x36cc6d,_0x2e84da=Math[_0x5a21da(0x2a4)](_0xc94eec*this[_0x5a21da(0x3f4)]()),_0x34c762=Math[_0x5a21da(0x2a4)](_0x36cc6d*this['fontSizeRatio']());this[_0x5a21da(0x4ad)][_0x5a21da(0x3e3)](_0x415972,_0x500553,_0x164e45,_0xc94eec,_0x36cc6d,_0x35343b,_0x251100,_0x2e84da,_0x34c762);},Window_ShopStatus['prototype'][_0x2459ae(0x4a6)]=function(_0x133fad,_0x94e85f){const _0x7ece89=_0x2459ae;_0x94e85f['drawing']&&this[_0x7ece89(0x31e)](_0x133fad,_0x94e85f['x'],_0x94e85f['y']+0x2);_0x94e85f['x']+=Math[_0x7ece89(0x2a4)](ImageManager[_0x7ece89(0x33e)]*this['fontSizeRatio']());if(this[_0x7ece89(0x3f4)]()===0x1)_0x94e85f['x']+=0x4;},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x3d1)]=function(_0xc37464,_0x5ce7a7,_0x17ef34,_0x4d2efa,_0x5451c0,_0x59140f){const _0x1b5110=_0x2459ae;_0xc37464=_0xc37464||'',_0x59140f=_0x59140f||_0x1b5110(0x29f),this['_resetFontSize']=this['itemDataFontSize'](),this[_0x1b5110(0x354)]=_0x5451c0?ColorManager[_0x1b5110(0x27a)]():this[_0x1b5110(0x4ad)][_0x1b5110(0x1fb)],_0x5ce7a7+=this[_0x1b5110(0x40e)](),_0x4d2efa-=this['itemPadding']()*0x2;const _0x5439af=this[_0x1b5110(0x3dc)](_0xc37464);if(_0x59140f===_0x1b5110(0x245))_0x5ce7a7=_0x5ce7a7+Math[_0x1b5110(0x2d2)]((_0x4d2efa-_0x5439af[_0x1b5110(0x2bf)])/0x2);else _0x59140f==='right'&&(_0x5ce7a7=_0x5ce7a7+_0x4d2efa-_0x5439af[_0x1b5110(0x2bf)]);_0x17ef34+=(this[_0x1b5110(0x1f1)]()-_0x5439af[_0x1b5110(0x496)])/0x2,this[_0x1b5110(0x3e7)](_0xc37464,_0x5ce7a7,_0x17ef34,_0x4d2efa),this[_0x1b5110(0x3dd)]=undefined,this[_0x1b5110(0x354)]=undefined,this[_0x1b5110(0x3b8)]();},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x3e1)]=function(_0x1586f8,_0x4f1e63,_0x50616e){const _0x4dccdb=_0x2459ae;if(!DataManager[_0x4dccdb(0x3c0)](this['_item']))return![];const _0x539bf1=this['getItemConsumableLabel']();this[_0x4dccdb(0x3d1)](_0x539bf1,_0x1586f8,_0x4f1e63,_0x50616e,!![]);const _0x592ccd=this[_0x4dccdb(0x225)]();return this[_0x4dccdb(0x3d1)](_0x592ccd,_0x1586f8,_0x4f1e63,_0x50616e,![],_0x4dccdb(0x309)),this['drawItemDarkRect'](_0x1586f8,_0x4f1e63,_0x50616e),this['resetFontSettings'](),!![];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x2f5)]=function(){const _0x28da2c=_0x2459ae;return VisuMZ[_0x28da2c(0x368)]['Settings'][_0x28da2c(0x3e8)]['LabelConsume'];},Window_ShopStatus['prototype'][_0x2459ae(0x225)]=function(){const _0x40e652=_0x2459ae,_0x3c5b12=_0x40e652(0x4da);if(this['_customItemInfo'][_0x3c5b12])return this[_0x40e652(0x396)][_0x3c5b12];return this['canConsumeItem']()?VisuMZ[_0x40e652(0x368)][_0x40e652(0x27d)][_0x40e652(0x3e8)][_0x40e652(0x2f9)]:VisuMZ[_0x40e652(0x368)][_0x40e652(0x27d)][_0x40e652(0x3e8)]['NotConsumable'];},Window_ShopStatus['prototype'][_0x2459ae(0x50a)]=function(){const _0x31ddb0=_0x2459ae;return VisuMZ[_0x31ddb0(0x442)]&&VisuMZ[_0x31ddb0(0x442)][_0x31ddb0(0x27d)][_0x31ddb0(0x3b7)][_0x31ddb0(0x4ec)]&&DataManager['isKeyItem'](this[_0x31ddb0(0x334)])?![]:this['_item'][_0x31ddb0(0x479)];},Window_ShopStatus[_0x2459ae(0x316)]['drawItemQuantity']=function(_0x25d77f,_0x232202,_0xb791fc){const _0x4bdc06=_0x2459ae;if(!this[_0x4bdc06(0x1d6)]()&&!DataManager[_0x4bdc06(0x3c0)](this[_0x4bdc06(0x334)]))return![];if(DataManager[_0x4bdc06(0x340)](this[_0x4bdc06(0x334)])&&!$dataSystem[_0x4bdc06(0x2d4)]){const _0x2e2a54=TextManager[_0x4bdc06(0x2a5)];this[_0x4bdc06(0x3d1)](_0x2e2a54,_0x25d77f,_0x232202,_0xb791fc,!![],_0x4bdc06(0x245));}else{const _0x308116=TextManager['possession'];this['drawItemKeyData'](_0x308116,_0x25d77f,_0x232202,_0xb791fc,!![]);const _0x334686=this['getItemQuantityText']();this['drawItemKeyData'](_0x334686,_0x25d77f,_0x232202,_0xb791fc,![],_0x4bdc06(0x309));}return this['drawItemDarkRect'](_0x25d77f,_0x232202,_0xb791fc),this[_0x4bdc06(0x3b8)](),!![];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x4b2)]=function(){const _0x495da8=_0x2459ae,_0x50c58f=_0x495da8(0x2e5);if(this[_0x495da8(0x396)][_0x50c58f])return this[_0x495da8(0x396)][_0x50c58f];const _0x530a53=VisuMZ[_0x495da8(0x368)][_0x495da8(0x27d)]['ItemScene'][_0x495da8(0x22a)];return _0x530a53['format']($gameParty[_0x495da8(0x30a)](this[_0x495da8(0x334)]));},Window_ShopStatus['prototype']['drawItemOccasion']=function(_0xd09896,_0x575dc9,_0x3ae751){const _0x33d40d=_0x2459ae,_0x240296=this['getItemOccasionText']();return this[_0x33d40d(0x3d1)](_0x240296,_0xd09896,_0x575dc9,_0x3ae751,![],_0x33d40d(0x245)),this[_0x33d40d(0x290)](_0xd09896,_0x575dc9,_0x3ae751),this[_0x33d40d(0x3b8)](),!![];},Window_ShopStatus[_0x2459ae(0x316)]['getItemOccasionText']=function(){const _0x5acc40=_0x2459ae,_0x1fe911='OCCASION';if(this[_0x5acc40(0x396)][_0x1fe911])return this[_0x5acc40(0x396)][_0x1fe911];const _0x52545f=VisuMZ[_0x5acc40(0x368)][_0x5acc40(0x27d)][_0x5acc40(0x3e8)],_0x25690='Occasion%1'['format'](this['_item']['occasion']);return _0x52545f[_0x25690];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x2b8)]=function(_0x42575a,_0x159cc6,_0x3e1ed0){const _0x14611a=_0x2459ae,_0x49c0d8=this['getItemScopeText']();return this['drawItemKeyData'](_0x49c0d8,_0x42575a,_0x159cc6,_0x3e1ed0,![],_0x14611a(0x245)),this[_0x14611a(0x290)](_0x42575a,_0x159cc6,_0x3e1ed0),this['resetFontSettings'](),!![];},Window_ShopStatus[_0x2459ae(0x316)]['getItemScopeText']=function(){const _0x3ca87a=_0x2459ae,_0x2cfad2=_0x3ca87a(0x516);if(this[_0x3ca87a(0x396)][_0x2cfad2])return this[_0x3ca87a(0x396)][_0x2cfad2];const _0x4f8bb7=VisuMZ['ItemsEquipsCore'][_0x3ca87a(0x27d)][_0x3ca87a(0x3e8)];if(Imported[_0x3ca87a(0x4f6)]){const _0x379131=this['_item'][_0x3ca87a(0x321)];if(_0x379131[_0x3ca87a(0x455)](/<TARGET:[ ](.*)>/i)){const _0x3bde50=String(RegExp['$1']);if(_0x3bde50[_0x3ca87a(0x455)](/(\d+) RANDOM ANY/i))return _0x4f8bb7[_0x3ca87a(0x356)][_0x3ca87a(0x342)](Number(RegExp['$1']));else{if(_0x3bde50[_0x3ca87a(0x455)](/(\d+) RANDOM (?:ENEMY|ENEMIES|FOE|FOES)/i))return _0x4f8bb7[_0x3ca87a(0x21c)]['format'](Number(RegExp['$1']));else{if(_0x3bde50[_0x3ca87a(0x455)](/(\d+) RANDOM (?:ALLY|ALLIES|FRIEND|FRIENDS)/i))return _0x4f8bb7[_0x3ca87a(0x295)][_0x3ca87a(0x342)](Number(RegExp['$1']));else{if(_0x3bde50[_0x3ca87a(0x455)](/ALL (?:ALLY|ALLIES|FRIEND|FRIENDS) (?:BUT|EXCEPT) (?:USER|SELF)/i))return _0x4f8bb7[_0x3ca87a(0x1f9)];}}}}}const _0x52e605=_0x3ca87a(0x2f6)['format'](this[_0x3ca87a(0x334)][_0x3ca87a(0x20b)]);return _0x4f8bb7[_0x52e605];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x44f)]=function(_0x3b9c69,_0xa85a40,_0x54cd6e){const _0x29d068=_0x2459ae,_0x170eb3=this[_0x29d068(0x240)]();this[_0x29d068(0x3d1)](_0x170eb3,_0x3b9c69,_0xa85a40,_0x54cd6e,!![]);const _0x59b5a4=this['getItemSpeedText']();return this[_0x29d068(0x3d1)](_0x59b5a4,_0x3b9c69,_0xa85a40,_0x54cd6e,![],'right'),this['drawItemDarkRect'](_0x3b9c69,_0xa85a40,_0x54cd6e),this['resetFontSettings'](),!![];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x240)]=function(){const _0x5b4862=_0x2459ae;return VisuMZ['ItemsEquipsCore'][_0x5b4862(0x27d)][_0x5b4862(0x3e8)][_0x5b4862(0x3e6)];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x299)]=function(){const _0x5ecf04=_0x2459ae,_0xf02a53=_0x5ecf04(0x377);if(this[_0x5ecf04(0x396)][_0xf02a53])return this[_0x5ecf04(0x396)][_0xf02a53];const _0x415eba=this[_0x5ecf04(0x334)][_0x5ecf04(0x2fd)];if(_0x415eba>=0x7d0)return VisuMZ['ItemsEquipsCore'][_0x5ecf04(0x27d)]['StatusWindow'][_0x5ecf04(0x404)];else{if(_0x415eba>=0x3e8)return VisuMZ[_0x5ecf04(0x368)][_0x5ecf04(0x27d)][_0x5ecf04(0x3e8)]['Speed1000'];else{if(_0x415eba>0x0)return VisuMZ[_0x5ecf04(0x368)][_0x5ecf04(0x27d)]['StatusWindow'][_0x5ecf04(0x2a7)];else{if(_0x415eba===0x0)return VisuMZ[_0x5ecf04(0x368)]['Settings'][_0x5ecf04(0x3e8)][_0x5ecf04(0x50c)];else{if(_0x415eba>-0x3e8)return VisuMZ[_0x5ecf04(0x368)][_0x5ecf04(0x27d)][_0x5ecf04(0x3e8)][_0x5ecf04(0x202)];else{if(_0x415eba>-0x7d0)return VisuMZ[_0x5ecf04(0x368)]['Settings'][_0x5ecf04(0x3e8)][_0x5ecf04(0x454)];else return _0x415eba<=-0x7d0?VisuMZ[_0x5ecf04(0x368)][_0x5ecf04(0x27d)][_0x5ecf04(0x3e8)][_0x5ecf04(0x2de)]:_0x5ecf04(0x378);}}}}}},Window_ShopStatus[_0x2459ae(0x316)]['drawItemSuccessRate']=function(_0x36e618,_0x44d592,_0x671ca4){const _0x392d8c=_0x2459ae,_0x1e77f5=this['getItemSuccessRateLabel']();this[_0x392d8c(0x3d1)](_0x1e77f5,_0x36e618,_0x44d592,_0x671ca4,!![]);const _0x50cfbf=this['getItemSuccessRateText']();return this[_0x392d8c(0x3d1)](_0x50cfbf,_0x36e618,_0x44d592,_0x671ca4,![],'right'),this[_0x392d8c(0x290)](_0x36e618,_0x44d592,_0x671ca4),this['resetFontSettings'](),!![];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x2b3)]=function(){const _0x3d6351=_0x2459ae;return VisuMZ['ItemsEquipsCore'][_0x3d6351(0x27d)][_0x3d6351(0x3e8)][_0x3d6351(0x4ff)];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x370)]=function(){const _0x329ec5=_0x2459ae,_0x2e38d0=_0x329ec5(0x34d);if(this[_0x329ec5(0x396)][_0x2e38d0])return this[_0x329ec5(0x396)][_0x2e38d0];if(Imported[_0x329ec5(0x4f6)]){const _0x2de7c9=this[_0x329ec5(0x334)][_0x329ec5(0x321)];if(_0x2de7c9['match'](/<ALWAYS HIT>/i))return'100%';else{if(_0x2de7c9['match'](/<ALWAYS HIT RATE: (\d+)([%％])>/i))return _0x329ec5(0x229)[_0x329ec5(0x342)](Number(RegExp['$1']));}}return _0x329ec5(0x229)[_0x329ec5(0x342)](this[_0x329ec5(0x334)][_0x329ec5(0x513)]);},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x4e7)]=function(_0x5a9502,_0x12545c,_0x487c85){const _0x151fad=_0x2459ae,_0x493e16=this[_0x151fad(0x3f0)]();this[_0x151fad(0x3d1)](_0x493e16,_0x5a9502,_0x12545c,_0x487c85,!![]);const _0x433739=this[_0x151fad(0x219)]();return this['drawItemKeyData'](_0x433739,_0x5a9502,_0x12545c,_0x487c85,![],_0x151fad(0x309)),this['drawItemDarkRect'](_0x5a9502,_0x12545c,_0x487c85),this[_0x151fad(0x3b8)](),!![];},Window_ShopStatus[_0x2459ae(0x316)]['getItemRepeatsLabel']=function(){const _0x1fea7a=_0x2459ae;return VisuMZ[_0x1fea7a(0x368)]['Settings'][_0x1fea7a(0x3e8)][_0x1fea7a(0x401)];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x219)]=function(){const _0x2deb7c=_0x2459ae,_0x11bdea=_0x2deb7c(0x2bc);if(this[_0x2deb7c(0x396)][_0x11bdea])return this[_0x2deb7c(0x396)][_0x11bdea];const _0x3e3dd3=_0x2deb7c(0x259);return _0x3e3dd3[_0x2deb7c(0x342)](this[_0x2deb7c(0x334)][_0x2deb7c(0x2eb)]);},Window_ShopStatus[_0x2459ae(0x316)]['drawItemHitType']=function(_0xbb79c2,_0x2f0a2f,_0x361d8c){const _0xc8e0f8=_0x2459ae,_0x465fff=this[_0xc8e0f8(0x489)]();this['drawItemKeyData'](_0x465fff,_0xbb79c2,_0x2f0a2f,_0x361d8c,!![]);const _0x490c2d=this[_0xc8e0f8(0x48f)]();return this['drawItemKeyData'](_0x490c2d,_0xbb79c2,_0x2f0a2f,_0x361d8c,![],_0xc8e0f8(0x309)),this['drawItemDarkRect'](_0xbb79c2,_0x2f0a2f,_0x361d8c),this[_0xc8e0f8(0x3b8)](),!![];},Window_ShopStatus[_0x2459ae(0x316)]['getItemHitTypeLabel']=function(){const _0x175d05=_0x2459ae;return VisuMZ[_0x175d05(0x368)]['Settings'][_0x175d05(0x3e8)]['LabelHitType'];},Window_ShopStatus['prototype'][_0x2459ae(0x48f)]=function(){const _0x37b169=_0x2459ae,_0x1f41d7=_0x37b169(0x2d1);if(this['_customItemInfo'][_0x1f41d7])return this['_customItemInfo'][_0x1f41d7];const _0x30f801=VisuMZ[_0x37b169(0x368)][_0x37b169(0x27d)][_0x37b169(0x3e8)],_0x3a811e=_0x37b169(0x2a9)['format'](this[_0x37b169(0x334)][_0x37b169(0x1de)]);return _0x30f801[_0x3a811e];},Window_ShopStatus[_0x2459ae(0x316)]['drawItemDamage']=function(_0x312463,_0x369d72,_0xddd075){const _0x327aea=_0x2459ae;if(this[_0x327aea(0x334)][_0x327aea(0x220)]['type']<=0x0)return _0x369d72;if(this['drawItemDamageElement'](_0x312463,_0x369d72,_0xddd075))_0x369d72+=this[_0x327aea(0x1f1)]();if(this[_0x327aea(0x389)](_0x312463,_0x369d72,_0xddd075))_0x369d72+=this[_0x327aea(0x1f1)]();return this[_0x327aea(0x3b8)](),_0x369d72;},Window_ShopStatus[_0x2459ae(0x316)]['drawItemDamageElement']=function(_0x1e3c1c,_0x2c2a5e,_0x1cc563){const _0x2b07a4=_0x2459ae,_0x58de37=this[_0x2b07a4(0x21f)]();this[_0x2b07a4(0x3d1)](_0x58de37,_0x1e3c1c,_0x2c2a5e,_0x1cc563,!![]);const _0x463786=this['getItemDamageElementText']();return this[_0x2b07a4(0x3d1)](_0x463786,_0x1e3c1c,_0x2c2a5e,_0x1cc563,![],_0x2b07a4(0x309)),this[_0x2b07a4(0x290)](_0x1e3c1c,_0x2c2a5e,_0x1cc563),this['resetFontSettings'](),!![];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x21f)]=function(){const _0x219070=_0x2459ae;return VisuMZ['ItemsEquipsCore'][_0x219070(0x27d)][_0x219070(0x3e8)]['LabelElement'];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x3f8)]=function(){const _0x62f2ee=_0x2459ae,_0x510d0c='ELEMENT';if(this[_0x62f2ee(0x396)][_0x510d0c])return this[_0x62f2ee(0x396)][_0x510d0c];if(this[_0x62f2ee(0x334)][_0x62f2ee(0x220)][_0x62f2ee(0x4f2)]<=-0x1)return VisuMZ['ItemsEquipsCore'][_0x62f2ee(0x27d)]['StatusWindow']['ElementWeapon'];else return this['_item'][_0x62f2ee(0x220)][_0x62f2ee(0x4f2)]===0x0?VisuMZ[_0x62f2ee(0x368)]['Settings'][_0x62f2ee(0x3e8)][_0x62f2ee(0x4a1)]:$dataSystem[_0x62f2ee(0x212)][this[_0x62f2ee(0x334)]['damage'][_0x62f2ee(0x4f2)]];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x389)]=function(_0x342213,_0x4cf85b,_0x5cdfd9){const _0x54f778=_0x2459ae,_0x2d4c89=this[_0x54f778(0x43c)]();this[_0x54f778(0x3d1)](_0x2d4c89,_0x342213,_0x4cf85b,_0x5cdfd9,!![]),this[_0x54f778(0x403)]();const _0x5bf5d1=this[_0x54f778(0x48d)](),_0x5d2ebe=ColorManager[_0x54f778(0x4cc)]([0x0,0x0,0x2,0x1,0x3,0x1,0x3][this[_0x54f778(0x334)]['damage'][_0x54f778(0x20a)]]);return this[_0x54f778(0x37e)](_0x5d2ebe),this[_0x54f778(0x3d1)](_0x5bf5d1,_0x342213,_0x4cf85b,_0x5cdfd9,![],_0x54f778(0x309)),this[_0x54f778(0x290)](_0x342213,_0x4cf85b,_0x5cdfd9),this[_0x54f778(0x3b8)](),!![];},Window_ShopStatus['prototype'][_0x2459ae(0x43c)]=function(){const _0x2dacfe=_0x2459ae;return Imported[_0x2dacfe(0x4f6)]&&DataManager[_0x2dacfe(0x2db)](this[_0x2dacfe(0x334)])!==_0x2dacfe(0x35a)?this[_0x2dacfe(0x3ba)]():this[_0x2dacfe(0x27b)]();},Window_ShopStatus['prototype']['getItemDamageAmountLabelOriginal']=function(){const _0x3ebab5=_0x2459ae,_0x13a204=VisuMZ[_0x3ebab5(0x368)][_0x3ebab5(0x27d)][_0x3ebab5(0x3e8)],_0x4331ce='DamageType%1'[_0x3ebab5(0x342)](this[_0x3ebab5(0x334)]['damage'][_0x3ebab5(0x20a)]),_0x1bcd20=[null,TextManager['hp'],TextManager['mp'],TextManager['hp'],TextManager['mp'],TextManager['hp'],TextManager['mp']][this[_0x3ebab5(0x334)][_0x3ebab5(0x220)]['type']];return _0x13a204[_0x4331ce][_0x3ebab5(0x342)](_0x1bcd20);},Window_ShopStatus[_0x2459ae(0x316)]['setupItemDamageTempActors']=function(){const _0x409d0d=_0x2459ae,_0x4b67fb=$gameActors[_0x409d0d(0x39d)](0x1);this[_0x409d0d(0x2df)]=JsonEx[_0x409d0d(0x332)](_0x4b67fb),this[_0x409d0d(0x4bb)]=JsonEx[_0x409d0d(0x332)](_0x4b67fb);},Window_ShopStatus[_0x2459ae(0x316)]['getItemDamageAmountText']=function(){const _0x5e932d=_0x2459ae,_0x4a0da8='DAMAGE\x20MULTIPLIER';if(this[_0x5e932d(0x396)][_0x4a0da8])return this[_0x5e932d(0x396)][_0x4a0da8];return Imported[_0x5e932d(0x4f6)]&&DataManager[_0x5e932d(0x2db)](this[_0x5e932d(0x334)])!==_0x5e932d(0x35a)?this[_0x5e932d(0x1d5)]():this[_0x5e932d(0x44c)]();},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x44c)]=function(){const _0x11ec72=_0x2459ae;window['a']=this[_0x11ec72(0x2df)],window['b']=this[_0x11ec72(0x4bb)],this[_0x11ec72(0x2df)][_0x11ec72(0x38e)](!![]),this[_0x11ec72(0x4bb)][_0x11ec72(0x38e)]([0x3,0x4][_0x11ec72(0x308)](this[_0x11ec72(0x334)]['damage']['type']));let _0x66a38c=this[_0x11ec72(0x334)][_0x11ec72(0x220)][_0x11ec72(0x35c)];try{const _0x71e946=Math[_0x11ec72(0x2c4)](eval(_0x66a38c),0x0)/window['a']['atk'];return this[_0x11ec72(0x30f)](),isNaN(_0x71e946)?_0x11ec72(0x378):_0x11ec72(0x229)['format'](Math[_0x11ec72(0x343)](_0x71e946*0x64));}catch(_0x5577d1){return $gameTemp['isPlaytest']()&&(console[_0x11ec72(0x3df)](_0x11ec72(0x31d)[_0x11ec72(0x342)](this['_item'][_0x11ec72(0x478)])),console[_0x11ec72(0x3df)](_0x5577d1)),this[_0x11ec72(0x30f)](),_0x11ec72(0x378);}},Window_ShopStatus[_0x2459ae(0x316)]['revertGlobalNamespaceVariables']=function(){window['a']=undefined,window['b']=undefined;},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x3ac)]=function(_0x18ef35,_0x41ca57,_0x13bfba){const _0xa70c64=_0x2459ae;if(!this[_0xa70c64(0x4b8)]())return _0x41ca57;if(this[_0xa70c64(0x200)](_0x18ef35,_0x41ca57,_0x13bfba))_0x41ca57+=this['lineHeight']();if(this[_0xa70c64(0x4ae)](_0x18ef35,_0x41ca57,_0x13bfba))_0x41ca57+=this[_0xa70c64(0x1f1)]();if(this[_0xa70c64(0x374)](_0x18ef35,_0x41ca57,_0x13bfba))_0x41ca57+=this[_0xa70c64(0x1f1)]();if(this['drawItemEffectsHpDamage'](_0x18ef35,_0x41ca57,_0x13bfba))_0x41ca57+=this[_0xa70c64(0x1f1)]();if(this['drawItemEffectsMpDamage'](_0x18ef35,_0x41ca57,_0x13bfba))_0x41ca57+=this[_0xa70c64(0x1f1)]();if(this[_0xa70c64(0x47c)](_0x18ef35,_0x41ca57,_0x13bfba))_0x41ca57+=this[_0xa70c64(0x1f1)]();if(this['drawItemEffectsSelfTpGain'](_0x18ef35,_0x41ca57,_0x13bfba))_0x41ca57+=this[_0xa70c64(0x1f1)]();if(this['drawItemEffectsAddedStatesBuffs'](_0x18ef35,_0x41ca57,_0x13bfba))_0x41ca57+=this[_0xa70c64(0x1f1)]();if(this['drawItemEffectsRemovedStatesBuffs'](_0x18ef35,_0x41ca57,_0x13bfba))_0x41ca57+=this['lineHeight']();return this[_0xa70c64(0x3b8)](),_0x41ca57;},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x4b8)]=function(){const _0x5d7497=_0x2459ae;let _0xf44dee=![];this[_0x5d7497(0x471)]={'rateHP':0x0,'flatHP':0x0,'rateMP':0x0,'flatMP':0x0,'gainTP':0x0,'selfTP':0x0,'addState':[],'removeState':[],'changeBuff':[0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0],'removeBuff':[],'removeDebuff':[],'addStateBuffChanges':![],'removeStateBuffChanges':![]};for(const _0x1a0732 of this[_0x5d7497(0x334)][_0x5d7497(0x274)]){switch(_0x1a0732[_0x5d7497(0x20f)]){case Game_Action['EFFECT_RECOVER_HP']:this[_0x5d7497(0x471)][_0x5d7497(0x337)]+=_0x1a0732[_0x5d7497(0x422)],this['_itemData'][_0x5d7497(0x3c9)]+=_0x1a0732[_0x5d7497(0x25a)],_0xf44dee=!![];break;case Game_Action[_0x5d7497(0x265)]:this[_0x5d7497(0x471)][_0x5d7497(0x324)]+=_0x1a0732[_0x5d7497(0x422)],this[_0x5d7497(0x471)]['flatMP']+=_0x1a0732['value2'],_0xf44dee=!![];break;case Game_Action['EFFECT_GAIN_TP']:this[_0x5d7497(0x471)][_0x5d7497(0x46c)]+=_0x1a0732['value1'],_0xf44dee=!![];break;case Game_Action[_0x5d7497(0x307)]:this[_0x5d7497(0x471)][_0x5d7497(0x329)][_0x5d7497(0x42c)](_0x1a0732['dataId']),_0xf44dee=!![];break;case Game_Action[_0x5d7497(0x4ce)]:this[_0x5d7497(0x471)][_0x5d7497(0x4ac)][_0x5d7497(0x42c)](_0x1a0732[_0x5d7497(0x277)]),this[_0x5d7497(0x471)][_0x5d7497(0x409)]=!![],_0xf44dee=!![];break;case Game_Action[_0x5d7497(0x2fc)]:this['_itemData'][_0x5d7497(0x476)][_0x1a0732[_0x5d7497(0x277)]]+=0x1,_0xf44dee=!![];break;case Game_Action[_0x5d7497(0x261)]:this[_0x5d7497(0x471)][_0x5d7497(0x476)][_0x1a0732[_0x5d7497(0x277)]]-=0x1,_0xf44dee=!![];break;case Game_Action['EFFECT_REMOVE_BUFF']:this[_0x5d7497(0x471)][_0x5d7497(0x304)]['push'](_0x1a0732[_0x5d7497(0x277)]),this[_0x5d7497(0x471)][_0x5d7497(0x409)]=!![],_0xf44dee=!![];break;case Game_Action[_0x5d7497(0x464)]:this[_0x5d7497(0x471)]['removeDebuff'][_0x5d7497(0x42c)](_0x1a0732['dataId']),this[_0x5d7497(0x471)][_0x5d7497(0x409)]=!![],_0xf44dee=!![];break;}}if(this[_0x5d7497(0x471)]['addState'][_0x5d7497(0x335)]>0x0)this[_0x5d7497(0x471)][_0x5d7497(0x494)]=!![];for(let _0x31b750=0x0;_0x31b750<this['_itemData'][_0x5d7497(0x476)][_0x5d7497(0x335)];_0x31b750++){if(this['_itemData']['changeBuff'][_0x31b750]!==0x0)this[_0x5d7497(0x471)]['addStateBuffChanges']=!![];}this[_0x5d7497(0x334)][_0x5d7497(0x24e)]!==0x0&&(this['_itemData'][_0x5d7497(0x2b5)]=this['_item'][_0x5d7497(0x24e)],_0xf44dee=!![]);const _0x84369e=[_0x5d7497(0x3f5),_0x5d7497(0x338),_0x5d7497(0x2dd),_0x5d7497(0x4fe),_0x5d7497(0x29e),_0x5d7497(0x311),_0x5d7497(0x4b6),_0x5d7497(0x4d6),_0x5d7497(0x447)];for(const _0xccbed2 of _0x84369e){if(this[_0x5d7497(0x396)][_0xccbed2]){_0xf44dee=!![];break;}}return _0xf44dee;},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x200)]=function(_0x551a50,_0x1c6a9c,_0x446e90){const _0x4ca7d5=_0x2459ae,_0x5b73e2=_0x4ca7d5(0x3f5);if(this[_0x4ca7d5(0x471)][_0x4ca7d5(0x337)]<=0x0&&this[_0x4ca7d5(0x471)]['flatHP']<=0x0&&!this[_0x4ca7d5(0x396)][_0x5b73e2])return![];const _0xbabc5c=this['getItemEffectsHpRecoveryLabel']();this[_0x4ca7d5(0x3d1)](_0xbabc5c,_0x551a50,_0x1c6a9c,_0x446e90,!![]);const _0x1825e=this['getItemEffectsHpRecoveryText']();return this[_0x4ca7d5(0x37e)](ColorManager[_0x4ca7d5(0x4cc)](0x1)),this[_0x4ca7d5(0x3d1)](_0x1825e,_0x551a50,_0x1c6a9c,_0x446e90,![],_0x4ca7d5(0x309)),this[_0x4ca7d5(0x290)](_0x551a50,_0x1c6a9c,_0x446e90),this[_0x4ca7d5(0x3b8)](),!![];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x24f)]=function(){const _0x19d354=_0x2459ae,_0x337e27=VisuMZ[_0x19d354(0x368)][_0x19d354(0x27d)][_0x19d354(0x3e8)][_0x19d354(0x4fa)];return _0x337e27[_0x19d354(0x342)](TextManager['hp']);},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x48b)]=function(){const _0x22bc04=_0x2459ae,_0x2fcc17=_0x22bc04(0x3f5);if(this[_0x22bc04(0x396)][_0x2fcc17])return this[_0x22bc04(0x396)][_0x2fcc17];let _0x2ee779='';if(this['_itemData'][_0x22bc04(0x337)]>0x0)_0x2ee779+='+%1%'[_0x22bc04(0x342)](Math[_0x22bc04(0x2d2)](this['_itemData'][_0x22bc04(0x337)]*0x64));if(this[_0x22bc04(0x471)]['rateHP']>0x0&&this[_0x22bc04(0x471)][_0x22bc04(0x3c9)]>0x0)_0x2ee779+='\x20';if(this[_0x22bc04(0x471)][_0x22bc04(0x3c9)]>0x0)_0x2ee779+=_0x22bc04(0x459)[_0x22bc04(0x342)](this[_0x22bc04(0x471)][_0x22bc04(0x3c9)]);return _0x2ee779;},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x4ae)]=function(_0x2fefcd,_0x4c7f37,_0x54a175){const _0x53bd7b=_0x2459ae,_0x37443f=_0x53bd7b(0x338);if(this[_0x53bd7b(0x471)][_0x53bd7b(0x324)]<=0x0&&this[_0x53bd7b(0x471)][_0x53bd7b(0x397)]<=0x0&&!this['_customItemInfo'][_0x37443f])return![];const _0x57d590=this[_0x53bd7b(0x35f)]();this['drawItemKeyData'](_0x57d590,_0x2fefcd,_0x4c7f37,_0x54a175,!![]);const _0x34ee76=this[_0x53bd7b(0x291)]();return this[_0x53bd7b(0x37e)](ColorManager[_0x53bd7b(0x4cc)](0x3)),this['drawItemKeyData'](_0x34ee76,_0x2fefcd,_0x4c7f37,_0x54a175,![],_0x53bd7b(0x309)),this[_0x53bd7b(0x290)](_0x2fefcd,_0x4c7f37,_0x54a175),this['resetFontSettings'](),!![];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x35f)]=function(){const _0x30324c=_0x2459ae,_0x161ab1=VisuMZ[_0x30324c(0x368)][_0x30324c(0x27d)][_0x30324c(0x3e8)][_0x30324c(0x45a)];return _0x161ab1['format'](TextManager['mp']);},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x291)]=function(){const _0x38941e=_0x2459ae,_0x3b9661=_0x38941e(0x338);if(this[_0x38941e(0x396)][_0x3b9661])return this[_0x38941e(0x396)][_0x3b9661];let _0x1d3138='';if(this['_itemData'][_0x38941e(0x324)]>0x0)_0x1d3138+=_0x38941e(0x387)[_0x38941e(0x342)](Math[_0x38941e(0x2d2)](this['_itemData'][_0x38941e(0x324)]*0x64));if(this[_0x38941e(0x471)][_0x38941e(0x324)]>0x0&&this[_0x38941e(0x471)][_0x38941e(0x397)]>0x0)_0x1d3138+='\x20';if(this[_0x38941e(0x471)]['flatMP']>0x0)_0x1d3138+=_0x38941e(0x459)[_0x38941e(0x342)](this[_0x38941e(0x471)]['flatMP']);return _0x1d3138;},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x374)]=function(_0x1a8fc7,_0x2b5077,_0x23a2c4){const _0x3d23b9=_0x2459ae,_0x1e9aad=_0x3d23b9(0x2dd);if(this['_itemData']['gainTP']<=0x0&&!this['_customItemInfo'][_0x1e9aad])return![];const _0x315133=this[_0x3d23b9(0x1dd)]();this[_0x3d23b9(0x3d1)](_0x315133,_0x1a8fc7,_0x2b5077,_0x23a2c4,!![]);const _0x2e1c6c=this['getItemEffectsTpRecoveryText']();return this[_0x3d23b9(0x37e)](ColorManager[_0x3d23b9(0x2f0)]()),this['drawItemKeyData'](_0x2e1c6c,_0x1a8fc7,_0x2b5077,_0x23a2c4,![],'right'),this[_0x3d23b9(0x290)](_0x1a8fc7,_0x2b5077,_0x23a2c4),this['resetFontSettings'](),!![];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x1dd)]=function(){const _0x16be44=_0x2459ae,_0x57dc83=VisuMZ[_0x16be44(0x368)][_0x16be44(0x27d)]['StatusWindow'][_0x16be44(0x26d)];return _0x57dc83[_0x16be44(0x342)](TextManager['tp']);},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x3f2)]=function(){const _0x5ea140=_0x2459ae,_0xddda38=_0x5ea140(0x2dd);if(this['_customItemInfo'][_0xddda38])return this[_0x5ea140(0x396)][_0xddda38];let _0x4180d3='';return _0x4180d3+=_0x5ea140(0x459)[_0x5ea140(0x342)](this[_0x5ea140(0x471)][_0x5ea140(0x46c)]),_0x4180d3;},Window_ShopStatus[_0x2459ae(0x316)]['drawItemEffectsSelfTpGain']=function(_0x41daec,_0xdd4e80,_0x28dd82){const _0x4fb34e=_0x2459ae,_0x1c0e73=_0x4fb34e(0x4b6);if(this[_0x4fb34e(0x471)][_0x4fb34e(0x2b5)]===0x0&&!this[_0x4fb34e(0x396)][_0x1c0e73])return![];const _0x24b428=this[_0x4fb34e(0x20c)]();this['drawItemKeyData'](_0x24b428,_0x41daec,_0xdd4e80,_0x28dd82,!![]);const _0x127dba=this[_0x4fb34e(0x4ee)]();return this[_0x4fb34e(0x471)][_0x4fb34e(0x2b5)]>0x0?this[_0x4fb34e(0x37e)](ColorManager[_0x4fb34e(0x2f0)]()):this['changeTextColor'](ColorManager[_0x4fb34e(0x47f)]()),this[_0x4fb34e(0x3d1)](_0x127dba,_0x41daec,_0xdd4e80,_0x28dd82,![],_0x4fb34e(0x309)),this[_0x4fb34e(0x290)](_0x41daec,_0xdd4e80,_0x28dd82),this['resetFontSettings'](),!![];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x20c)]=function(){const _0x106199=_0x2459ae,_0x23467c=VisuMZ[_0x106199(0x368)][_0x106199(0x27d)][_0x106199(0x3e8)][_0x106199(0x37d)];return _0x23467c[_0x106199(0x342)](TextManager['tp']);},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x4ee)]=function(){const _0x2f21dd=_0x2459ae,_0x4d7464=_0x2f21dd(0x4b6);if(this[_0x2f21dd(0x396)][_0x4d7464])return this[_0x2f21dd(0x396)][_0x4d7464];let _0x3c5957='';return this[_0x2f21dd(0x471)][_0x2f21dd(0x2b5)]>0x0?_0x3c5957+=_0x2f21dd(0x459)['format'](this[_0x2f21dd(0x471)][_0x2f21dd(0x2b5)]):_0x3c5957+='%1'[_0x2f21dd(0x342)](this['_itemData'][_0x2f21dd(0x2b5)]),_0x3c5957;},Window_ShopStatus['prototype'][_0x2459ae(0x257)]=function(_0x5bc1cb,_0x510fca,_0x27666c){const _0x1b2643=_0x2459ae,_0x318e35='HP\x20DAMAGE';if(this['_itemData'][_0x1b2643(0x337)]>=0x0&&this['_itemData'][_0x1b2643(0x3c9)]>=0x0&&!this['_customItemInfo'][_0x318e35])return![];const _0x3e0937=this[_0x1b2643(0x410)]();this[_0x1b2643(0x3d1)](_0x3e0937,_0x5bc1cb,_0x510fca,_0x27666c,!![]);const _0xfb3b8a=this[_0x1b2643(0x36f)]();return this[_0x1b2643(0x37e)](ColorManager[_0x1b2643(0x4cc)](0x0)),this['drawItemKeyData'](_0xfb3b8a,_0x5bc1cb,_0x510fca,_0x27666c,![],_0x1b2643(0x309)),this[_0x1b2643(0x290)](_0x5bc1cb,_0x510fca,_0x27666c),this[_0x1b2643(0x3b8)](),!![];},Window_ShopStatus['prototype'][_0x2459ae(0x410)]=function(){const _0x3b5d31=_0x2459ae,_0x3ef0d0=VisuMZ['ItemsEquipsCore'][_0x3b5d31(0x27d)][_0x3b5d31(0x3e8)][_0x3b5d31(0x1e2)];return _0x3ef0d0[_0x3b5d31(0x342)](TextManager['hp']);},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x36f)]=function(){const _0x4a7093=_0x2459ae,_0x5de352='HP\x20DAMAGE';if(this[_0x4a7093(0x396)][_0x5de352])return this['_customItemInfo'][_0x5de352];let _0x3cdf99='';if(this[_0x4a7093(0x471)][_0x4a7093(0x337)]<0x0)_0x3cdf99+=_0x4a7093(0x229)[_0x4a7093(0x342)](Math[_0x4a7093(0x2d2)](this[_0x4a7093(0x471)]['rateHP']*0x64));if(this[_0x4a7093(0x471)][_0x4a7093(0x337)]<0x0&&this[_0x4a7093(0x471)][_0x4a7093(0x3c9)]<0x0)_0x3cdf99+='\x20';if(this[_0x4a7093(0x471)][_0x4a7093(0x3c9)]<0x0)_0x3cdf99+='%1'[_0x4a7093(0x342)](this['_itemData'][_0x4a7093(0x3c9)]);return _0x3cdf99;},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x231)]=function(_0x6acdd1,_0x424205,_0x27d539){const _0xe7f7c1=_0x2459ae,_0x39ab88=_0xe7f7c1(0x29e);if(this[_0xe7f7c1(0x471)][_0xe7f7c1(0x324)]>=0x0&&this[_0xe7f7c1(0x471)][_0xe7f7c1(0x397)]>=0x0&&!this[_0xe7f7c1(0x396)][_0x39ab88])return![];const _0x126a0c=this[_0xe7f7c1(0x2cb)]();this[_0xe7f7c1(0x3d1)](_0x126a0c,_0x6acdd1,_0x424205,_0x27d539,!![]);const _0x22b5a7=this[_0xe7f7c1(0x492)]();return this[_0xe7f7c1(0x37e)](ColorManager['damageColor'](0x2)),this['drawItemKeyData'](_0x22b5a7,_0x6acdd1,_0x424205,_0x27d539,![],_0xe7f7c1(0x309)),this['drawItemDarkRect'](_0x6acdd1,_0x424205,_0x27d539),this[_0xe7f7c1(0x3b8)](),!![];},Window_ShopStatus['prototype'][_0x2459ae(0x2cb)]=function(){const _0x65aa87=_0x2459ae,_0x59c7e7=VisuMZ[_0x65aa87(0x368)][_0x65aa87(0x27d)][_0x65aa87(0x3e8)][_0x65aa87(0x3c6)];return _0x59c7e7['format'](TextManager['mp']);},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x492)]=function(){const _0xe00134=_0x2459ae,_0x368e03=_0xe00134(0x29e);if(this[_0xe00134(0x396)][_0x368e03])return this['_customItemInfo'][_0x368e03];let _0x2ab44e='';if(this[_0xe00134(0x471)][_0xe00134(0x324)]<0x0)_0x2ab44e+=_0xe00134(0x229)[_0xe00134(0x342)](Math[_0xe00134(0x2d2)](this[_0xe00134(0x471)][_0xe00134(0x324)]*0x64));if(this['_itemData'][_0xe00134(0x324)]<0x0&&this[_0xe00134(0x471)][_0xe00134(0x397)]<0x0)_0x2ab44e+='\x20';if(this[_0xe00134(0x471)][_0xe00134(0x397)]<0x0)_0x2ab44e+='%1'[_0xe00134(0x342)](this[_0xe00134(0x471)][_0xe00134(0x397)]);return _0x2ab44e;},Window_ShopStatus['prototype'][_0x2459ae(0x47c)]=function(_0x1b607a,_0x228b3a,_0x387b9a){const _0x21ad46=_0x2459ae,_0x1733f3='TP\x20DAMAGE';if(this[_0x21ad46(0x471)][_0x21ad46(0x46c)]>=0x0&&!this[_0x21ad46(0x396)][_0x1733f3])return![];const _0x3f333a=this[_0x21ad46(0x3b1)]();this[_0x21ad46(0x3d1)](_0x3f333a,_0x1b607a,_0x228b3a,_0x387b9a,!![]);const _0x2f14ba=this[_0x21ad46(0x283)]();return this[_0x21ad46(0x37e)](ColorManager['powerDownColor']()),this[_0x21ad46(0x3d1)](_0x2f14ba,_0x1b607a,_0x228b3a,_0x387b9a,![],_0x21ad46(0x309)),this[_0x21ad46(0x290)](_0x1b607a,_0x228b3a,_0x387b9a),this[_0x21ad46(0x3b8)](),!![];},Window_ShopStatus[_0x2459ae(0x316)]['getItemEffectsTpDamageLabel']=function(){const _0x51b151=_0x2459ae,_0x4d0342=VisuMZ[_0x51b151(0x368)][_0x51b151(0x27d)]['StatusWindow'][_0x51b151(0x474)];return _0x4d0342[_0x51b151(0x342)](TextManager['tp']);},Window_ShopStatus[_0x2459ae(0x316)]['getItemEffectsTpDamageText']=function(){const _0xb2740b=_0x2459ae,_0x296bba='TP\x20DAMAGE';if(this['_customItemInfo'][_0x296bba])return this[_0xb2740b(0x396)][_0x296bba];let _0x5237a4='';return _0x5237a4+='%1'['format'](this[_0xb2740b(0x471)]['gainTP']),_0x5237a4;},Window_ShopStatus[_0x2459ae(0x316)]['drawItemEffectsAddedStatesBuffs']=function(_0x428b5b,_0x2ad7e6,_0x1b7c03){const _0x4fe923=_0x2459ae,_0x9785a9='ADDED\x20EFFECTS';if(!this['_itemData']['addStateBuffChanges']&&!this[_0x4fe923(0x396)][_0x9785a9])return![];const _0x954fbf=this['getItemEffectsAddedStatesBuffsLabel']();this[_0x4fe923(0x3d1)](_0x954fbf,_0x428b5b,_0x2ad7e6,_0x1b7c03,!![]);const _0x4a8c2d=this[_0x4fe923(0x205)]();return this[_0x4fe923(0x3d1)](_0x4a8c2d,_0x428b5b,_0x2ad7e6,_0x1b7c03,![],_0x4fe923(0x309)),this[_0x4fe923(0x290)](_0x428b5b,_0x2ad7e6,_0x1b7c03),this[_0x4fe923(0x3b8)](),!![];},Window_ShopStatus[_0x2459ae(0x316)]['getItemEffectsAddedStatesBuffsLabel']=function(){const _0x1ab839=_0x2459ae;return VisuMZ['ItemsEquipsCore']['Settings'][_0x1ab839(0x3e8)][_0x1ab839(0x435)];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x205)]=function(){const _0x24640d=_0x2459ae,_0x1a4225='ADDED\x20EFFECTS';if(this['_customItemInfo'][_0x1a4225])return this[_0x24640d(0x396)][_0x1a4225];let _0x277cc6='',_0x5441f5=0x0;const _0x38e275=0x8;for(const _0x2ab685 of this[_0x24640d(0x471)][_0x24640d(0x329)]){const _0x5e45e2=$dataStates[_0x2ab685];if(_0x5e45e2&&_0x5e45e2[_0x24640d(0x26f)]>0x0){_0x277cc6+=_0x24640d(0x27e)[_0x24640d(0x342)](_0x5e45e2[_0x24640d(0x26f)]),_0x5441f5++;if(_0x5441f5>=_0x38e275)return _0x277cc6;}}for(let _0xd89ceb=0x0;_0xd89ceb<this[_0x24640d(0x471)][_0x24640d(0x476)][_0x24640d(0x335)];_0xd89ceb++){const _0x58a0bd=this[_0x24640d(0x471)][_0x24640d(0x476)][_0xd89ceb],_0x402eca=Game_BattlerBase[_0x24640d(0x316)][_0x24640d(0x227)](_0x58a0bd,_0xd89ceb);if(_0x402eca>0x0){_0x277cc6+=_0x24640d(0x27e)['format'](_0x402eca),_0x5441f5++;if(_0x5441f5>=_0x38e275)return _0x277cc6;}}return _0x277cc6;},Window_ShopStatus[_0x2459ae(0x316)]['drawItemEffectsRemovedStatesBuffs']=function(_0x336ffc,_0x1db191,_0x296f6a){const _0x46ce43=_0x2459ae,_0x6d1d39=_0x46ce43(0x447);if(!this[_0x46ce43(0x471)]['removeStateBuffChanges']&&!this['_customItemInfo'][_0x6d1d39])return![];const _0x1ed102=this[_0x46ce43(0x235)]();this[_0x46ce43(0x3d1)](_0x1ed102,_0x336ffc,_0x1db191,_0x296f6a,!![]);const _0x174731=this['getItemEffectsRemovedStatesBuffsText']();return this['drawItemKeyData'](_0x174731,_0x336ffc,_0x1db191,_0x296f6a,![],'right'),this[_0x46ce43(0x290)](_0x336ffc,_0x1db191,_0x296f6a),this[_0x46ce43(0x3b8)](),!![];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x235)]=function(){const _0x327dc3=_0x2459ae;return VisuMZ['ItemsEquipsCore'][_0x327dc3(0x27d)]['StatusWindow'][_0x327dc3(0x449)];},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x1d4)]=function(){const _0x422989=_0x2459ae,_0xc3507c=_0x422989(0x447);if(this['_customItemInfo'][_0xc3507c])return this[_0x422989(0x396)][_0xc3507c];let _0x16ca5a='',_0x23baa7=0x0;const _0x3153d1=VisuMZ[_0x422989(0x368)]['Settings'][_0x422989(0x3e8)][_0x422989(0x501)];for(const _0x5cb545 of this[_0x422989(0x471)][_0x422989(0x4ac)]){const _0x19c514=$dataStates[_0x5cb545];if(_0x19c514&&_0x19c514[_0x422989(0x26f)]>0x0){_0x16ca5a+='\x5cI[%1]'[_0x422989(0x342)](_0x19c514[_0x422989(0x26f)]),_0x23baa7++;if(_0x23baa7>=_0x3153d1)return _0x16ca5a;}}for(let _0x1bf814=0x0;_0x1bf814<this[_0x422989(0x471)][_0x422989(0x304)][_0x422989(0x335)];_0x1bf814++){const _0x545370=Game_BattlerBase['prototype']['buffIconIndex'](0x1,_0x1bf814);if(_0x545370>0x0){_0x16ca5a+=_0x422989(0x27e)['format'](_0x545370),_0x23baa7++;if(_0x23baa7>=_0x3153d1)return _0x16ca5a;}}for(let _0x141671=0x0;_0x141671<this['_itemData'][_0x422989(0x2d7)][_0x422989(0x335)];_0x141671++){const _0x120144=Game_BattlerBase[_0x422989(0x316)][_0x422989(0x227)](-0x1,_0x141671);if(_0x120144>0x0){_0x16ca5a+='\x5cI[%1]'[_0x422989(0x342)](_0x120144),_0x23baa7++;if(_0x23baa7>=_0x3153d1)return _0x16ca5a;}}return _0x16ca5a;},Window_ShopStatus[_0x2459ae(0x316)]['drawItemCustomEntries']=function(_0x128dfb,_0x21bf6a,_0x5f3c96){const _0x1244ca=_0x2459ae;if(this['_item'][_0x1244ca(0x321)][_0x1244ca(0x455)](/<CUSTOM STATUS INFO>\s*([\s\S]*)\s*<\/CUSTOM STATUS INFO>/i)){const _0x4d0d35=String(RegExp['$1'])[_0x1244ca(0x43f)](/[\r\n]+/);for(const _0x3b5f8c of _0x4d0d35){if(_0x3b5f8c[_0x1244ca(0x455)](/(.*):[ ](.*)/i)){const _0x5bcc7f=String(RegExp['$1'])['trim'](),_0x2e5b94=String(RegExp['$2'])[_0x1244ca(0x264)]();this['drawItemCustomEntryLine'](_0x5bcc7f,_0x2e5b94,_0x128dfb,_0x21bf6a,_0x5f3c96),_0x21bf6a+=this['lineHeight']();}}}return this['resetFontSettings'](),_0x21bf6a;},Window_ShopStatus[_0x2459ae(0x316)][_0x2459ae(0x3b2)]=function(_0x31dfc0,_0x338f6e,_0x52d298,_0x5400a3,_0x3eeded){const _0x51defc=_0x2459ae;this[_0x51defc(0x3d1)](_0x31dfc0,_0x52d298,_0x5400a3,_0x3eeded,!![]),this[_0x51defc(0x3d1)](_0x338f6e,_0x52d298,_0x5400a3,_0x3eeded,![],'right'),this[_0x51defc(0x290)](_0x52d298,_0x5400a3,_0x3eeded),this['resetFontSettings']();};