/**
 * A pubsub manager that handles an listening and subscribing to events.
 */
function Pubsub() { this.initialize(); }
Pubsub.prototype = {}; // Object.create(EventEmitter.prototype); // const EventEmitter = require('events');
Pubsub.prototype.constructor = Pubsub;

/**
 * Initializes the pubsub manager.
 */
Pubsub.prototype.initialize = function()
{
  this.initMembers();
};

/**
 * Initializes all members of this class.
 */
Pubsub.prototype.initMembers = function()
{
  /**
   * @type {Map<string, PubSubEvent[]>}
   */
  this.listeners = new Map();
};

/**
 * Adds a new label with a callback. If the label already exists, this will
 * append the event to the list of other events that already exists on that label.
 * @param {string} label The label to identify this event with.
 * @param {Function} callback The action to execute when emitted.
 * @param {boolean} autoremove Whether or not to remove it when emitted.
 */
Pubsub.prototype.add = function(label, callback, autoremove = false)
{
  let actions = [];
  if (this.listeners.has(label))
  {
    actions = this.listeners.get(label);
  }

  const event = new PubSubEvent(label, callback, autoremove);
  actions.push(event);
  this.listeners.set(label, actions);
};

/**
 * Executes the callbacks associated with the given label.
 * @param label
 */
Pubsub.prototype.emit = function(label)
{
  if (!this.listeners.has(label)) {
    // we tried to emit something to a label that doesn't exist.
    console.warn(`Attempted to emit a callback from a label: [${label}] that doesn't exist.`);
    return;
  }

  const releventEvents = this.listeners.get(label);
  releventEvents.forEach(event =>
  {
    // execute whatever this event's action is.
    event.action();

    // does this event require auto-removal?
    if (event.autoremove)
    {
      // then remove it from the collection.
      this.listeners.delete(event.label);
    }
  });
};

/**
 * A single pubsub event for use with the pubsub event listening service.
 * @constructor
 */
function PubSubEvent() { this.initialize(...arguments); }
PubSubEvent.prototype = {};
PubSubEvent.prototype.constructor = PubSubEvent;

/**
 * Initializes this pubsub event.
 * @param {string} label The label associated with this event.
 * @param {Function} action The action to execute when emitted.
 * @param {boolean} autoremove Whether or not to remove it when emitted.
 */
PubSubEvent.prototype.initialize = function(label, action, autoremove)
{
  /**
   * The label of this event.
   * @type {string}
   */
  this.label = label;

  /**
   * The action of this event, aka the callback.
   * @type {Function}
   */
  this.action = action;

  /**
   * Whether or not to remove this event from the listener after emitting.
   * @type {boolean}
   */
  this.autoremove = autoremove;
};

