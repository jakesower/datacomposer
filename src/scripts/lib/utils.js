var $ = require('jquery'),
    _ = require('lodash');


// use true promises, rather than jQuery
var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(JSON.parse(req.response));
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
};


var Loader = {
  registry: {},

  check: function() {
    if(_.size(this.registry) === 0) {
      $('body').removeClass('loading');
    } else {
      $('body').addClass('loading');
      $('#loading-messages #messages').html(_.values(this.registry).join(", "));
    }
  },

  loading: function(func, msg, thisArg) {
    var id = _.uniqueId();

    this.registry[id] = msg;
    this.check();

    thisArg = ((typeof thisArg == 'undefined') ? this : thisArg);
    return Promise
      .resolve(func.apply(thisArg))
      .then(function(v) {
          delete this.registry[id];
          this.check();
        }.bind(this));
  }
};



module.exports = {
  Loader: Loader,
  getJSON: getJSON
};