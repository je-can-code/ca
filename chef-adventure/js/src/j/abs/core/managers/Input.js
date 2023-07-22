//TODO: move these to the input manager?
//region Input
/**
 * The mappings of the gamepad descriptions to their buttons.
 */
J.ABS.Input = {};

// this section of inputs is an attempt to align with the internal RMMZ mapping convention.
J.ABS.Input.DirUp = "up";
J.ABS.Input.DirDown = "down";
J.ABS.Input.DirLeft = "left";
J.ABS.Input.DirRight = "right";
J.ABS.Input.Mainhand = "ok";
J.ABS.Input.Offhand = "cancel";
J.ABS.Input.Dash = "shift";
J.ABS.Input.Tool = "tab";
J.ABS.Input.GuardTrigger = "pagedown";
J.ABS.Input.SkillTrigger = "pageup";

// this section of inputs are newly implemented, and thus shouldn't
J.ABS.Input.MobilitySkill = "r2";
J.ABS.Input.StrafeTrigger = "l2";
J.ABS.Input.Quickmenu = "start";
J.ABS.Input.PartyCycle = "select";
J.ABS.Input.Debug = "cheat";

// for gamepads, these buttons are tracked, but aren't used by JABS right now.
J.ABS.Input.R3 = "r3";
J.ABS.Input.L3 = "l3";

// for keyboards, these buttons are for direct combatskill usage.
J.ABS.Input.CombatSkill1 = "combat-skill-1";
J.ABS.Input.CombatSkill2 = "combat-skill-2";
J.ABS.Input.CombatSkill3 = "combat-skill-3";
J.ABS.Input.CombatSkill4 = "combat-skill-4";

/**
 * OVERWRITE Defines gamepad button input to instead perform the various
 * actions that are expected in this ABS.
 *
 * This includes:
 * - D-Pad up, down, left, right
 * - A/cross, B/circle, X/square, Y/triangle
 * - L1/LB, R1/RB
 * - NEW: select/options, start/menu
 * - NEW: L2/LT, R2/RT
 * - NEW: L3/LSB, R3/RSB
 * - OVERWRITE: Y now is the tool button, and start is the menu.
 */
Input.gamepadMapper = {
  0: J.ABS.Input.Mainhand,      // cross
  1: J.ABS.Input.Offhand,        // circle
  2: J.ABS.Input.Dash,          // square
  3: J.ABS.Input.Tool,          // triangle

  4: J.ABS.Input.SkillTrigger,  // left bumper
  5: J.ABS.Input.GuardTrigger,  // right bumper
  6: J.ABS.Input.StrafeTrigger, // left trigger
  7: J.ABS.Input.MobilitySkill, // right trigger

  8: J.ABS.Input.PartyCycle,        // select
  9: J.ABS.Input.Quickmenu,         // start

  10: J.ABS.Input.L3,           // left stick button
  11: J.ABS.Input.R3,           // right stick button

  12: J.ABS.Input.DirUp,        // d-pad up
  13: J.ABS.Input.DirDown,      // d-pad down
  14: J.ABS.Input.DirLeft,      // d-pad left
  15: J.ABS.Input.DirRight,     // d-pad right
  // the analog stick should be natively supported for movement.
};

/**
 * Extends the existing mapper for keyboards to accommodate for the
 * additional skill inputs that are used for gamepads.
 */
Input.keyMapper = {
  // define the original keyboard mapping.
  ...Input.keyMapper,

  // this is the new debug move-through for use with JABS.
  192: J.ABS.Input.Debug,       // ` (backtick)

  // core buttons.
  90: J.ABS.Input.Mainhand,     // z
  88: J.ABS.Input.Offhand,      // x
  16: J.ABS.Input.Dash,         // shift (overwrite)
  67: J.ABS.Input.Tool,         // c

  // functional buttons.
  81: J.ABS.Input.SkillTrigger, // q
  17: J.ABS.Input.StrafeTrigger,// ctrl
  69: J.ABS.Input.GuardTrigger, // e
  9: J.ABS.Input.MobilitySkill,// tab (overwrite)

  // quickmenu button.
  13: J.ABS.Input.Quickmenu,    // enter (overwrite)

  // party cycling button.
  46: J.ABS.Input.PartyCycle,   // del

  // movement buttons.
  38: J.ABS.Input.DirUp,        // arrow up
  40: J.ABS.Input.DirDown,      // arrow down
  37: J.ABS.Input.DirLeft,      // arrow left
  39: J.ABS.Input.DirRight,     // arrow right

  // keyboard alternative for the multi-button skills.
  49: J.ABS.Input.CombatSkill1,       // 1 = L1 + cross
  50: J.ABS.Input.CombatSkill2,       // 2 = L1 + circle
  51: J.ABS.Input.CombatSkill3,       // 3 = L1 + square
  52: J.ABS.Input.CombatSkill4,       // 4 = L1 + triangle
};
//endregion Input