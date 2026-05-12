//region JaftingSalvageDataModels
/**
 * Concrete JAFTING salvage ledger models (rows, per-unit snapshots, party keyed bags).<br>
 * <br>
 * **Mental model (what you are looking at in a save file):**<br>
 * - {@link JaftingSalvageLedgerRow} — one dismantle refund line (`t` + database id + `n` count,
 *   optional `banned`).<br>
 * - {@link JaftingSalvageLedgerSnapshot} — the full stamp on **one** physical unit (one craft output,
 *   one refine output, or one stack slot for a shared template id).<br>
 * - {@link JaftingSalvagePartyLedgerBag} — lives under `$gameParty._j._jafting._salvageLedgers['w:12']` style keys
 *   because vanilla stacks cannot diverge per copy inside `$dataWeapons` / `$dataArmors`.<br>
 * <br>
 * File name sorts **before** {@link JaftingSalvageLedger} so the concatenated bundle loads these constructors
 * first.<br>
 * {@link SerializableRegistry} registration lets J-Base’s patched {@link JsonEx} restore prototypes on load.
 */

/**
 * One stamped ingredient line (`t` + `id` + `n`, optional dismantle ban).<br>
 * `t` mirrors dismantle routing (`i` / `w` / `a`, gold letter, SDP letter, etc.)—see
 * {@link JaftingSalvageManager.refundLedgerRows}.
 */
class JaftingSalvageLedgerRow
{
  /**
   * @param {string} t Ledger type letter (`i`, `w`, `a`, gold, SDP, etc.).
   * @param {number} id Database id (or 0 for non-db rows such as gold).
   * @param {number} n Quantity credited when dismantling **one** stamped unit.
   * @param {boolean=} banned When true, dismantle skips this row.
   */
  constructor(t, id, n, banned)
  {
    this.t = t;
    this.id = id;
    this.n = n;

    if (banned === true)
    {
      this.banned = true;
    }
  }

  /**
   * Normalizes save data or hand-built literals into a row instance.
   *
   * @param {JaftingSalvageLedgerRow|{ t: string, id: number, n: number, banned?: boolean }} row
   * @returns {JaftingSalvageLedgerRow}
   */
  static coerce(row)
  {
    if (row instanceof JaftingSalvageLedgerRow)
    {
      return row;
    }

    return new JaftingSalvageLedgerRow(row.t, row.id, row.n, row.banned === true);
  }

  /**
   * Deep-copies this row so merges never share mutable references.
   *
   * @returns {JaftingSalvageLedgerRow}
   */
  clone()
  {
    return new JaftingSalvageLedgerRow(this.t, this.id, this.n, this.banned === true);
  }
}

SerializableRegistry.register(JaftingSalvageLedgerRow);

/**
 * Salvage stamp for **one** inventory unit (craft output slot, refinement output, or one stack ordinal).<br>
 * Party stacks mirror these in {@link JaftingSalvagePartyLedgerBag#unitLedgers}; dynamic refinement rows hang the same
 * shape on {@link RPG_Weapon#_jaftingSalvageLedger} and {@link RPG_Armor#_jaftingSalvageLedger}.
 */
class JaftingSalvageLedgerSnapshot
{
  /**
   * @param {JaftingSalvageLedgerRow[]|JaftingSalvageLedgerSnapshot|{ rows?: JaftingSalvageLedgerRow[] }|null|
   *   undefined} rowsSource
   */
  constructor(rowsSource)
  {
    // clone-from-snapshot, accept `{ rows }` literals from older saves/tests, or accept a bare row array.
    if (rowsSource instanceof JaftingSalvageLedgerSnapshot)
    {
      this.rows = rowsSource.rows.map(r => JaftingSalvageLedgerRow.coerce(r).clone());

      return;
    }

    if (rowsSource && Array.isArray(rowsSource.rows))
    {
      this.rows = JaftingSalvageLedgerSnapshot.coerceRows(rowsSource.rows);

      return;
    }

    if (Array.isArray(rowsSource))
    {
      this.rows = JaftingSalvageLedgerSnapshot.coerceRows(rowsSource);

      return;
    }

    this.rows = [];
  }

  /**
   * Normalizes every entry to {@link JaftingSalvageLedgerRow} (handles post-load plain objects).
   *
   * @param {unknown[]} rows
   * @returns {JaftingSalvageLedgerRow[]}
   */
  static coerceRows(rows)
  {
    if (Array.isArray(rows) === false)
    {
      return [];
    }

    const out = [];

    for (let i = 0; i < rows.length; i++)
    {
      out.push(JaftingSalvageLedgerRow.coerce(rows[i]));
    }

    return out;
  }

  /**
   * Reads `.rows` from a snapshot instance or a duck-typed interim object.
   *
   * @param {JaftingSalvageLedgerSnapshot|{ rows?: unknown[] }|null|undefined} ledger
   * @returns {JaftingSalvageLedgerRow[]}
   */
  static rowsFromUnknown(ledger)
  {
    if (!ledger || !ledger.rows)
    {
      return [];
    }

    return JaftingSalvageLedgerSnapshot.coerceRows(ledger.rows);
  }

  /**
   * Clones every row into a fresh snapshot (used when stamping multiple outputs from the same recipe shell).
   *
   * @param {JaftingSalvageLedgerSnapshot|{ rows?: JaftingSalvageLedgerRow[] }} ledger
   * @returns {JaftingSalvageLedgerSnapshot}
   */
  static cloneFromLedgerLike(ledger)
  {
    const rows = JaftingSalvageLedgerSnapshot.rowsFromUnknown(ledger);
    const clones = [];

    for (let i = 0; i < rows.length; i++)
    {
      clones.push(rows[i].clone());
    }

    return new JaftingSalvageLedgerSnapshot(clones);
  }
}

SerializableRegistry.register(JaftingSalvageLedgerSnapshot);

/**
 * Party-side ledger bag for a single template id (`i:` / `w:` / `a:` keys in {@link JaftingSalvageManager}).<br>
 * `unitLedgers` parallels {@link Game_Party#numItems} for that template; `rows` holds the merged dismantle view.
 */
class JaftingSalvagePartyLedgerBag
{
  constructor()
  {
    /**
     * Per stack slot lineage (null when that copy has no stamp).
     *
     * @type {(JaftingSalvageLedgerSnapshot|null)[]}
     */
    this.unitLedgers = [];

    /**
     * Merged dismantle rows (union of every non-empty {@link #unitLedgers} slot).
     *
     * @type {JaftingSalvageLedgerRow[]}
     */
    this.rows = [];
  }

  /**
   * Normalizes unit slots that survived save/load as plain `{ rows }` objects.
   *
   * @param {JaftingSalvagePartyLedgerBag} bag
   */
  static coerceUnitLedgerSlots(bag)
  {
    for (let i = 0; i < bag.unitLedgers.length; i++)
    {
      const u = bag.unitLedgers[i];

      if (u === null || u === undefined)
      {
        continue;
      }

      if ((u instanceof JaftingSalvageLedgerSnapshot) === false)
      {
        bag.unitLedgers[i] = new JaftingSalvageLedgerSnapshot(u.rows || []);
      }
      else
      {
        u.rows = JaftingSalvageLedgerSnapshot.coerceRows(u.rows);
      }
    }
  }

  /**
   * Upgrades interim literals to class instances while preserving bag identity when already typed.
   *
   * @param {JaftingSalvagePartyLedgerBag|{ unitLedgers?: unknown[], rows?: unknown[] }|null|undefined} raw
   * @returns {JaftingSalvagePartyLedgerBag}
   */
  static coerce(raw)
  {
    // production path should already be class instances after JsonEx; tests may still hand us plain objects.
    if (raw instanceof JaftingSalvagePartyLedgerBag)
    {
      raw.rows = JaftingSalvageLedgerSnapshot.coerceRows(raw.rows);
      JaftingSalvagePartyLedgerBag.coerceUnitLedgerSlots(raw);

      return raw;
    }

    const bag = new JaftingSalvagePartyLedgerBag();

    if (!raw)
    {
      return bag;
    }

    if (Array.isArray(raw.unitLedgers))
    {
      for (let i = 0; i < raw.unitLedgers.length; i++)
      {
        const u = raw.unitLedgers[i];

        if (u === null || u === undefined)
        {
          bag.unitLedgers.push(null);
        }
        else if ((u instanceof JaftingSalvageLedgerSnapshot) === true)
        {
          bag.unitLedgers.push(new JaftingSalvageLedgerSnapshot(u));
        }
        else
        {
          bag.unitLedgers.push(new JaftingSalvageLedgerSnapshot(u.rows || []));
        }
      }
    }

    bag.rows = JaftingSalvageLedgerSnapshot.coerceRows(raw.rows || []);

    return bag;
  }
}

SerializableRegistry.register(JaftingSalvagePartyLedgerBag);

//endregion JaftingSalvageDataModels

//region JaftingSalvageLedger
/**
 * Stateless helpers for salvage ledger **rows** (clone, merge, dedupe).<br>
 * Concrete row / snapshot / bag classes live in {@link JaftingSalvageLedgerRow},
 * {@link JaftingSalvageLedgerSnapshot}, and {@link JaftingSalvagePartyLedgerBag}
 * (see `JaftingSalvageDataModels.js`).<br>
 * Party-facing **saved** ledgers live under {@link JaftingSalvageManager} on `$gameParty` or on RPG equipment rows.<br>
 * <br>
 * **Why a global name:** JAFTING ships as concatenated plain JS (no modules). Attaching a namespace object to one
 * global is how shared utilities share scope with {@link JaftingSalvageManager} without circular ordering headaches.
 * The `var X = X || {}` idiom keeps the bucket safe if anything ever double-evaluates.<br>
 * If we outgrow it, fold these functions onto `J.JAFTING` or into the manager—behavior stays the same.
 */
var JaftingSalvageLedger = JaftingSalvageLedger || {};

/**
 * Armor type id used for ingredient-style armors (monster parts, materials).<br>
 * Must align with JAFTING Refinement UI filtering and game data conventions.
 */
JaftingSalvageLedger.MaterialArmorTypeId = 5;

/**
 * Effective armor type id for ingredient stacks (JAFTING core plugin parameter).<br>
 * {@link MaterialArmorTypeId} is the fallback when metadata is missing; -1 in parameters means disabled
 * (no armor type is treated as stack-only material).
 *
 * @returns {number}
 */
JaftingSalvageLedger.getMaterialArmorTypeId = function()
{
  if (typeof J !== 'undefined'
    && J.JAFTING !== undefined
    && J.JAFTING.Metadata !== undefined)
  {
    const v = J.JAFTING.Metadata.materialArmorTypeId;

    if (typeof v === 'number' && !Number.isNaN(v))
    {
      return v;
    }
  }

  return JaftingSalvageLedger.MaterialArmorTypeId;
};

/**
 * Weapon type id for stack-only ingredient weapons (JAFTING core plugin parameter).<br>
 * -1 disables the feature; 0 is a valid {@link RPG_Weapon#wtypeId} when you intend that type as material stacks.
 *
 * @returns {number}
 */
JaftingSalvageLedger.getMaterialWeaponTypeId = function()
{
  if (typeof J !== 'undefined'
    && J.JAFTING !== undefined
    && J.JAFTING.Metadata !== undefined)
  {
    const v = J.JAFTING.Metadata.materialWeaponTypeId;

    if (typeof v === 'number' && !Number.isNaN(v))
    {
      return v;
    }
  }

  return -1;
};

/**
 * True when this armor row uses the configured material armor type (refine primary filter, dismantle pass-through).
 *
 * @param {RPG_Armor|RPG_Base} datum
 * @returns {boolean}
 */
