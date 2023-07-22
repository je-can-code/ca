//region Input
/**
 * Extends the existing mapper for keyboards to accommodate for the
 * additional skill inputs that are used for gamepads.
 */
Input.keyMapper = {
  // define the original keyboard mapping.
  ...Input.keyMapper,

  // core buttons.
  90: J.ABS.Input.Mainhand,     // z
  88: J.ABS.Input.Offhand,      // x
  16: J.ABS.Input.Dash,        // shift (already defined)
  67: J.ABS.Input.Tool,         // c

  // functional buttons.
  81: J.ABS.Input.SkillTrigger, // q
  17: J.ABS.Input.StrafeTrigger,// ctrl
  69: J.ABS.Input.GuardTrigger, // e
  9: J.ABS.Input.MobilitySkill,// tab

  // quickmenu button.
  13: J.ABS.Input.Quickmenu,    // enter

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