var $ = require('jquery');

// we should eventually move to a promise chain for turning off loading
var Loader = {
  loading: function(func, thisArg) {
    thisArg = ((typeof thisArg == 'undefined') ? this : thisArg);
    console.log(thisArg);
    func.apply(thisArg);
  }
};



module.exports = {
  Loader: Loader
};