JaftingSalvageLedger.isMaterialArmorDatum = function(datum)
{
  const armorTypeId = JaftingSalvageLedger.getMaterialArmorTypeId();

  if (armorTypeId < 0)
  {
    return false;
  }

  return datum.isArmor() === true && datum.atypeId === armorTypeId;
};

/**
 * True when this weapon row uses the configured material weapon type (parameter must be zero or greater).
 *
 * @param {RPG_Weapon|RPG_Base} datum
 * @returns {boolean}
 */
JaftingSalvageLedger.isMaterialWeaponDatum = function(datum)
{
  const weaponTypeId = JaftingSalvageLedger.getMaterialWeaponTypeId();

  if (weaponTypeId < 0)
  {
    return false;
  }

  return datum.isWeapon() === true && datum.wtypeId === weaponTypeId;
};

/**
 * True when refine lists should keep one row with stack counts (monster parts, clip-style weapons, etc.).
 *
 * @param {RPG_EquipItem|RPG_Base} datum
 * @returns {boolean}
 */
JaftingSalvageLedger.isStackCountedRefinableEquip = function(datum)
{
  return JaftingSalvageLedger.isMaterialArmorDatum(datum)
    || JaftingSalvageLedger.isMaterialWeaponDatum(datum);
};

/**
 * Stable merge key for a ledger row (type + database id).
 *
 * @param {JaftingSalvageLedgerRow|{ t: string, id: number }} row
 * @returns {string}
 */
JaftingSalvageLedger.rowMergeKey = function(row)
{
  return `${row.t}:${row.id}`;
};

/**
 * Clones row objects for safe merging without sharing references.
 *
 * @param {JaftingSalvageLedgerRow[]|{ t: string, id: number, n: number, banned?: boolean }[]} rows
 * @returns {JaftingSalvageLedgerRow[]}
 */
JaftingSalvageLedger.cloneRows = function(rows)
{
  const list = JaftingSalvageLedgerSnapshot.coerceRows(rows);
  const out = [];

  for (let i = 0; i < list.length; i++)
  {
    out.push(list[i].clone());
  }

  return out;
};

/**
 * Merges duplicate rows by summing counts when {@link rowMergeKey} matches.<br>
 * Call this whenever a pipeline might double-count the same ingredient (parallel outputs, concat merges, reload
 * coercion).<br>
 * Banned flags OR together (if any duplicate is banned, merged row is banned).
 *
 * @param {JaftingSalvageLedgerRow[]|{ t: string, id: number, n: number, banned?: boolean }[]} rows
 * @returns {JaftingSalvageLedgerRow[]}
 */
JaftingSalvageLedger.mergeDuplicateRows = function(rows)
{
  // bucket keyed by component identity so two "horn" lines become one row with summed quantity.
  const bucket = {};
  const list = JaftingSalvageLedgerSnapshot.coerceRows(rows);

  for (let i = 0; i < list.length; i++)
  {
    const row = list[i];
    const key = JaftingSalvageLedger.rowMergeKey(row);

    if (!bucket[key])
    {
      bucket[key] = row.clone();
    }
    else
    {
      bucket[key].n += row.n;

      // any banned duplicate poisons the merged row so salvage math can skip the whole bucket later.
      if (row.banned === true)
      {
        bucket[key].banned = true;
      }
    }
  }

  return Object.keys(bucket).map(k => bucket[k]);
};

/**
 * Builds ledger rows from recipe ingredients (what crafting consumed).<br>
 * Tools are intentionally omitted — salvage stamps track consumed inputs only.
 *
 * @param {CraftingComponent[]} ingredients
 * @returns {JaftingSalvageLedgerRow[]}
 */
JaftingSalvageLedger.rowsFromCraftingComponents = function(ingredients)
{
  const rows = [];

  for (let i = 0; i < ingredients.length; i++)
  {
    const component = ingredients[i];

    if (component.isDatabaseEntry())
    {
      // mirror {@link CraftingComponent} letter codes into ledger row type letters for stash/refund routing.
      const datum = component.getItem();
      let typeLetter = 'i';

      if (component.isWeapon())
      {
        typeLetter = 'w';
      }
      else if (component.isArmor())
      {
        typeLetter = 'a';
      }

      rows.push(new JaftingSalvageLedgerRow(typeLetter, datum.id, component.quantity()));
    }
    else if (component.isGold())
    {
      rows.push(new JaftingSalvageLedgerRow(CraftingComponent.Types.Gold, 0, component.quantity()));
    }
    else if (component.isSdp())
    {
      rows.push(new JaftingSalvageLedgerRow(CraftingComponent.Types.SDP, 0, component.quantity()));
    }
  }

  // stamp uses ingredients only—tools never consume, so they never appear in dismantle refunds for v1 policy.
  return JaftingSalvageLedger.mergeDuplicateRows(rows);
};

/**
 * Concatenates two ledgers, then runs {@link mergeDuplicateRows} so overlapping `t:id` keys sum instead of duplicating
 * lines.<br>
 * Refine / craft code paths prefer this over hand-rolled loops—order only matters before dedupe, not after.
 *
 * @param {JaftingSalvageLedgerRow[]|{ t: string, id: number, n: number, banned?: boolean }[]} a
 * @param {JaftingSalvageLedgerRow[]|{ t: string, id: number, n: number, banned?: boolean }[]} b
 * @returns {JaftingSalvageLedgerRow[]}
 */
JaftingSalvageLedger.mergeRowArrays = function(a, b)
{
  // concat first so identical keys from both sides collide, then dedupe sums counts and merges banned flags.
  const combined = JaftingSalvageLedger.cloneRows(a).concat(JaftingSalvageLedger.cloneRows(b));

  return JaftingSalvageLedger.mergeDuplicateRows(combined);
};

//endregion JaftingSalvageLedger

