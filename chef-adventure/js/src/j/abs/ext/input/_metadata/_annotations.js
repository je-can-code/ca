//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 INPUT] A manager for overseeing the input of JABS.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-ABS
 * @base J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS-AllyAI
 * @orderBefore J-HUD
 * @help
 * ============================================================================
 * This plugin is a mapping of inputs to controls for JABS.
 * This plugin governs the mapping of button inputs to JABS functionality.
 *
 * This is a fully-built controller for JABS.
 * It interfaces with the JABS_InputAdapter in a 1:1 fashion to functionality
 * as the engine was intended to be used with a controller.
 * ============================================================================
 * DEVELOPER NOTES:
 * This plugin defines the means of which button inputs are mapped to the
 * publicly exposed JABS_InputAdapter endpoints. Because the JABS_InputController
 * is an instance-type class, additional instances of it can be created and
 * mapped to different functionality like additional battlers if one wanted.
 * Alternatively, button input mapping changes would take place here, though
 * do be sure to review J-ABS's Input keymapper to see what is already there.
 * ============================================================================
 */