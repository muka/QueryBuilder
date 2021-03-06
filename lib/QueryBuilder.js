var SqlString = require('../node_modules/sequelize/lib/sql-string');
var events = require('events');

module.exports = (function() {

  var QueryBuilder = function(a) {

    var self = this;

    var util = require('util');
    this.query = [];

    var column = { name: '', value: null, op: '=', glue: 'AND' };
    var d = function(){ console.log(arguments); };

    this.argIsObj = function() {
      return ((typeof arguments[0] == 'object' && arguments[0] != null) || util.isArray(arguments[0]));
    };

    var getArgs = function(a) {
      return Array.apply(null, a);
    };

    this.map = function(_data) {
      var el = {};
      var i = 0;
      for(var n in column) {
        var _val = column[n];
        if(typeof _data[i] != 'undefined') {
          _val = _data[i];
        }
        el[n] = _val;
        i++;
      }
//      d('map', _data, '->', el);
      return el;
    };

    var setArgs = function(a) {
      var args = getArgs(a);
//      d('args', a, '->', args);
      return self.map(args);
    };

    // @todo: review this function and enforce validation
    this.escape = function( val, wrap ) {

      wrap = wrap || "'";

      var type = typeof val;
      if(type == 'number') {
        return val;
      }
      if(type == 'boolean') {
        // @todo: see db implementation of booleans
        return val ? 'TRUE' : 'FALSE';
      }

      return [wrap, (val + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0'), wrap].join('');
    };

    this.condition = function(a, b) {

      // QueryBuilder instance, get string and wrap in vars

      if((a[0] && typeof a[0] == 'object') && a[0].query) {
        a = ["", "", [ '(', a[0].toString(), ')'].join('') ];
      }

      var args = (typeof b == 'undefined') ? setArgs(a) : setArgs(arguments);
//      d(args);
      this.query.push(args);
      return this;
    };

    var glue = function(a, glue) {
      self.query[self.query.length-1].glue = glue;
      var args = getArgs(a);
      if(args.length) {
        return self.condition(args);
      }
      return self;
    };

    this.and = function() {
      return glue( arguments, 'AND');
    };

    this.or = function() {
      return glue( arguments, 'OR');
    };

    this.not = function() {
      return this.condition(['','', 'NOT', '']).condition(arguments);
    };
    this.like = function(a, b, glue) {
      return this.condition([ a, b, 'LIKE', glue ]);
    };

    this.is = function(a, b, glue) {
      return this.condition([a, b, 'IS', glue]);
    };

    this.isNot = function(a, b, glue) {
      return this.condition([a, b, 'IS NOT', glue]);
    };

    this.isNull = function(a, glue) {
      return this.is(a, 'NULL', glue);
    };

    this.isNull = function(a, glue) {
      return this.is(a, 'NOT NULL', glue);
    };

    this.between = function(a, b, glue) {
      a = this.escape(a);
      b = this.escape(b);
      return this.condition(['', '', util.format('BETWEEN %s AND %s', a+'', b+''), glue]);
    };

    this.within = function(a, b, glue) {

      if(!util.isArray(b)) {
        b = (b+'').split(',');
      }

      if(!b) {
        return this;
      }

      for(var i in b) {
        b[i] = this.escape(b[i]);
      }
      b = b.join(', ');

      a = this.escape(a, '`');

      return this.condition('', '', util.format('%s IN(%s)', a, b), glue);
    };

    this.render = function(data) {
      data = data || this.query;
      var output = [];
      var length = data.length;
      var i = 1;
      data.forEach(function(col) {

        var colName = '';
        if(col.name) {
          colName = SqlString.escapeId(col.name);
        }
        var colValue = '';
        if(col.value) {
          colValue = SqlString.escape(col.value);
        }

        if(i == length) {
          col.glue = '';
        }

        output.push([ colName, col.op, colValue, col.glue ].join(' '));

        i++;
      });

      return output.join(' ');
    };

    this.toString = function() {
      return this.render();
    };

    if(getArgs(a).length) {
      return this.condition(a);
    }
    return this;
  };

//  QueryBuilder.prototype = {};

  return function() { return new QueryBuilder(arguments) };
})();