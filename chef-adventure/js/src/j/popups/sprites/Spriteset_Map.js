//region Spriteset_Map
J.POPUPS.Aliased.Spriteset_Map.set('initialize', Spriteset_Base.prototype.initialize);
Spriteset_Base.prototype.initialize = function()
{
  // perform original logic.
  J.POPUPS.Aliased.Spriteset_Map.get('initialize').call(this);

  this.initPopupsMembers();
};

Spriteset_Base.prototype.initPopupsMembers = function()
{
  this._j ||= {};

  this._j._popups = {};

  this._j._popups._pops = [];

  this._j._popups._secret = "cats are best";

  this._j._popups._emitter = J.POPUPS.Helpers.PopupEmitter;

  this.setupPopupsEmitter();
};

/**
 *
 * @returns {J_EventEmitter}
 */
Spriteset_Base.prototype.getPopupsEmitter = function()
{
  return this._j._popups._emitter;
};

Spriteset_Base.prototype.setupPopupsEmitter = function()
{
  const popupsEmitter = this.getPopupsEmitter();

  popupsEmitter.on("some-event", this.doWork, this);
  console.log("emitter setup!");
};

Spriteset_Base.prototype.doWork = function(a, b)
{
  console.log(this._j._popups._secret);
  console.log(a, b);
};
//endregion Spriteset_Map