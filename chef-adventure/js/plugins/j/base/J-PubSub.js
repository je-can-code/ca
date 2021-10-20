const EventEmitter = require('events');

/**
 * A pubsub manager that handles an listening and subscribing to events.
 */
function Pubsub() { this.initialize(); }
Pubsub.prototype = Object.create(EventEmitter.prototype);
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
  let callbacks = [];
  if (this.listeners.has(label)) {
    callbacks = this.listeners.get(label);
  }

  const event = new PubSubEvent(label, callback, autoremove);
  callbacks.push(event);
  this.listeners.set(label, callbacks);
};

Pubsub.prototype.emit = function(label)
{
  if (!this.listeners.has(label)) {
    // we tried to emit something to a label that doesn't exist.
    console.warn(`Attempted to emit a callback from a label: [${label}] that doesn't exist.`);
    return;
  }

  const listeners = this.listeners.get(label);
  listeners.forEach(event => {
    event.callback();
  });
};

function PubSubEvent() { this.initialize(); }
PubSubEvent.prototype = {};
PubSubEvent.prototype.constructor = PubSubEvent;

/**
 * Initializes this pubsub event.
 * @param {Function} callback The action to execute when emitted.
 * @param {boolean} autoremove Whether or not to remove it when emitted.
 */
PubSubEvent.prototype.initialize = function(callback, autoremove)
{
  /**
   * The callback of this event.
   * @type {Function}
   */
  this.callback = callback;

  /**
   * Whether or not to remove this event from the listener after emitting.
   * @type {boolean}
   */
  this.autoremove = autoremove;
};

