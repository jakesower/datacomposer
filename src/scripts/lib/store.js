var Store = function(){
  this.counter = 0;
  this.store = {};

  add = function( item ) {
    var i = this.counter;
    this.store[i] = item;
    this.counter++;
    return i;
  };

  remove = function( idx ) {
    var stored = this.store[idx];
    delete this.store[idx];
    return stored;
  };

  on = function( event, handler ) {
    eventRegistry[event] = eventRegistry[event] || [];
    eventRegistry[event].push( handler );
  },


  off = function( event, handler ) {
    eventRegistry[event] = eventRegistry[event] || [];    
    if( event in this._events === false  ) return;
    this._events[event].splice(this._events[event].indexOf( handler ), 1);
  },


  trigger = function( event ) {
    var toTrigger = eventRegistry[event];
    toTrigger = toTrigger || [];
    toTrigger.forEach( event, function( handler ){
      handler.apply( this, Array.prototype.slice.call( arguments, 1 ) );
    }, this );
  },

  return {
    add: add,
    remove: remove,
    on: on,
    off: off,
    trigger: trigger
  };

};

module.exports = Store;