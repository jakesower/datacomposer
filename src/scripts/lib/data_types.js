/**
 * Provides methods for handline the different types of columns. Methods included:
 *
 * test    : see if a value matches the pattern for the type
 * coerce  : force any value into the type and return the result
 * compare : compare two values for sorting purposes
 * numeric : return a value as a number for purposes where a number is needed
 * string  : get the value as a string
*/

var _ = require('lodash');


var DataTypes = {
  number: {
    name : "number",
    regexp : /^\s*[\-\.]?[0-9]+([\.][0-9]+)?\s*$/,

    test : function(v) {
      if (v === null || typeof v === "undefined" || typeof v === 'number' || this.regexp.test( v ) ) {
        return true;
      } else {
        return false;
      }
    },

    coerce : function(v) {
      var cv = +v;
      if (_.isNull(v) || typeof v === "undefined" || _.isNaN(cv)) {
        return null;
      }
      return cv;
    },

    compare : function(n1, n2) {
      if (n1 === null && n2 !== null) { return -1; }
      if (n1 !== null && n2 === null) { return 1; }
      if (n1 === null && n2 === null) { return 0; }
      if (n1 === n2) { return 0; }
      return (n1 < n2 ? -1 : 1);
    },

    numeric : function(value) {
      if (_.isNaN(value) || value === null) {
        return null;
      }
      return value;
    },

    string : function(v) {
      if(_.isNull(v) || typeof v === "undefined") {
        return '';
      }
      
      return v.toString();
    }
  },


  string: {
    test : function(v) {
      return (v === null || typeof v === "undefined" || typeof v === 'string');
    },

    coerce : function(v) {
      if (_.isNaN(v) || v === null || typeof v === "undefined") {
        return null;
      }
      return v.toString();
    },

    compare : function(s1, s2) {
      if (s1 === null && s2 !== null) { return -1; }
      if (s1 !== null && s2 === null) { return 1; }
      if (s1 < s2) { return -1; }
      if (s1 > s2) { return 1;  }
      return 0;
    },

    numeric : function(value) {
      if (_.isNaN(+value) || value === null) {
        return null;
      } else if (_.isNumber(+value)) {
        return +value;
      } else {
        return null;
      }
    },

    string : function(v) {
      if(_.isNull(v) || typeof v === "undefined") {
        return '';
      }
      
      return v.toString();
    }

  },


  "boolean" : {
    name : "boolean",
    regexp : /^(true|false)$/,

    test : function(v) {
      if (v === null || typeof v === "undefined" || typeof v === 'boolean' || this.regexp.test( v ) ) {
        return true;
      } else {
        return false;
      }
    },

    coerce : function(v) {
      if (_.isNaN(v) || v === null || typeof v === "undefined") {
        return null;
      }
      if (v === 'false') { return false; }
      return Boolean(v);
    },

    compare : function(n1, n2) {
      if (n1 === null && n2 !== null) { return -1; }
      if (n1 !== null && n2 === null) { return 1; }
      if (n1 === null && n2 === null) { return 0; }
      if (n1 === n2) { return 0; }
      return (n1 < n2 ? -1 : 1);
    },

    numeric : function(value) {
      if (value === null || _.isNaN(value)) {
        return null;
      } else {
        return (value) ? 1 : 0;
      }
    },

    string : function(v) {
      if(_.isNull(v) || typeof v === "undefined") {
        return '';
      }
      
      return v.toString();
    }
  },


  time : {
    name : "time",
    formats : ["M/D/YYYY", "M/D/YY", "YYYY-MM-DD"],
    stringFormat : "YYYY-MM-DD",
    _formatLookup : [
      ['DD', "\\d{2}"],
      ['D' ,  "(\\d{1}|\\d{2})"],
      ['MM', "\\d{2}"],
      ['M' , "(\\d{1}|\\d{2})"],
      ['YYYY', "\\d{4}"],
      ['YY', "\\d{2}"],
      ['A', "[AM|PM]"],
      ['hh', "\\d{2}"],
      ['h', "(\\d{1}|\\d{2})"],
      ['mm', "\\d{2}"],
      ['m', "(\\d{1}|\\d{2})"],
      ['ss', "\\d{2}"],
      ['s', "(\\d{1}|\\d{2})"],
      ['ZZ',"[-|+]\\d{4}"],
      ['Z', "[-|+]\\d{2}:\\d{2}"]
    ],
    _regexpTable : {},

    _regexp: function(format) {
      //memoise
      if (this._regexpTable[format]) {
        return new RegExp(this._regexpTable[format], 'g');
      }

      //build the regexp for substitutions
      var regexp = format;
      _.each(this._formatLookup, function(pair) {
        regexp = regexp.replace(pair[0], pair[1]);
      }, this);

      // escape all forward slashes
      regexp = regexp.split("/").join("\\/");

      // save the string of the regexp, NOT the regexp itself.
      // For some reason, this resulted in inconsistant behavior
      this._regexpTable[format] = regexp;
      return new RegExp(this._regexpTable[format], 'g');
    },

    test : function(v, options) {
      options = options || {};
      if (v === null || typeof v === "undefined") {
        return true;
      }
      if (_.isString(v) ) {
        var formats = options.formats || this.formats;

        return _.find(formats, function(f) {
          return !!this._regexp(f).test(v);
        }, this);

      } else {
        //any number or moment obj basically
        return true;
      }
    },

    coerce : function(v, options) {
      options = options || {};

      if (_.isNull(v) || typeof v === "undefined" || _.isNaN(v)) {
        return null;
      }

      // if string, then parse as a time
      if (_.isString(v)) {
        var formats = options.formats || this.formats;
        var format = _.find(formats, function(f) {
          return this._regexp(f).test(v);
        }, this);

        return _.isUndefined(format) ? null : moment(v, format);
      } else if (_.isNumber(v)) {
        return moment(v);
      } else {
        return v;
      }

    },

    compare : function(d1, d2) {
      if (d1 < d2) {return -1;}
      if (d1 > d2) {return 1;}
      return 0;
    },

    numeric : function( value ) {
      if (_.isNaN(value) || value === null) {
        return null;
      }
      return value.valueOf();
    },

    string : function(v) {
      if(_.isNull(v) || typeof v === "undefined") {
        return '';
      }
      
      return v.format(this.stringFormat);
    }
  },


  currency: {
    name : "currency",
    regexp : /^\s*\$?[+-]?\$?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?\s*$/,

    test : function(v) {
      if (v === null || typeof v === "undefined" || typeof v === 'number' || this.regexp.test( v ) ) {
        return true;
      } else {
        return false;
      }
    },

    coerce : function(v) {
      var cv, cents, dollars, output;

      if (_.isNull(v) || typeof v === "undefined") {
        return null;
      }

      // return a uniform format for US currency
      cv = +v.replace(/\$|,/g, '');
      cents = (cv*100).toString().slice(-2); // ensure cents
      dollars = Math.floor(Math.abs(cv)).toString();
      
      // format dollars
      output = "";
      while(dollars.length > 3) {
        output = "," + (dollars.slice(-3)) + output;
        dollars = dollars.slice(0,-3);
      }
      output = (cv < 0 ? '-$' : '$') + dollars + output + '.' + cents;

      return output;
    },

    compare : function(m1, m2) {
      n1 = this.numeric(m1); n2 = this.numeric(m2);

      if (n1 === null && n2 !== null) { return -1; }
      if (n1 !== null && n2 === null) { return 1; }
      if (n1 === null && n2 === null) { return 0; }
      if (n1 === n2) { return 0; }
      return (n1 < n2 ? -1 : 1);
    },

    numeric : function(value) {
      var v = +value.replace(/[^0-9.]/, '');

      if (_.isNaN(v) || v === null) {
        return null;
      }

      return v;
    },

    string : function(v) {
      if(_.isNull(v) || typeof v === "undefined") {
        return '';
      }
      
      return v.toString();
    }

  }
};



module.exports = DataTypes;