//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.1.2 JAFTING-Core] Root JAFTING menu, salvage loop, and extension hooks.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is the core menu system that other JAFTING menus plug into.
 * It was designed as an extensible wrapper scene for all JAFTING modes.
 *
 * NOTE ABOUT THIS PLUGIN:
 * This is a base plugin that offers no actual crafting functionality itself.
 * It offers instead a root "JAFTING" menu that the other extensions will
 * connect to for singular JAFTING access—including Salvage on that hub (same
 * scene as {@code call-salvage}). Chances are, if you are using
 * this plugin, you probably also want to grab the "Creation" extension and/or
 * the "Refinement" extension and place them below this one.
 * ============================================================================
 * ORGANIZATION:
 * Have you ever wanted a menu that has a single purpose, such as granting
 * access to all the other crafting menus built to work with JAFTING? Well now
 * you can! Just drop this plugin above your other installed JAFTING extension
 * plugins, and voila! It works.
 *
 * NOTE ABOUT THIS PLUGIN:
 * It isn't really necessary. It is literally just a wrapper scene and menu
 * that unifies access to all JAFTING scenes. You could also just directly
 * call the other JAFTING scenes directly if you preferred.
 * ============================================================================
 * CHANGELOG:
 * - 2.1.2
 *    Salvage hub row: label, icon, optional switch gate
 *    ({@link Window_JaftingList}).
 *    {@link Scene_JaftingSalvage.KEY} ties the hub entry to scene routing.
 * - 2.1.1
 *    Party salvage bags init from {@link DataManager.createGameObjects} and
 *    {@link DataManager.extractSaveContents}
 *    (not {@link Scene_Boot#onDatabaseLoaded}; runs before $gameParty exists).
 * - 2.1.0
 *    Salvage ledger helpers, {@link Scene_JaftingSalvage}, and plugin command
 *    call-salvage.
 * - 2.0.0
 *    Removed all references to refinement logic.
 *    Extracted the crafting logic entirely into its own plugin.
 *    Repurposes this plugin to be the "core" or "root" crafting menu only.
 *    Retroactively added this CHANGELOG.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @command call-menu
 * @text Call Core Menu
 * @desc Brings up the core JAFTING menu.
 *
 * @command call-salvage
 * @text Call Salvage Scene
 * @desc Dismantle stamped gear; hub row uses same scene; ignores switch gate.
 *
 * @param jaftingSalvageConfig
 * @text SALVAGE / REFINE STACKS
 *
 * @param material-armor-type-id
 * @parent jaftingSalvageConfig
 * @type number
 * @min -1
 * @text Material armor type id
 * @desc Ingredient armor stacks; refine skips; dismantle keeps rows.-1 off.
 * @default 5
 *
 * @param material-weapon-type-id
 * @parent jaftingSalvageConfig
 * @type number
 * @min -1
 * @text Material weapon type id
 * @desc Material weapon wtypeId (-1 off). Mirrors armor stack rules in lists.
 * @default -1
 *
 * @param jaftingHubSalvage
 * @text HUB — SALVAGE ROW
 *
 * @param salvage-menu-switch
 * @parent jaftingHubSalvage
 * @type number
 * @min 0
 * @text Salvage hub switch id
 * @desc Non-zero: switch ON enables hub Salvage row. 0 always shows Salvage.
 * @default 0
 *
 * @param salvage-menu-name
 * @parent jaftingHubSalvage
 * @type string
 * @text Salvage hub command name
 * @desc Label for the Salvage entry on the root JAFTING menu.
 * @default Salvage
 *
 * @param salvage-menu-icon
 * @parent jaftingHubSalvage
 * @type number
 * @text Salvage hub command icon
 * @desc Icon sheet index beside Salvage on the JAFTING hub list.
 * @default 192
 *
 */

//region plugin metadata
/**
 * Plugin metadata for the core JAFTING plugin.
 * Because this plugin offers little actual functionality, there is little that
 * can be configured.
 */
class J_CraftingPluginMetadata
  extends PluginMetadata
{
  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   * Reads salvage/refine stack policy ids from plugin parameters.
   */
  postInitialize()
  {
    super.postInitialize();

    this.materialArmorTypeId = J.BASE.Helpers.parsePluginInt(
      this.parsedPluginParameters['material-armor-type-id'],
      5,
    );

    this.materialWeaponTypeId = J.BASE.Helpers.parsePluginInt(
      this.parsedPluginParameters['material-weapon-type-id'],
      -1,
    );

    // hub Salvage row: switch id 0 skips gating; non-zero ids require `$gameSwitches` ON to enable the command.
    this.salvageMenuSwitchId = J.BASE.Helpers.parsePluginInt(
      this.parsedPluginParameters['salvage-menu-switch'],
      0,
    );

    // label + icon on the root hub list; plugin command `call-salvage` ignores the switch gate entirely.
    this.salvageCommandName = this.parsedPluginParameters['salvage-menu-name'] ?? 'Salvage';

    this.salvageMenuIconIndex = J.BASE.Helpers.parsePluginInt(
      this.parsedPluginParameters['salvage-menu-icon'],
      192,
    );
  }
}

//endregion plugin metadata

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.3';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.JAFTING = {};

/**
 * A collection of all extensions for JAFTING.
 */
J.JAFTING.EXT = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.JAFTING.Metadata = new J_CraftingPluginMetadata('J-JAFTING', '2.1.2');

/**
 * A helpful mapping of all the various RMMZ classes being extended.
 */
J.JAFTING.Aliased = {};
J.JAFTING.Aliased.Game_Party = new Map();
J.JAFTING.Aliased.DataManager = new Map();
J.JAFTING.Aliased.Scene_Jafting = new Map();
//endregion Introduction

//region plugin commands
/**
 * A plugin command.<br>
 * Calls the core JAFTING menu.
 */
PluginManager.registerCommand(J.JAFTING.Metadata.name, "call-menu", () =>
{
  Scene_Jafting.callScene();
});

/**
 * A plugin command.<br>
 * Opens the JAFTING salvage scene directly (bypasses hub switch gating on
 * {@link Scene_JaftingSalvage.isSalvageHubCommandEnabled}).
 */
PluginManager.registerCommand(J.JAFTING.Metadata.name, "call-salvage", () =>
{
  Scene_JaftingSalvage.callScene();
});
//endregion plugin commands

//region JaftingSalvageManager
/**
 * Orchestrates **where** ledgers live, **when** they merge from craft/refine, **how** dismantle pays out, and
 * **cleanup** when the last copy of dynamic refinement rows disappears from inventory.<br>
 * <br>
 * **Two storage homes (read this before touching `getLedger*`):**<br>
 * - **Dynamic refinement rows** (`id` ≥ {@link JaftingSalvageManager.DynamicEquipIndexMin}) — stamp rides on
 *   `datum._jaftingSalvageLedger` because each `$dataWeapons` / `$dataArmors` slot is already unique.<br>
 * - **Vanilla stack templates** — stamp lives in `$gameParty._j._jafting._salvageLedgers[containerKey]` as a
 * {@link JaftingSalvagePartyLedgerBag} with `unitLedgers[]` parallel to stack height.<br>
 * <br>
 * Saved shapes are {@link JaftingSalvageLedgerSnapshot} and {@link JaftingSalvagePartyLedgerBag}; each stamped line is
 * a {@link JaftingSalvageLedgerRow}. Merge math stays on {@link JaftingSalvageLedger}.
 */
class JaftingSalvageManager
{
  /**
   * Dynamic weapon/armor indices created by JAFTING Refinement begin here.<br>
   * Must stay aligned with {@link JaftingManager.StartingIndex} when Refinement is installed.
   */
  static DynamicEquipIndexMin = 2001;

  /**
   * Extension seam: runs after a dynamic refinement slot drops out of inventory and `$dataWeapons` / `$dataArmors`
   * is reset to {@link RPG_Weapon.createEmpty} / {@link RPG_Armor.createEmpty}.<br>
   * Projects may replace this function on {@link JaftingSalvageManager} to chain extra bookkeeping—default is a no-op.
   *
   * @param {'weapon'|'armor'} kind
   * @param {number} slotId
   */
  /* eslint-disable no-unused-vars -- default body is empty; parameters define the hook contract for replacements. */
  static onAfterDynamicSlotReclaimed(kind, slotId)
  {
  }
  /* eslint-enable no-unused-vars */

  /**
   * Container key for party-side ledger maps (vanilla stacks cannot diverge per-instance).
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} datum
   * @returns {string|null}
   */
  static containerKeyFromDatum(datum)
  {
    // ask the hydrated RPG wrapper—never DataManager checks here (refined ids may not sit where vanilla expects).
    if (datum.isItem())
    {
      return `i:${datum.id}`;
    }

    if (datum.isWeapon())
    {
      return `w:${datum.id}`;
    }

    if (datum.isArmor())
    {
      return `a:${datum.id}`;
    }

    return null;
  }

  /**
   * Ensures `$gameParty._j._jafting._salvageLedgers` exists.<br>
   * Invoked only from {@link DataManager.createGameObjects} and {@link DataManager.extractSaveContents} so party bags
   * are ready before any gameplay touches ledgers—ledger readers do not lazy-init this graph.
   */
  static initPartySalvageStorage()
  {
    if (!$gameParty)
    {
      return;
    }

    $gameParty._j ||= {};
    $gameParty._j._jafting ||= {};
    $gameParty._j._jafting._salvageLedgers ||= {};
  }

  /**
   * Rebuilds merged `bag.rows` from every non-empty per-slot ledger (dismantle still reads merged rows only).
   *
   * @param {JaftingSalvagePartyLedgerBag} bag
   */
  static recomputeMergedRowsFromPartyLedgerBag(bag)
  {
    // `bag.rows` is the **union** of every stamped stack slot—salvage list + layout helpers read it without walking
    // `unitLedgers[]` one by one. Rebuild from slots so losing the top copy does not leave stale merged totals behind.
    let acc = [];

    if (bag.unitLedgers && bag.unitLedgers.length > 0)
    {
      for (let i = 0; i < bag.unitLedgers.length; i++)
      {
        const unit = bag.unitLedgers[i];

        if (unit && unit.rows && unit.rows.length > 0)
        {
          acc = JaftingSalvageLedger.mergeRowArrays(acc, JaftingSalvageLedger.cloneRows(unit.rows));
        }
      }
    }

    bag.rows = JaftingSalvageLedger.mergeDuplicateRows(acc);
  }

  /**
   * Keeps per-slot ledger array length aligned to current party stack size (LIFO push/pop).
   *
   * @param {JaftingSalvagePartyLedgerBag} bag
   * @param {RPG_Base} datum
   */
  static syncPartyLedgerUnitCountToStack(bag, datum)
  {
    const n = $gameParty.numItems(datum);

    if (!Array.isArray(bag.unitLedgers))
    {
      bag.unitLedgers = [];
    }

    while (bag.unitLedgers.length < n)
    {
      bag.unitLedgers.push(null);
    }

    while (bag.unitLedgers.length > n)
    {
      bag.unitLedgers.pop();
    }

    JaftingSalvageManager.recomputeMergedRowsFromPartyLedgerBag(bag);
  }

  /**
   * Ensures the party bag has a parallel {@link JaftingSalvagePartyLedgerBag#unitLedgers} array and matches current
   * `numItems`.
   *
   * @param {JaftingSalvagePartyLedgerBag|{ unitLedgers?: unknown[], rows?: unknown[] }} bag
   * @param {RPG_Base} datum
   */
  static coercePartyLedgerBagShapeForDatum(bag, datum)
  {
    const key = JaftingSalvageManager.containerKeyFromDatum(datum);
    const working = JaftingSalvagePartyLedgerBag.coerce(bag);

    // `coerce` may mint a fresh bag instance—replace the map entry so later readers do not keep a stale plain object.
    if (working !== bag)
    {
      $gameParty._j._jafting._salvageLedgers[key] = working;
    }

    if (!Array.isArray(working.unitLedgers))
    {
      working.unitLedgers = [];
    }

    JaftingSalvageManager.syncPartyLedgerUnitCountToStack(working, datum);
  }

  /**
   * Deletes an empty keyed bag when merged rows and every slot are lineage-free.
   *
   * @param {string} key
   */
  static pruneEmptyPartyLedgerBag(key)
  {
    // keyed map is unbounded—drop the entry once both the merged summary **and** every per-slot snapshot are empty so
    // saves stay lean and `getLedgerForDatum` stops returning ghost bags.
    let bag = $gameParty._j._jafting._salvageLedgers[key];

    if (!bag)
    {
      return;
    }

    bag = JaftingSalvagePartyLedgerBag.coerce(bag);

    if (bag !== $gameParty._j._jafting._salvageLedgers[key])
    {
      $gameParty._j._jafting._salvageLedgers[key] = bag;
    }

    let anyUnitRows = false;

    if (Array.isArray(bag.unitLedgers))
    {
      for (let i = 0; i < bag.unitLedgers.length; i++)
      {
        const u = bag.unitLedgers[i];

        if (u && u.rows && u.rows.length > 0)
        {
          anyUnitRows = true;
          break;
        }
      }
    }

    const mergedEmpty = !bag.rows || bag.rows.length === 0;

    if (mergedEmpty && anyUnitRows === false)
    {
      delete $gameParty._j._jafting._salvageLedgers[key];
    }
  }

  /**
   * Reads the salvage ledger attached to an RPG datum or the party bag for stacked goods.
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} datum
   * @returns {JaftingSalvageLedgerSnapshot|JaftingSalvagePartyLedgerBag|null}
   */
  static getLedgerForDatum(datum)
  {
    // salvage UI layout runs during scene create before the candidate window has a highlighted row—`item()` is empty.
    if (datum === null || datum === undefined)
    {
      return null;
    }

    // refinement allocates unique datastore indices—those ledgers ride on the RPG row itself.
    if (datum._jaftingSalvageLedger && datum._jaftingSalvageLedger.rows)
    {
      if ((datum._jaftingSalvageLedger instanceof JaftingSalvageLedgerSnapshot) === false)
      {
        datum._jaftingSalvageLedger = new JaftingSalvageLedgerSnapshot(datum._jaftingSalvageLedger);
      }

      return datum._jaftingSalvageLedger;
    }

    // vanilla stacks only track counts per id, so shared-template crafted goods stash their ledger on the party bag.
    const key = JaftingSalvageManager.containerKeyFromDatum(datum);
    let bag = $gameParty._j._jafting._salvageLedgers[key];

    if (bag)
    {
      JaftingSalvageManager.coercePartyLedgerBagShapeForDatum(bag, datum);
      bag = $gameParty._j._jafting._salvageLedgers[key];
    }

    if (bag && bag.rows && bag.rows.length > 0)
    {
      return bag;
    }

    return null;
  }

  /**
   * Reads the salvage ledger for one stack index (party bag) or the whole dynamic row ledger.
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} datum
   * @param {number|null|undefined} unitOrdinal
   * @returns {JaftingSalvageLedgerSnapshot|JaftingSalvagePartyLedgerBag|null}
   */
  static getLedgerUnitForDatum(datum, unitOrdinal)
  {
    if (datum === null || datum === undefined)
    {
      return null;
    }

    // refinement ids already own a single snapshot on the row—ignore stack ordinals (UI still passes per-slot indices).
    if (datum.id >= JaftingSalvageManager.DynamicEquipIndexMin)
    {
      return JaftingSalvageManager.getLedgerForDatum(datum);
    }

    if (unitOrdinal === null || unitOrdinal === undefined)
    {
      return JaftingSalvageManager.getLedgerForDatum(datum);
    }

    const key = JaftingSalvageManager.containerKeyFromDatum(datum);

    if (!key)
    {
      return null;
    }

    // static-template stacks: each physical copy has its own snapshot in `unitLedgers[]` so dismantle matches the slot
    // the player expanded in salvage UI—merged `bag.rows` stays the shared summary for the whole stack.
    let bag = $gameParty._j._jafting._salvageLedgers[key];

    if (!bag)
    {
      return null;
    }

    JaftingSalvageManager.coercePartyLedgerBagShapeForDatum(bag, datum);
    bag = $gameParty._j._jafting._salvageLedgers[key];

    const unit = bag.unitLedgers[unitOrdinal];

    if (!unit || !unit.rows || unit.rows.length === 0)
    {
      return null;
    }

    return unit;
  }

  /**
   * Clears ledger storage for a datum everywhere it might live.
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} datum
   */
  static clearLedgerForDatum(datum)
  {
    if (datum._jaftingSalvageLedger)
    {
      datum._jaftingSalvageLedger = null;
    }

    const key = JaftingSalvageManager.containerKeyFromDatum(datum);

    if (key)
    {
      delete $gameParty._j._jafting._salvageLedgers[key];
    }
  }

  /**
   * Party hook after items enter inventory — grow per-slot lineage arrays for static-template stacks.
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} itemDatum
   * @param {number} amountGained
   */
  static afterPartyGainedItem(itemDatum, amountGained)
  {
    if (!itemDatum || amountGained < 1)
    {
      return;
    }

    if (itemDatum.id >= JaftingSalvageManager.DynamicEquipIndexMin)
    {
      return;
    }

    const key = JaftingSalvageManager.containerKeyFromDatum(itemDatum);

    if (!key)
    {
      return;
    }

    JaftingSalvageManager.initPartySalvageStorage();
    const bag = $gameParty._j._jafting._salvageLedgers[key];

    if (!bag)
    {
      return;
    }

    JaftingSalvageManager.coercePartyLedgerBagShapeForDatum(bag, itemDatum);
    JaftingSalvageManager.pruneEmptyPartyLedgerBag(key);
  }

  /**
   * After crafting succeeds, stamps outputs using ingredient-derived ledger rows (deduped).
   *
   * @param {CraftingRecipe} recipe
   */
  static applyCraftRecipeOutputs(recipe)
  {
    const ingredientRows = JaftingSalvageLedger.rowsFromCraftingComponents(recipe.ingredients);
    const shell = new JaftingSalvageLedgerSnapshot(ingredientRows);

    for (let i = 0; i < recipe.outputs.length; i++)
    {
      const component = recipe.outputs[i];

      if (component.isDatabaseEntry())
      {
        const datum = component.getItem();

        // clone per output row so multi-output recipes cannot accidentally share one mutable array reference.
        const snapshot = JaftingSalvageLedgerSnapshot.cloneFromLedgerLike(shell);

        JaftingSalvageManager.appendStampedUnitsToPartyStack(datum, snapshot, component.quantity());
      }
    }
  }

  /**
   * Merges an incoming ledger snapshot into whatever storage backs {@link datum}.
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} datum
   * @param {JaftingSalvageLedgerSnapshot|{ rows: JaftingSalvageLedgerRow[] }} incomingLedger
   */
  static mergeLedgerIntoPartyOrDatum(datum, incomingLedger)
  {
    // refinement output rows are unique `$data*` instances—merge straight onto the RPG object. stacks instead grow
    // `unitLedgers[]` so each physical copy keeps its own dismantle story.
    if (datum.id >= JaftingSalvageManager.DynamicEquipIndexMin)
    {
      // dynamic refinement rows are unique instances—ledger travels with the RPG object in `$data*`.
      const existingRows = JaftingSalvageLedgerSnapshot.rowsFromUnknown(datum._jaftingSalvageLedger);
      const incomingRows = JaftingSalvageLedgerSnapshot.rowsFromUnknown(incomingLedger);

      datum._jaftingSalvageLedger = new JaftingSalvageLedgerSnapshot(
        JaftingSalvageLedger.mergeRowArrays(existingRows, incomingRows),
      );

      return;
    }

    JaftingSalvageManager.appendStampedUnitsToPartyStack(datum, incomingLedger, 1);
  }

  /**
   * Assigns freshly crafted lineage snapshots onto the last stampedCount stack slots (LIFO stack order).<br>
   * Call after {@link Game_Party.prototype.gainItem} has already raised counts (see {@link CraftingRecipe#craft}).
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} datum
   * @param {JaftingSalvageLedgerSnapshot|{ rows: JaftingSalvageLedgerRow[] }} incomingLedger
   * @param {number} stampedCount
   */
  static appendStampedUnitsToPartyStack(datum, incomingLedger, stampedCount)
  {
    if (datum.id >= JaftingSalvageManager.DynamicEquipIndexMin)
    {
      return;
    }

    const key = JaftingSalvageManager.containerKeyFromDatum(datum);

    if (!key)
    {
      return;
    }

    if (stampedCount < 1)
    {
      return;
    }

    JaftingSalvageManager.initPartySalvageStorage();
    const ledgers = $gameParty._j._jafting._salvageLedgers;
    let bag = ledgers[key];

    if (!bag)
    {
      bag = new JaftingSalvagePartyLedgerBag();
      ledgers[key] = bag;
    }

    JaftingSalvageManager.coercePartyLedgerBagShapeForDatum(bag, datum);
    bag = $gameParty._j._jafting._salvageLedgers[key];

    const n = $gameParty.numItems(datum);
    const start = Math.max(0, n - stampedCount);

    // only the tail of the stack changed—older slots keep whatever stamp they already carried from prior crafts.
    for (let i = start; i < n; i++)
    {
      bag.unitLedgers[i] = JaftingSalvageLedgerSnapshot.cloneFromLedgerLike(incomingLedger);
    }

    JaftingSalvageManager.recomputeMergedRowsFromPartyLedgerBag(bag);
  }

  /**
   * True when the refinement **material** contributes **no extra dismantle rows** onto the output stamp.<br>
   * <br>
   * Check order matters: stamped ledger wins first, then ingredient-type exceptions, then the blunt "vendor shell"
   * weapon/armor rule—stack items fall through to `false` so we never mis-classify a normal item donor.<br>
   * Pair with {@link JaftingSalvageManager.buildRefinementOutputLedger}; that method mirrors these branches when
   * building rows.
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} materialDatum
   * @returns {boolean}
   */
  static refinementMaterialHasNoRecoverableRows(materialDatum)
  {
    const ledger = JaftingSalvageManager.getLedgerForDatum(materialDatum);

    // crafted donors carry a stamped ledger—those rows merge back into the output.
    if (ledger && ledger.rows && ledger.rows.length > 0)
    {
      return false;
    }

    // ingredient-class armors (monster parts) always contribute one salvage row even without prior crafting history.
    if (materialDatum.isArmor()
      && materialDatum.atypeId === JaftingSalvageLedger.getMaterialArmorTypeId())
    {
      return false;
    }

    if (JaftingSalvageLedger.isMaterialWeaponDatum(materialDatum))
    {
      return false;
    }

    // bare vendor weapon/armor donors get eaten without refund rows—only gold sinks here per design policy.
    if (materialDatum.isWeapon() || materialDatum.isArmor())
    {
      return true;
    }

    return false;
  }

  /**
   * Builds the merged salvage ledger that should attach to refined output equipment.<br>
   * <br>
   * **Pipeline (same story as {@link JaftingSalvageManager.refinementMaterialHasNoRecoverableRows}, but emitting
   * rows):** clone the base stamp, optionally fold donor rows, always end on a deduped snapshot so duplicate `t:id`
   * keys from parallel crafts collapse cleanly.<br>
   * Early exit when the donor is a **gold-only** vendor shell—base lineage alone defines dismantle. Stamped donor
   * merges next. Ingredient-class gear without a nested ledger still gets a **synthetic** single row so dismantle
   * refunds the part. The final `return` catches non-equip donors where none of the above applied.
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} baseDatum
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} materialDatum
   * @returns {JaftingSalvageLedgerSnapshot}
   */
  static buildRefinementOutputLedger(baseDatum, materialDatum)
  {
    // carry dismantle history from the base (craft + every prior refine merge), then fold in whatever the material
    // contributed—stamped donor ledger, ingredient-class part row, or nothing when the donor was a bare vendor shell.
    const baseLedger = JaftingSalvageManager.getLedgerForDatum(baseDatum);
    // clone so merge helpers never mutate party storage or the dynamic RPG row still equipped in the list window.
    const baseRows = baseLedger && baseLedger.rows
      ? JaftingSalvageLedger.cloneRows(baseLedger.rows)
      : [];

    if (JaftingSalvageManager.refinementMaterialHasNoRecoverableRows(materialDatum))
    {
      // vendor weapon/armor donor with no stamp and no ingredient-type pass-through—output inherits base stamp only.
      return new JaftingSalvageLedgerSnapshot(JaftingSalvageLedger.mergeDuplicateRows(baseRows));
    }

    const materialLedger = JaftingSalvageManager.getLedgerForDatum(materialDatum);

    // another crafted piece donated its whole stamped ledger—concatenate lineage for dismantle tracking.
    if (materialLedger && materialLedger.rows && materialLedger.rows.length > 0)
    {
      return new JaftingSalvageLedgerSnapshot(
        JaftingSalvageLedger.mergeRowArrays(baseRows, materialLedger.rows),
      );
    }

    if (materialDatum.isArmor()
      && materialDatum.atypeId === JaftingSalvageLedger.getMaterialArmorTypeId())
    {
      // single armor-row snapshot for ingredient-type monster drops consumed as material.
      const partRows = [
        new JaftingSalvageLedgerRow('a', materialDatum.id, 1),
      ];

      return new JaftingSalvageLedgerSnapshot(JaftingSalvageLedger.mergeRowArrays(baseRows, partRows));
    }

    if (JaftingSalvageLedger.isMaterialWeaponDatum(materialDatum))
    {
      const partRows = [
        new JaftingSalvageLedgerRow('w', materialDatum.id, 1),
      ];

      return new JaftingSalvageLedgerSnapshot(JaftingSalvageLedger.mergeRowArrays(baseRows, partRows));
    }

    // stack items and other donors that are not vendor shells still land here—no extra rows beyond the base stamp.
    return new JaftingSalvageLedgerSnapshot(JaftingSalvageLedger.mergeDuplicateRows(baseRows));
  }

  /**
   * Whether dismantling this datum would return anything after weapon/armor expansion.<br>
   * UI uses this so vendor-only stamps (bare `w`/`a` rows that unpack to nothing) never clutter the candidate list.
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} datum
   * @returns {boolean}
   */
  static datumHasSalvageLedger(datum)
  {
    const snap = JaftingSalvageManager.getSalvageLedgerSnapshotExpanded(datum);

    return !!(snap && snap.rows && snap.rows.length > 0);
  }

  /**
   * Clone of the party/datum ledger with `w`/`a` rows replaced by nested ingredient rows (or dropped when vendor).<br>
   * Stored ledgers stay raw; dismantle + UI read through this snapshot so crafted donors never pay whole weapons back.
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} datum
   * @returns {JaftingSalvageLedgerSnapshot|null}
   */
  static getSalvageLedgerSnapshotExpanded(datum)
  {
    const raw = JaftingSalvageManager.getLedgerForDatum(datum);

    if (!raw || !raw.rows || raw.rows.length === 0)
    {
      return null;
    }

    // step one: normalize the stored stamp (dedupe keys) without touching `$data*` yet—storage stays compact.
    const merged = JaftingSalvageLedger.mergeDuplicateRows(JaftingSalvageLedger.cloneRows(raw.rows));
    // step two: unpack nested weapon/armor history so dismantle never pays whole vendor shells for crafted donors.
    const expanded = JaftingSalvageManager.expandWeaponArmorRowsForSalvage(merged, {});

    return new JaftingSalvageLedgerSnapshot(expanded);
  }

  /**
   * Counts non-banned rows after expansion (used for salvage UI layout).
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor|null|undefined} datum
   * @returns {number}
   */
  static visibleExpandedRefundRowCount(datum)
  {
    const snap = JaftingSalvageManager.getSalvageLedgerSnapshotExpanded(datum);

    if (!snap || !snap.rows)
    {
      return 0;
    }

    let n = 0;

    for (let i = 0; i < snap.rows.length; i++)
    {
      if (snap.rows[i].banned === true)
      {
        continue;
      }

      n++;
    }

    return n;
  }

  /**
   * @param {RPG_Item|RPG_Weapon|RPG_Armor|null|undefined} datum
   * @returns {number}
   */
  static layoutPreviewLineCountSingle(datum)
  {
    if (datum === null || datum === undefined)
    {
      return 1;
    }

    const n = JaftingSalvageManager.visibleExpandedRefundRowCount(datum);

    if (n < 1)
    {
      return 1;
    }

    return 3 + n;
  }

  /**
   * @param {RPG_Item|RPG_Weapon|RPG_Armor|null|undefined} datum
   * @returns {number}
   */
  static layoutPreviewLineCountTwoColumn(datum)
  {
    const n = JaftingSalvageManager.visibleExpandedRefundRowCount(datum);

    if (n < 1)
    {
      return JaftingSalvageManager.layoutPreviewLineCountSingle(datum);
    }

    return 3 + Math.ceil(n / 2);
  }

  /**
   * When a weapon/armor ledger row has no nested ledger, vendor shells drop—except material-type gear.
   *
   * @param {JaftingSalvageLedgerRow[]} flat
   * @param {JaftingSalvageLedgerRow|{ t: string, id: number, n: number, banned?: boolean }} row
   * @param {RPG_Weapon|RPG_Armor} equipDatum
   * @returns {boolean} true when a pass-through row was appended.
   */
  static tryPushMaterialEquipmentPassThrough(flat, row, equipDatum)
  {
    const isArmorMaterial = row.t === 'a'
      && equipDatum.isArmor()
      && equipDatum.atypeId === JaftingSalvageLedger.getMaterialArmorTypeId();
    const isWeaponMaterial = row.t === 'w'
      && equipDatum.isWeapon()
      && JaftingSalvageLedger.isMaterialWeaponDatum(equipDatum);

    if (isArmorMaterial === false && isWeaponMaterial === false)
    {
      return false;
    }

    flat.push(new JaftingSalvageLedgerRow(row.t, row.id, row.n));

    return true;
  }

  /**
   * Replaces each `w`/`a` row with that template's stamped ledger (scaled by row count), or drops it with no
   * ledger.<br>
   * Ingredient armors ({@link JaftingSalvageLedger.getMaterialArmorTypeId}) and configured material weapons keep bare
   * `a` / `w` refund lines when the template
   * carries no nested ledger—those rows are refinement materials, not vendor-only equipment shells.<br>
   * {@link visited} breaks cycles if a ledger ever references itself transitively.
   *
   * @param {JaftingSalvageLedgerRow[]|{ t: string, id: number, n: number, banned?: boolean }[]} rows
   * @param {Record<string, boolean>} visited
   * @returns {JaftingSalvageLedgerRow[]}
   */
  static expandWeaponArmorRowsForSalvage(rows, visited)
  {
    const flat = [];

    for (let i = 0; i < rows.length; i++)
    {
      const row = rows[i];

      // banned rows stay in the stream so UI can dim them—refund skips happen later in {@link
      // JaftingSalvageManager.refundLedgerRows}.
      if (row.banned === true)
      {
        flat.push(new JaftingSalvageLedgerRow(row.t, row.id, row.n, true));

        continue;
      }

      // gold / items / SDP letters never recurse—copy forward as-is.
      if (row.t !== 'w' && row.t !== 'a')
      {
        flat.push(new JaftingSalvageLedgerRow(row.t, row.id, row.n));

        continue;
      }

      // equipment rows are the only ones that might hide a whole nested stamp under `$dataWeapons` / `$dataArmors`.
      const visitKey = `${row.t}:${row.id}`;

      if (visited[visitKey] === true)
      {
        continue;
      }

      visited[visitKey] = true;

      let equipDatum;

      if (row.t === 'w')
      {
        equipDatum = $dataWeapons[row.id];
      }
      else
      {
        equipDatum = $dataArmors[row.id];
      }

      if (!equipDatum)
      {
        continue;
      }

      const sub = JaftingSalvageManager.getLedgerForDatum(equipDatum);

      if (!sub || !sub.rows || sub.rows.length === 0)
      {
        // refinement stamps monster-part donors as bare rows—those templates usually have **no** nested ledger.
        // treat them like `i` rows here so dismantle still refunds the physical gear instead of vanishing the row.
        JaftingSalvageManager.tryPushMaterialEquipmentPassThrough(flat, row, equipDatum);

        continue;
      }

      const innerMerged = JaftingSalvageLedger.mergeDuplicateRows(JaftingSalvageLedger.cloneRows(sub.rows));
      const innerExpanded = JaftingSalvageManager.expandWeaponArmorRowsForSalvage(innerMerged, visited);
      // outer row count stacks identical stamped units—scale every unpacked ingredient line by that stack factor.
      const mult = row.n;

      for (let j = 0; j < innerExpanded.length; j++)
      {
        const ir = innerExpanded[j];
        const piece = new JaftingSalvageLedgerRow(ir.t, ir.id, ir.n * mult, ir.banned === true);

        flat.push(piece);
      }
    }

    return JaftingSalvageLedger.mergeDuplicateRows(flat);
  }

  /**
   * Candidate datums that may enter the salvage scene list.
   *
   * @returns {RPG_Base[]}
   */
  static getSalvageCandidateDatums()
  {
    // salvage UI wants every dismantle-eligible party row—ledger must survive expansion or the datum is filtered out.
    const all = $gameParty.allItems();
    const out = [];

    for (let i = 0; i < all.length; i++)
    {
      const datum = all[i];

      if (!datum)
      {
        continue;
      }

      if ($gameParty.numItems(datum) < 1)
      {
        continue;
      }

      if (JaftingSalvageManager.datumHasSalvageLedger(datum) === false)
      {
        continue;
      }

      out.push(datum);
    }

    return out;
  }

  /**
   * Refunds every eligible row scaled by {@link amount}.<br>
   * v1 policy: 100% of eligible rows; banned rows skip.<br>
   * <br>
   * **Contract:** callers pass **already expanded** rows (see
   * {@link JaftingSalvageManager.getSalvageLedgerSnapshotExpanded})
   * so `w` / `a` lines here are leaf refunds—never whole crafted shells that still need unpacking. If you feed raw
   * storage, vendor rows could mint unintended items.
   *
   * @param {JaftingSalvageLedgerSnapshot|{ rows: JaftingSalvageLedgerRow[] }} ledger
   * @param {number} amount
   */
  static refundLedgerRows(ledger, amount)
  {
    if (amount < 1)
    {
      return;
    }

    for (let i = 0; i < ledger.rows.length; i++)
    {
      const row = ledger.rows[i];

      if (row.banned === true)
      {
        continue;
      }

      // `row.n` counts per **one** stamped unit—multiply by dismantle stack `amount` so bulk salvage scales refunds.
      const total = row.n * amount;

      // type letters stay aligned with {@link JaftingSalvageLedger.rowsFromCraftingComponents} stamping.
      if (row.t === 'i')
      {
        $gameParty.gainItem($dataItems[row.id], total);
      }
      else if (row.t === 'w')
      {
        $gameParty.gainItem($dataWeapons[row.id], total);
      }
      else if (row.t === 'a')
      {
        $gameParty.gainItem($dataArmors[row.id], total);
      }
      else if (row.t === 'g')
      {
        $gameParty.gainGold(total);
      }
      else if (row.t === 's')
      {
        // SDP letter mirrors crafting component vocabulary—every actor receives the same flat payout for v1.
        $gameParty.members()
          .forEach(actor => actor.modSdpPoints(total));
      }
    }
  }

  /**
   * Executes salvage for {@link amount} units of {@link datum}.
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} datum
   * @param {number} amount
   * @returns {boolean}
   */
  static executeSalvage(datum, amount)
  {
    const raw = JaftingSalvageManager.getLedgerForDatum(datum);

    if (!raw || !raw.rows || raw.rows.length === 0)
    {
      return false;
    }

    // expansion can drop every row (vendor-only `w`/`a` shells)—treat that as "nothing to dismantle" even if raw
    // storage still had a stamp for UI history.
    const snap = JaftingSalvageManager.getSalvageLedgerSnapshotExpanded(datum);

    if (!snap || !snap.rows || snap.rows.length === 0)
    {
      return false;
    }

    if (amount < 1)
    {
      return false;
    }

    if ($gameParty.numItems(datum) < amount)
    {
      return false;
    }

    // pay from expanded snapshot so vendor `w`/`a` lines never mint items—crafted lines unpack to ingredients.
    // still runs before `loseItem` so half-empty stacks cannot strand refunds if anything downstream throws.
    JaftingSalvageManager.refundLedgerRows(snap, amount);
    $gameParty.loseItem(datum, amount);

    return true;
  }

  /**
   * Party hook after items leave inventory — reclaim refinement slots when the last copy is gone.
   *
   * @param {RPG_Item|RPG_Weapon|RPG_Armor} itemDatum
   * @param {number} amountLost
   */
  static afterPartyLostItem(itemDatum, amountLost)
  {
    if (!itemDatum)
    {
      return;
    }

    if (amountLost < 1)
    {
      return;
    }

    if (itemDatum.id < JaftingSalvageManager.DynamicEquipIndexMin)
    {
      const key = JaftingSalvageManager.containerKeyFromDatum(itemDatum);

      if (key)
      {
        JaftingSalvageManager.initPartySalvageStorage();
        const bag = $gameParty._j._jafting._salvageLedgers[key];

        if (bag)
        {
          JaftingSalvageManager.coercePartyLedgerBagShapeForDatum(bag, itemDatum);
          JaftingSalvageManager.pruneEmptyPartyLedgerBag(key);
        }
      }
    }

    // stacks still hold quantity—scrub bookkeeping only once the final copy leaves (sell, salvage, plot, etc.).
    if ($gameParty.numItems(itemDatum) > 0)
    {
      return;
    }

    JaftingSalvageManager.clearLedgerForDatum(itemDatum);

    if (itemDatum.isWeapon() && itemDatum.id >= JaftingSalvageManager.DynamicEquipIndexMin)
    {
      JaftingSalvageManager.reclaimDynamicWeaponSlot(itemDatum);

      return;
    }

    if (itemDatum.isArmor() && itemDatum.id >= JaftingSalvageManager.DynamicEquipIndexMin)
    {
      JaftingSalvageManager.reclaimDynamicArmorSlot(itemDatum);
    }
  }

  /**
   * Removes refined weapon bookkeeping when the row is fully gone from inventory.
   *
   * @param {RPG_Weapon} weaponDatum
   */
  static reclaimDynamicWeaponSlot(weaponDatum)
  {
    const weapons = $gameParty.getRefinedWeapons();

    // refinement tracks spawned rows for save hydration—drop stale refs when the last copy sells or dismantles.
    for (let i = 0; i < weapons.length; i++)
    {
      if (weapons[i].index === weaponDatum.id)
      {
        weapons.splice(i, 1);
        break;
      }
    }

    $dataWeapons[weaponDatum.id] = RPG_Weapon.createEmpty(weaponDatum.id);
    JaftingSalvageManager.onAfterDynamicSlotReclaimed('weapon', weaponDatum.id);
  }

  /**
   * Removes refined armor bookkeeping when the row is fully gone from inventory.
   *
   * @param {RPG_Armor} armorDatum
   */
  static reclaimDynamicArmorSlot(armorDatum)
  {
    const armors = $gameParty.getRefinedArmors();

    // twin path to {@link reclaimDynamicWeaponSlot} for armor-shaped refinement outputs.
    for (let i = 0; i < armors.length; i++)
    {
      if (armors[i].index === armorDatum.id)
      {
        armors.splice(i, 1);
        break;
      }
    }

    $dataArmors[armorDatum.id] = RPG_Armor.createEmpty(armorDatum.id);
    JaftingSalvageManager.onAfterDynamicSlotReclaimed('armor', armorDatum.id);
  }
}

//endregion JaftingSalvageManager

//region DataManager
/**
 * Salvage ledger bags live on `$gameParty._j` — they must exist after the party object is real.<br>
 * Vanilla {@link Scene_Boot#onDatabaseLoaded} fires **before** {@link DataManager.createGameObjects}, so `$gameParty`
 * is still null there; explicit init belongs on {@link DataManager.createGameObjects} and on
 * {@link DataManager.extractSaveContents} after a loaded save replaces `$gameParty`.
 */
J.JAFTING.Aliased.DataManager.set('createGameObjects', DataManager.createGameObjects);
DataManager.createGameObjects = function()
{
  J.JAFTING.Aliased.DataManager.get('createGameObjects')
    .call(this);

  // new game, battle test, event test, and the throwaway party before `extractSaveContents` all pass through here.
  JaftingSalvageManager.initPartySalvageStorage();
};

J.JAFTING.Aliased.DataManager.set('extractSaveContents', DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents)
{
  J.JAFTING.Aliased.DataManager.get('extractSaveContents')
    .call(this, contents);

  // `JsonEx` swaps in the saved party instance—old saves may omit `_j`; normalize once on the hydrated object.
  JaftingSalvageManager.initPartySalvageStorage();
};
//endregion DataManager

//region Game_Party
/**
 * Extends {@link Game_Party.prototype.gainItem}.<br>
 * Keeps per-slot salvage ledgers aligned when static-template stacks grow outside crafting stamps.
 */
J.JAFTING.Aliased.Game_Party.set('gainItem', Game_Party.prototype.gainItem);
Game_Party.prototype.gainItem = function(item, amount, includeEquip)
{
  J.JAFTING.Aliased.Game_Party.get('gainItem')
    .call(this, item, amount, includeEquip);

  JaftingSalvageManager.afterPartyGainedItem(item, amount);
};

/**
 * Extends {@link Game_Party.prototype.loseItem}.<br>
 * Reclaims refinement datastore slots once dynamic equipment leaves inventory entirely.
 */
J.JAFTING.Aliased.Game_Party.set('loseItem', Game_Party.prototype.loseItem);
Game_Party.prototype.loseItem = function(item, amount, includeEquip)
{
  J.JAFTING.Aliased.Game_Party.get('loseItem')
    .call(this, item, amount, includeEquip);

  // delegate post-loss hygiene—dynamic refinement rows need datastore cleanup when the final copy disappears.
  JaftingSalvageManager.afterPartyLostItem(item, amount);
};
//endregion Game_Party

//region Scene_Jafting
class Scene_Jafting
  extends Scene_MenuBase
{
  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  /**
   * Constructor.
   */
  constructor()
  {
    // call super when having extended constructors.
    super();

    // jumpstart initialization on creation.
    this.initialize();
  }

  //region init
  /**
   * Initialize all properties for the root JAFTING hub scene.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    // initialize the root-namespace definition members.
    this.initCoreMembers();

    // initialize the primary list and header windows.
    this.initPrimaryMembers();
  }

  /**
   * The core properties of this scene are the root namespace definitions for this plugin.
   */
  initCoreMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * A grouping of all properties associated with this JAFTING scene.
     */
    this._j._crafting = {};
  }

  /**
   * The primary properties of the scene: the command list and header windows
   * for the root JAFTING menu.
   */
  initPrimaryMembers()
  {
    /**
     * The window that lists Salvage, Creation, Refinement, and other registered JAFTING modes.
     * @type {Window_JaftingList}
     */
    this._j._crafting._commandList = null;

    /**
     * The window that displays at the top while the JAFTING list is active.
     * @type {Window_JaftingListHeader}
     */
    this._j._crafting._listHeader = null;
  }

  //endregion init

  //region create
  /**
   * Initialize all resources required for this scene.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create the various display objects on the screen.
    this.createDisplayObjects();
  }

  /**
   * Creates the display objects for this scene.
   */
  createDisplayObjects()
  {
    // create all our windows.
    this.createAllWindows();
  }

  /**
   * Creates all windows associated with this scene.
   */
  createAllWindows()
  {
    // create all root windows for the main listing.
    this.createJaftingRootWindows();
  }

  //endregion create

  //region windows
  /**
   * Creates the root-level JAFTING hub windows.
   */
  createJaftingRootWindows()
  {
    this.createJaftingListWindow();

    // create the header window.
    this.createJaftingListHeaderWindow();
  }

  //region header window
  /**
   * Creates a header window for the JAFTING command list.
   */
  createJaftingListHeaderWindow()
  {
    // create the window.
    const window = this.buildJaftingListHeaderWindow();

    // update the tracker with the new window.
    this.setJaftingListHeaderWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the JAFTING list header window.
   * @returns {Window_JaftingListHeader}
   */
  buildJaftingListHeaderWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.jaftingListHeaderRectangle();

    // create the window with the rectangle.
    const window = new Window_JaftingListHeader(rectangle);

    window.refresh();

    return window;
  }

  /**
   * Gets the rectangle associated with the JAFTING list header window.
   * @returns {Rectangle}
   */
  jaftingListHeaderRectangle()
  {
    // define the width of the list.
    const width = 1000;

    // determine the x based on the width.
    const x = (Graphics.boxWidth / 2) - (width * 0.5);

    // define the height of the rectangle.
    const height = 100;

    // arbitrarily decide the y.
    const y = 100;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked JAFTING list header window.
   * @returns {Window_JaftingListHeader}
   */
  getJaftingListHeaderWindow()
  {
    return this._j._crafting._listHeader;
  }

  /**
   * Set the currently tracked JAFTING list header window to the given window.
   * @param {Window_JaftingListHeader} listHeaderWindow The header window to track.
   */
  setJaftingListHeaderWindow(listHeaderWindow)
  {
    this._j._crafting._listHeader = listHeaderWindow;
  }

  /**
   * Opens the root header window.
   */
  openRootHeaderWindow()
  {
    // grab the root header window.
    const rootHeaderWindow = this.getJaftingListHeaderWindow();

    // open and show the root header window.
    rootHeaderWindow.open();
    rootHeaderWindow.show();
  }

  /**
   * Closes the root header window.
   */
  closeRootHeaderWindow()
  {
    // grab the root header window.
    const rootHeaderWindow = this.getJaftingListHeaderWindow();

    // close and hide the root header window.
    rootHeaderWindow.close();
    rootHeaderWindow.hide();
  }

  //endregion header window

  //region list window
  /**
   * Creates the list of JAFTING modes available to the player.
   */
  createJaftingListWindow()
  {
    // create the window.
    const window = this.buildJaftingListWindow();

    // update the tracker with the new window.
    this.setJaftingListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the JAFTING command list window.
   * @returns {Window_JaftingList}
   */
  buildJaftingListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.jaftingListRectangle();

    // create the window with the rectangle.
    const window = new Window_JaftingList(rectangle);

    // assign cancel functionality.
    window.setHandler('cancel', this.popScene.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onRootJaftingSelection.bind(this));

    return window;
  }

  /**
   * Gets the rectangle associated with the JAFTING command list window.
   * @returns {Rectangle}
   */
  jaftingListRectangle()
  {
    // define the width of the list.
    const width = 800;

    // calculate the X for where the origin of the list window should be.
    const x = (Graphics.boxWidth / 2) - (width * 0.5);

    // define the height of the list.
    const height = 240;

    // calculate the Y for where the origin of the list window should be.
    const y = (Graphics.boxHeight / 2) - (height * 0.5);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked JAFTING command list window.
   * @returns {Window_JaftingList}
   */
  getJaftingListWindow()
  {
    return this._j._crafting._commandList;
  }

  /**
   * Set the currently tracked JAFTING command list window to the given window.
   * @param {Window_JaftingList} listWindow The list window to track.
   */
  setJaftingListWindow(listWindow)
  {
    this._j._crafting._commandList = listWindow;
  }

  /**
   * Opens the root list window and activates it.
   */
  openRootListWindow()
  {
    const rootListWindow = this.getJaftingListWindow();

    // open, show, and activate the root list window.
    rootListWindow.open();
    rootListWindow.show();
    rootListWindow.activate();
  }

  /**
   * Closes the root list window.
   */
  closeRootListWindow()
  {
    const rootListWindow = this.getJaftingListWindow();

    // close and deactivate the root list window.
    rootListWindow.close();
    rootListWindow.deactivate();
  }

  /**
   * Gets the current symbol of the root JAFTING list (the highlighted command key).
   * @returns {string}
   */
  getRootJaftingKey()
  {
    return this.getJaftingListWindow()
      .currentSymbol();
  }

  //endregion list window

  /**
   * Opens all windows associated with the root JAFTING hub.
   */
  openRootJaftingWindows()
  {
    // open the root list window.
    this.openRootListWindow();

    // open the root header window.
    this.openRootHeaderWindow();
  }

  /**
   * Closes all windows associated with the root JAFTING hub.
   */
  closeRootJaftingWindows()
  {
    // close the list window.
    this.closeRootListWindow();

    // close the header window.
    this.closeRootHeaderWindow();
  }

  //endregion windows

  //region actions
  //region root actions
  /**
   * When a jafting choice is made, execute this logic.
   * This is only implemented/extended by the jafting types.
   */
  onRootJaftingSelection()
  {
  }

  //endregion root actions
  //endregion actions
}

//endregion Scene_Jafting

//region Scene_JaftingSalvage
/**
 * First-class salvage scene: pick a stamped item, preview refunds, confirm destruction.
 */
class Scene_JaftingSalvage
  extends Scene_MenuBase
{
  /**
   * How many stamped units one confirmation dismantles (stack splitting can grow this later).
   */
  static DismantleBatchSize = 1;

  /**
   * Hub / handler symbol for {@link Window_JaftingList} and {@link Scene_Jafting#onRootJaftingSelection}.
   * @type {string}
   */
  static KEY = 'jafting-salvage';

  /**
   * Whether the root JAFTING menu should allow choosing Salvage (plugin command {@code call-salvage} ignores this).
   * Switch id {@code 0} skips the gate so designers can leave the parameter unset.
   *
   * @returns {boolean}
   */
  static isSalvageHubCommandEnabled()
  {
    const switchId = J.JAFTING.Metadata.salvageMenuSwitchId;

    if (switchId === 0)
    {
      return true;
    }

    return $gameSwitches.value(switchId);
  }

  /**
   * Opens the salvage workflow.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  /**
   * Constructor.
   */
  constructor()
  {
    super();
  }

  /**
   * Spawns the window layer, background, and salvage UI.
   */
  create()
  {
    Scene_MenuBase.prototype.create.call(this);

    // tracks last highlighted datum + stack so preview repaints after dismantle without waiting for cursor moves.
    this._lastPreviewDatum = null;
    this._lastPreviewStack = null;
    this.createSalvageWindows();
  }

  /**
   * Softens the map backdrop similar to other JAFTING scenes.
   */
  createBackground()
  {
    this._backgroundFilter = new PIXI.filters.AlphaFilter(0.1);
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [ this._backgroundFilter ];
    this.addChild(this._backgroundSprite);
  }

  /**
   * Suppresses touch UI chrome for parity with Creation / Refinement scenes.
   */
  createButtons()
  {
  }

  /**
   * Builds list, preview, and confirmation chrome.
   */
  createSalvageWindows()
  {
    const candidateRect = this.salvageCandidateWindowRect();
    const previewRect = this.salvagePreviewWindowRect();
    const confirmRect = this.salvageConfirmationWindowRect();

    this._candidateWindow = new Window_SalvageCandidateList(candidateRect);
    this._candidateWindow.setHandler('ok', this.onSalvageCandidateOk.bind(this));
    this._candidateWindow.setHandler('cancel', this.popScene.bind(this));

    this._previewWindow = new Window_SalvagePreview(previewRect);

    this._confirmationWindow = new Window_SalvageConfirmation(confirmRect);
    this._confirmationWindow.setHandler('confirm', this.onSalvageConfirmOk.bind(this));
    this._confirmationWindow.setHandler('cancel', this.onSalvageConfirmCancel.bind(this));

    // modal sits invisible until the player commits on the candidate list—mirrors refinement confirmation layering.
    this._confirmationWindow.hide();
    this._confirmationWindow.deactivate();

    this.addWindow(this._candidateWindow);
    this.addWindow(this._previewWindow);
    this.addWindow(this._confirmationWindow);

    this._previewWindow.setDismantleAmount(Scene_JaftingSalvage.DismantleBatchSize);
    // initial rects come from salvage*WindowRect(); real panel placement waits for start() after refresh()
    // so the candidate cursor (and thus refund row counts) exist—see refreshPreviewFromSelection().
  }

  /**
   * Shared width for the candidate column so create-time rects match {@link #layoutSalvagePanels}.
   *
   * @returns {number}
   */
  salvageCandidateListWidth()
  {
    return Math.min(440, Math.max(280, Math.floor(Graphics.boxWidth * 0.34)));
  }

  /**
   * Preview pane width: never eats the whole screen—refund text rarely needs more than half the box.
   *
   * @param {number} previewX left edge of the preview window in screen space
   * @returns {number}
   */
  salvagePreviewBandWidth(previewX)
  {
    const margin = 18;
    const fullRight = Graphics.boxWidth - margin - previewX;
    const widthCap = Math.min(560, Math.floor(Graphics.boxWidth * 0.48));

    // keep a readable floor when there is room, but never wider than the space to the right edge.
    return Math.min(fullRight, Math.max(200, Math.min(widthCap, fullRight)));
  }

  /**
   * Vertical band shared by the salvage list and preview (full height above the confirm row).
   *
   * @returns {{ topY: number, bandH: number }}
   */
  salvageClusterVerticalBand()
  {
    const topY = 40;
    const confirmRect = this.salvageConfirmationWindowRect();
    const bandBottom = confirmRect.y - 16;
    const bandH = Math.max(160, bandBottom - topY);

    return { topY, bandH };
  }

  /**
   * Places the candidate list and preview as one horizontal cluster, centered with side margins.<br>
   * Iterates a few times because {@link #salvagePreviewBandWidth} depends on the preview's screen-x
   * (free space to the right edge).
   *
   * @returns {{ listX: number, listW: number, previewX: number, previewW: number, topY: number, bandH: number }}
   */
  salvageClusterStripLayout()
  {
    const margin = 18;
    const gapMid = 16;
    const { topY, bandH } = this.salvageClusterVerticalBand();
    const listW = this.salvageCandidateListWidth();
    // seed from the old left rail—usually settles in one or two passes once the capped preview width is known.
    let listX = margin;

    for (let iter = 0; iter < 8; iter++)
    {
      const previewX = listX + listW + gapMid;
      const previewW = this.salvagePreviewBandWidth(previewX);
      const totalW = listW + gapMid + previewW;
      const idealX = Math.floor((Graphics.boxWidth - totalW) / 2);
      const maxLeft = Graphics.boxWidth - margin - totalW;
      const nextX = Math.max(margin, Math.min(idealX, maxLeft));

      if (nextX === listX)
      {
        return {
          listX,
          listW,
          previewX,
          previewW,
          topY,
          bandH,
        };
      }

      listX = nextX;
    }

    const previewX = listX + listW + gapMid;
    const previewW = this.salvagePreviewBandWidth(previewX);

    return {
      listX,
      listW,
      previewX,
      previewW,
      topY,
      bandH,
    };
  }

  /**
   * Candidate list on the left, salvage preview on the right—both use the full vertical band above confirm (no scroll).
   */
  layoutSalvagePanels()
  {
    const strip = this.salvageClusterStripLayout();
    const {
      listX, listW, previewX, previewW, topY, bandH,
    } = strip;

    this._candidateWindow.move(listX, topY, listW, bandH);

    const preview = this._previewWindow;
    const item = this._candidateWindow.item();
    const n = JaftingSalvageManager.visibleExpandedRefundRowCount(item);
    const linesSingle = JaftingSalvageManager.layoutPreviewLineCountSingle(item);
    const linesTwo = JaftingSalvageManager.layoutPreviewLineCountTwoColumn(item);
    const desiredSingle = preview.fittingHeight(linesSingle);
    const desiredTwo = preview.fittingHeight(linesTwo);

    let useTwoCol = false;

    if (desiredSingle > bandH && n > 1 && desiredTwo <= bandH)
    {
      useTwoCol = true;
    }
    else if (desiredSingle > bandH && n > 1)
    {
      useTwoCol = true;
    }

    preview.setRefundTwoColumnMode(useTwoCol);
    preview.move(previewX, topY, previewW, bandH);
  }

  /**
   * @returns {Rectangle}
   */
  salvageCandidateWindowRect()
  {
    const s = this.salvageClusterStripLayout();

    return new Rectangle(s.listX, s.topY, s.listW, s.bandH);
  }

  /**
   * @returns {Rectangle}
   */
  salvagePreviewWindowRect()
  {
    const s = this.salvageClusterStripLayout();

    return new Rectangle(s.previewX, s.topY, s.previewW, s.bandH);
  }

  /**
   * @returns {Rectangle}
   */
  salvageConfirmationWindowRect()
  {
    const width = 420;
    const height = this.calcWindowHeight(2, true);
    const x = (Graphics.boxWidth - width) / 2;
    const y = Graphics.boxHeight - height - 24;

    return new Rectangle(x, y, width, height);
  }

  /**
   * Starts interaction on the candidate list.
   */
  start()
  {
    Scene_MenuBase.prototype.start.call(this);
    this._candidateWindow.open();
    this._previewWindow.open();
    this._confirmationWindow.open();
    this._candidateWindow.refresh();
    this._candidateWindow.activate();
    // windows already exist—now the list has a valid index, so we can move panes and sync preview in one pass.
    this.refreshPreviewFromSelection();
  }

  /**
   * Keeps the preview pane synced with the active cursor row.
   */
  update()
  {
    Scene_MenuBase.prototype.update.call(this);

    if (this._candidateWindow && this._candidateWindow.active)
    {
      const item = this._candidateWindow.item();
      const stack = item ? $gameParty.numItems(item) : 0;

      if (item !== this._lastPreviewDatum || stack !== this._lastPreviewStack)
      {
        this._lastPreviewDatum = item;
        this._lastPreviewStack = stack;
        this.layoutSalvagePanels();
        this._previewWindow.setDatum(item);
      }
    }
  }

  /**
   * Requests confirmation before dismantling the highlighted entry.
   */
  onSalvageCandidateOk()
  {
    const datum = this._candidateWindow.item();

    if (datum === undefined || datum === null)
    {
      SoundManager.playBuzzer();

      return;
    }

    this._confirmationWindow.show();
    this._confirmationWindow.select(0);
    this._confirmationWindow.activate();
    this._candidateWindow.deactivate();
  }

  /**
   * Confirms salvage execution for a single unit.
   */
  onSalvageConfirmOk()
  {
    const datum = this._candidateWindow.item();

    if (datum === undefined || datum === null)
    {
      SoundManager.playBuzzer();
      this.onSalvageConfirmCancel();

      return;
    }

    const ok = JaftingSalvageManager.executeSalvage(datum, Scene_JaftingSalvage.DismantleBatchSize);

    if (ok === false)
    {
      SoundManager.playBuzzer();
    }
    else
    {
      SoundManager.playUseItem();
    }

    this._candidateWindow.refresh();

    this.refreshPreviewFromSelection();
    this.onSalvageConfirmCancel();
  }

  /**
   * Closes the confirmation layer and returns focus to the list.
   */
  onSalvageConfirmCancel()
  {
    this._confirmationWindow.hide();
    this._confirmationWindow.deactivate();
    this._candidateWindow.activate();
  }

  /**
   * Forces preview regeneration after list mutations.
   */
  refreshPreviewFromSelection()
  {
    const item = this._candidateWindow.item();
    const stack = item ? $gameParty.numItems(item) : 0;

    this._lastPreviewDatum = item;
    this._lastPreviewStack = stack;
    this.layoutSalvagePanels();
    this._previewWindow.setDatum(item);
  }
}

/**
 * Routes the Salvage hub row before Creation / Refinement extensions chain their own keys.<br>
 * The alias map is created in core `_metadata/initialization.js` so this `.set` runs after that file loads.
 */
J.JAFTING.Aliased.Scene_Jafting.set('onRootJaftingSelection', Scene_Jafting.prototype.onRootJaftingSelection);
Scene_Jafting.prototype.onRootJaftingSelection = function()
{
  const currentSelection = this.getRootJaftingKey();

  if (currentSelection === Scene_JaftingSalvage.KEY)
  {
    this.jaftingSalvageSelected();
  }
  else
  {
    J.JAFTING.Aliased.Scene_Jafting.get('onRootJaftingSelection').call(this);
  }
};

/**
 * Leaves the hub chrome on the stack and pushes dismantle UI—mirrors {@link Scene_JaftingCreate.callScene} flow.
 */
Scene_Jafting.prototype.jaftingSalvageSelected = function()
{
  this.closeRootJaftingWindows();

  Scene_JaftingSalvage.callScene();
};

//endregion Scene_JaftingSalvage

//region Window_JaftingList
/**
 * Root JAFTING hub list: commands registered by Creation, Refinement, and other extensions.
 */
class Window_JaftingList
  extends Window_Command
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Implements {@link #makeCommandList}.<br>
   * Builds the hub command list from {@link #buildCommands}.
   */
  makeCommandList()
  {
    const commands = this.buildCommands();

    // add all the built commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Returns hub commands: core registers Salvage first; Creation / Refinement extensions append after this list.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    return [ this.buildSalvageHubCommand() ];
  }

  /**
   * Salvage hub row—opens {@link Scene_JaftingSalvage} (same entry point as plugin command {@code call-salvage}).
   * @returns {BuiltWindowCommand}
   */
  buildSalvageHubCommand()
  {
    return new WindowCommandBuilder(J.JAFTING.Metadata.salvageCommandName)
      .setSymbol(Scene_JaftingSalvage.KEY)
      .setEnabled(Scene_JaftingSalvage.isSalvageHubCommandEnabled())
      .addTextLine('Break down stamped equipment toward its ingredient history.')
      .addTextLine('Vendor-only shells never list here—only gear carrying dismantle lineage.')
      .setIconIndex(J.JAFTING.Metadata.salvageMenuIconIndex)
      .build();
  }

  /**
   * Overrides {@link #itemHeight}.<br>
   * Makes the command rows bigger so there can be additional lines.
   * @returns {number}
   */
  itemHeight()
  {
    return this.lineHeight() * 2;
  }
}

//endregion Window_JaftingList

//region Window_JaftingListHeader
class Window_JaftingListHeader
  extends Window_Base
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Implements {@link Window_Base.drawContent}.<br>
   * Draws the JAFTING hub title and short description.
   */
  drawContent()
  {
    // define the origin x,y coordinates.
    const [ x, y ] = [ 0, 0 ];

    // shorthand the lineHeight.
    const lh = this.lineHeight();

    // draw the header.
    this.drawHeader(x, y);

    // draw the detail under the header.
    const detailY = y + (lh * 1);
    this.drawDetail(x, detailY);
  }

  /**
   * Draws the header text.
   * @param {number} x The base x coordinate for this section.
   * @param {number} y The base y coordinate for this section.
   */
  drawHeader(x, y)
  {
    // make the font size nice and big.
    this.modFontSize(10);

    // define the text for this section.
    const headerText = 'The Jafting System';

    // when using "center"-alignment, you center across the width of the window.
    const headerTextWidth = this.width;

    // enable italics.
    this.toggleBold(true);

    // render the headline title text.
    this.drawText(headerText, x, y, headerTextWidth, "center");

    // reset any lingering font settings.
    this.resetFontSettings();
  }

  /**
   * Draws the detail text.
   * @param {number} x The base x coordinate for this section.
   * @param {number} y The base y coordinate for this section.
   */
  drawDetail(x, y)
  {
    // define the text for this section.
    const detailText = 'Item Creation of all kinds, at your doorstep.';

    // when using "center"-alignment, you center across the width of the window.
    const detailTextWidth = this.width;

    // enable italics.
    this.toggleItalics(true);

    // render the headline title text.
    this.drawText(detailText, x, y, detailTextWidth, "center");

    // reset any lingering font settings.
    this.resetFontSettings();
  }
}

//endregion Window_JaftingListHeader

//region Window_SalvageCandidateList
/**
 * Lists inventory rows that currently carry a JAFTING salvage ledger.
 */
class Window_SalvageCandidateList
  extends Window_Selectable
{
  /**
   * @param {Rectangle} rect Window geometry.
   */
  constructor(rect)
  {
    super(rect);
    this._data = [];
  }

  /**
   * @returns {number}
   */
  maxItems()
  {
    return this._data.length;
  }

  /**
   * @returns {RPG_Item|RPG_Weapon|RPG_Armor|undefined}
   */
  item()
  {
    return this._data[this.index()];
  }

  /**
   * Rebuilds the backing datums from {@link JaftingSalvageManager.getSalvageCandidateDatums}.
   */
  makeItemList()
  {
    // anything lacking a ledger never appears—salvage stays honest about stamped gear only.
    this._data = JaftingSalvageManager.getSalvageCandidateDatums();
  }

  /**
   * Refreshes selectable entries.
   */
  refresh()
  {
    const prevIndex = this.index();

    this.makeItemList();

    Window_Selectable.prototype.refresh.call(this);

    // after dismantle the list shrinks—clamp so `item()` stays valid and the preview can repaint.
    if (this.maxItems() < 1)
    {
      this.select(-1);

      return;
    }

    if (prevIndex < 0)
    {
      this.select(0);

      return;
    }

    if (prevIndex >= this.maxItems())
    {
      this.select(this.maxItems() - 1);
    }
  }

  /**
   * @param {number} index Draw index.
   */
  drawItem(index)
  {
    const datum = this._data[index];

    if (datum === undefined || datum === null)
    {
      return;
    }

    const rect = this.itemLineRect(index);

    this.resetTextColor();
    this.changePaintOpacity(true);
    this.drawIcon(datum.iconIndex, rect.x + 2, rect.y + 2);
    this.drawText(datum.name, rect.x + 40, rect.y, rect.width - 40);
  }
}

//endregion Window_SalvageCandidateList

//region Window_SalvageConfirmation
/**
 * Confirms execution of salvage so players cannot accidentally dismantle gear.
 */
class Window_SalvageConfirmation
  extends Window_Command
{
  /**
   * @param {Rectangle} rect Window geometry.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Builds confirm/cancel commands.
   */
  makeCommandList()
  {
    // symbols stay terse—scene handlers map ok/cancel semantics onto these keys.
    this.addCommand('Salvage now', 'confirm', true);
    this.addCommand('Nevermind', 'cancel', true);
  }
}

//endregion Window_SalvageConfirmation

//region Window_SalvagePreview
/**
 * Refund breakdown for the highlighted salvage candidate—icons and name colors match standard {@link Window_Base}
 * item drawing so the pane reads like the rest of the engine menus.<br>
 * {@link Scene_JaftingSalvage} places this window full-height beside the list with a capped width;
 * {@link JaftingSalvageManager} expands nested `w`/`a` ledger rows into ingredients for display and payout.
 */
class Window_SalvagePreview
  extends Window_Base
{
  /**
   * @param {Rectangle} rect Window geometry (repositioned by {@link Scene_JaftingSalvage#layoutSalvagePanels}).
   */
  constructor(rect)
  {
    super(rect);
    this._datum = null;
    this._dismantleAmount = 1;
    this._refundTwoColumn = false;
  }

  /**
   * When true, refund rows render in two columns so more components fit without scrolling.
   *
   * @param {boolean} flag
   */
  setRefundTwoColumnMode(flag)
  {
    this._refundTwoColumn = flag === true;
  }

  /**
   * How many stamped units one confirm action dismantles (must match {@link Scene_JaftingSalvage.DismantleBatchSize}).
   *
   * @param {number} amount
   */
  setDismantleAmount(amount)
  {
    if (amount < 1)
    {
      this._dismantleAmount = 1;
    }
    else
    {
      this._dismantleAmount = amount;
    }
  }

  /**
   * @param {RPG_Item|RPG_Weapon|RPG_Armor|null} datum
   */
  setDatum(datum)
  {
    this._datum = datum;
    this.refresh();
  }

  /**
   * Renders stack context, dismantle batch size, and scaled refund lines (expanded snapshot).
   */
  refresh()
  {
    // refreshes can beat window open—ensure contents exist before drawing preview lines.
    if (!this.contents)
    {
      this.createContents();
    }

    this.contents.clear();

    if (this._datum === null || this._datum === undefined)
    {
      this.drawText('Select an item to preview refunds.', 0, 0, this.contentsWidth(), 'left');

      return;
    }

    const raw = JaftingSalvageManager.getLedgerForDatum(this._datum);

    if (!raw || !raw.rows || raw.rows.length === 0)
    {
      this.drawText('Nothing recoverable is stamped on this item.', 0, 0, this.contentsWidth(), 'left');

      return;
    }

    const snap = JaftingSalvageManager.getSalvageLedgerSnapshotExpanded(this._datum);

    if (!snap || !snap.rows || snap.rows.length === 0)
    {
      this.drawText(
        'Stamped, but every weapon/armor line was vendor-only—nothing returns when dismantled.',
        0,
        0,
        this.contentsWidth(),
        'left',
      );

      return;
    }

    const visibleRows = Window_SalvagePreview.collectNonBannedRows(snap.rows);

    const stack = $gameParty.numItems(this._datum);
    const batch = this._dismantleAmount;
    let y = 0;
    const lh = this.lineHeight();
    const countCol = 72;
    const nameW = this.contentsWidth() - countCol;

    this.changeTextColor(ColorManager.systemColor());
    this.drawText('Selected item', 0, y, this.contentsWidth(), 'left');
    y += lh;
    this.resetTextColor();
    this.drawItemName(this._datum, 0, y, nameW);
    this.drawText(`×${stack}`, nameW, y, countCol, 'right');
    y += lh;

    this.changeTextColor(ColorManager.systemColor());

    if (batch === 1)
    {
      this.drawText('Refund after dismantling ×1 unit:', 0, y, this.contentsWidth(), 'left');
    }
    else
    {
      this.drawText(`Refund after dismantling ×${batch} units:`, 0, y, this.contentsWidth(), 'left');
    }

    y += lh;
    this.resetTextColor();

    this.paintExpandedRefundRows(y, visibleRows, batch, lh, countCol, nameW);
  }

  /**
   * @param {object[]} rows
   * @returns {object[]}
   */
  static collectNonBannedRows(rows)
  {
    const out = [];

    for (let i = 0; i < rows.length; i++)
    {
      const row = rows[i];

      if (row.banned === true)
      {
        continue;
      }

      out.push(row);
    }

    return out;
  }

  /**
   * @param {number} y
   * @param {object[]} visibleRows
   * @param {number} batch
   * @param {number} lh
   * @param {number} countCol
   * @param {number} nameW
   */
  paintExpandedRefundRows(y, visibleRows, batch, lh, countCol, nameW)
  {
    if (this._refundTwoColumn === false)
    {
      this.paintExpandedRefundRowsSingle(y, visibleRows, batch, lh, countCol, nameW);

      return;
    }

    this.paintExpandedRefundRowsDouble(y, visibleRows, batch, lh);
  }

  /**
   * @param {number} y
   * @param {object[]} visibleRows
   * @param {number} batch
   * @param {number} lh
   * @param {number} countCol
   * @param {number} nameW
   */
  paintExpandedRefundRowsSingle(y, visibleRows, batch, lh, countCol, nameW)
  {
    let yy = y;
    let rendered = 0;

    for (let i = 0; i < visibleRows.length; i++)
    {
      if (yy + lh > this.contentsHeight())
      {
        break;
      }

      yy = this.drawLedgerRefundRow(visibleRows[i], 0, yy, batch, lh, countCol, nameW, this.contentsWidth());
      rendered++;
    }

    if (rendered < visibleRows.length && yy + lh <= this.contentsHeight())
    {
      const more = visibleRows.length - rendered;

      this.changeTextColor(ColorManager.systemColor());
      this.drawText(`+${more} more refunds.`, 0, yy, this.contentsWidth(), 'left');
      this.resetTextColor();
    }
  }

  /**
   * @param {number} y
   * @param {object[]} visibleRows
   * @param {number} batch
   * @param {number} lh
   */
  paintExpandedRefundRowsDouble(y, visibleRows, batch, lh)
  {
    let yy = y;
    const gutter = 12;
    const colW = Math.floor((this.contentsWidth() - gutter) / 2);
    const ccL = Math.min(56, Math.floor(colW * 0.28));
    const nwL = colW - ccL;
    const ccR = Math.min(56, Math.floor(colW * 0.28));
    const nwR = colW - ccR;
    let rendered = 0;

    for (let i = 0; i < visibleRows.length; i += 2)
    {
      if (yy + lh > this.contentsHeight())
      {
        break;
      }

      const rowL = visibleRows[i];
      const rowR = visibleRows[i + 1];
      const rowY = yy;

      yy = this.drawLedgerRefundRow(rowL, 0, rowY, batch, lh, ccL, nwL, colW);
      rendered++;

      if (rowR)
      {
        this.drawLedgerRefundRow(rowR, colW + gutter, rowY, batch, lh, ccR, nwR, colW);
        rendered++;
      }

      yy += lh;
    }

    if (rendered < visibleRows.length && yy + lh <= this.contentsHeight())
    {
      const more = visibleRows.length - rendered;

      this.changeTextColor(ColorManager.systemColor());
      this.drawText(`+${more} more refunds.`, 0, yy, this.contentsWidth(), 'left');
      this.resetTextColor();
    }
  }

  /**
   * @param {RPG_Item|RPG_Weapon|RPG_Armor|null|undefined} datum
   * @returns {number}
   */
  static previewContentLineCount(datum)
  {
    return JaftingSalvageManager.layoutPreviewLineCountSingle(datum);
  }

  /**
   * @param {RPG_Item|RPG_Weapon|RPG_Armor|null|undefined} datum
   * @returns {number}
   */
  static previewContentLineCountTwoColumn(datum)
  {
    return JaftingSalvageManager.layoutPreviewLineCountTwoColumn(datum);
  }

  /**
   * @param {RPG_Item|RPG_Weapon|RPG_Armor|null|undefined} datum
   * @returns {number}
   */
  static countVisibleRefundRowsForDatum(datum)
  {
    return JaftingSalvageManager.visibleExpandedRefundRowCount(datum);
  }

  /**
   * @param {{ t: string, id: number, n: number, banned?: boolean }} row
   * @param {number} baseX
   * @param {number} y
   * @param {number} dismantleBatch
   * @param {number} lh
   * @param {number} countCol
   * @param {number} nameW
   * @param {number} colInnerW width budget for this column (drawItemName + count).
   * @returns {number} next Y below this row.
   */
  drawLedgerRefundRow(row, baseX, y, dismantleBatch, lh, countCol, nameW, colInnerW)
  {
    const qty = row.n * dismantleBatch;
    const nameWClamped = Math.max(40, colInnerW - countCol);

    if (row.t === 'i' || row.t === 'w' || row.t === 'a')
    {
      const datum = Window_SalvagePreview.databaseDatumForRow(row);

      if (datum === null || datum === undefined)
      {
        this.drawText(`(missing) ×${qty}`, baseX, y, colInnerW, 'left');

        return y + lh;
      }

      this.drawItemName(datum, baseX, y, nameWClamped);
      this.drawText(`×${qty}`, baseX + nameWClamped, y, countCol, 'right');

      return y + lh;
    }

    if (row.t === 'g')
    {
      this.drawCurrencyValue(String(qty), TextManager.currencyUnit, baseX, y, colInnerW);

      return y + lh;
    }

    if (row.t === 's')
    {
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(TextManager.sdpPoints(), baseX, y, colInnerW - countCol, 'left');
      this.resetTextColor();
      this.drawText(String(qty), baseX + nameWClamped, y, countCol, 'right');

      return y + lh;
    }

    this.drawText(`Unknown ×${qty}`, baseX, y, colInnerW, 'left');

    return y + lh;
  }

  /**
   * @param {{ t: string, id: number, n: number }} row
   * @returns {RPG_Item|RPG_Weapon|RPG_Armor|null}
   */
  static databaseDatumForRow(row)
  {
    if (row.t === 'i')
    {
      return $dataItems[row.id];
    }

    if (row.t === 'w')
    {
      return $dataWeapons[row.id];
    }

    if (row.t === 'a')
    {
      return $dataArmors[row.id];
    }

    return null;
  }
}

//endregion Window_SalvagePreview

//# sourceMappingURL=J-JAFTING.js.map
