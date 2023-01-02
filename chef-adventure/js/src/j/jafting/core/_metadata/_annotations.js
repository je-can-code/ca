//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 JAFT] Enables the ability to craft items from recipes.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables a new "JAFTING" (aka crafting) scene. With it, you can
 * define recipes and enable generic item creation in your game.
 *
 * NOTE ABOUT CREATION:
 * This base plugin can only be used to create already-existing entries from
 * the database. If you want to create new weapons/armor entirely, consider
 * looking into the J-JAFTING-Refinement extension.
 * ============================================================================
 * RECIPES:
 * Have you ever wanted to make a recipe that the player can then learn and
 * create items from? Well now you can! There are absolutely no tags required
 * for this basic functionality, it is 100% defined within the plugin
 * parameters of your RMMZ editor.
 *
 * A recipe is comprised of three lists:
 * - Ingredients: the consumed items/weapons/armors.
 * - Tools: the non-consumed items/weapons/armors.
 * - Output: what the player gains when JAFTING the recipe.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Retroactively added this CHANGELOG.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @param JAFTINGconfigs
 * @text JAFTING SETUP
 *
 * @param JAFTINGrecipes
 * @parent JAFTINGconfigs
 * @type struct<RecipeStruct>[]
 * @text JAFTING Recipes
 *
 * @param JAFTINGcategories
 * @parent JAFTINGconfigs
 * @type struct<CategoryStruct>[]
 * @text JAFTING Categories
 *
 * @command Call Jafting Menu
 * @text Access the Jafting Menu
 * @desc Calls the Jafting Menu via plugin command.
 *
 * @command Close Jafting Menu
 * @text End the Jafting session
 * @desc Ends the current Jafting session immediately.
 * Typically used for triggering a parallel item created event.
 *
 * @command Unlock Category
 * @text Unlock new category
 * @desc Within the Crafting Mode, unlocks a new category of crafting.
 * @arg categoryKeys
 * @type string[]
 * @text Category Keys
 * @desc All the keys of the categories to be unlocked.
 *
 * @command Unlock Recipe
 * @text Unlock new recipe
 * @desc Within the Crafting Mode, unlocks a new recipe of a category of crafting.
 * @arg recipeKeys
 * @type string[]
 * @text Recipe Keys
 * @desc All the keys of the recipes to be unlocked.
 *
 * @command Lock Category
 * @text Lock a category
 * @desc Within the Crafting Mode, locks a previously unlocked category of crafting.
 * @arg key
 * @type string
 * @desc The unique identifier to this category to remove.
 * @default C_SOME
 *
 * @command Lock All Categories
 * @text Lock all crafting categories
 * @desc Locks all categories that were previously unlocked, effectively disabling crafting.
 */
/*~struct~RecipeStruct:
 * @param recipeKey
 * @type string
 * @text Recipe Key
 * @desc A unique identifier for this recipe.
 *
 * @param name
 * @type string
 * @text Name
 * @desc The name of the recipe.
 *
 * @param description
 * @type string
 * @text Description
 * @desc The description of this recipe. If unspecified, it will pull from the first output description.
 *
 * @param iconIndex
 * @type number
 * @text Icon Index
 * @desc The icon index of this recipe. If unspecified, it will pull from the first output description.
 *
 * @param categoryKeys
 * @type string[]
 * @text Category Keys
 * @desc The keys of the categories that this recipe belongs to.
 * @default []
 *
 * @param ingredients
 * @type struct<ComponentStruct>[]
 * @text Ingredients
 * @desc The ingredients required to JAFT this recipe. These are consumed.
 * @default []
 *
 * @param tools
 * @type struct<ComponentStruct>[]
 * @text Tools
 * @desc The tools required to JAFT this recipe. These are not consumed.
 * @default []
 *
 * @param output
 * @type struct<ComponentStruct>[]
 * @text Output
 * @desc Upon JAFTING this recipe, these items are given to the player.
 * @default []
 *
 * @param maskedUntilCrafted
 * @type boolean
 * @text Masked Until Crafted
 * @desc If this is set to true, then it will appear as all question marks until crafted the first time.
 * @default false
 *
 */
/*~struct~ComponentStruct:
 * @param itemId
 * @type item
 * @text Item ID
 * @desc The item this component represents.
 * There can only be one "id" identified on a component.
 *
 * @param weaponId
 * @type weapon
 * @text Weapon ID
 * @desc The weapon this component represents.
 * There can only be one "id" identified on a component.
 *
 * @param armorId
 * @type armor
 * @text Armor ID
 * @desc The armor this component represents.
 * There can only be one "id" identified on a component.
 *
 * @param num
 * @type number
 * @min 1
 * @text Quantity
 * @desc The quantity of this JAFTING component.
 * @default 1
 */
/*~struct~CategoryStruct:
 *
 * @param name
 * @type string
 * @text Category Name
 * @desc The name of this category.
 *
 * @param key
 * @type string
 * @text Category Key
 * @desc The unique key for this category.
 *
 * @param iconIndex
 * @type number
 * @text Icon Index
 * @desc The icon index to represent this category.
 * @default 0
 *
 * @param description
 * @type string
 * @text Description
 * @desc The description of this category to show up in the help window.
 */