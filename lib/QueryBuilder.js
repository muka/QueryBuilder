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
        return val ? 1 : 0;
      }

      return [wrap, (val + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0'), wrap].join('');
    };

    this.condition = function(a, b) {
      var args = (typeof b == 'undefined') ? setArgs(a) : setArgs(arguments);
//      d(args);
      this.query.push(args);
      return this;
    };

    var glue = function(a, glue) {
      args = getArgs(a);
      args[3] = glue;
      return self.condition(args);
    };

    this.and = function() {
      return glue( arguments, 'AND');
    };

    this.or = function() {
      return glue( arguments, 'OR');
    };

    this.within = function(a, b) {

      if(!util.isArray(b)) {
        b = (b+'').split(',');
      }

      if(!b) {
        return this;
      }

      for(var i in b) {
        b[i] = this.escape(b[i]);
      }
      b = b.join('');
      console.log('within', b);


      a = this.escape(a, '`');

      return this.condition('', '', util.format('%s IN(%s)', a, b));
    };

    this.render = function(data) {
      data = data || this.query;
      var output = [];

      data.forEach(function(col) {

        var colName = '';
        if(col.name) {
          colName = this.escape(col.name, '`');
        }

        output.push([ colName, col.op, col.value, col.glue ].join(' '));
      });

      return output.join(' ');
    };

    this.toString = function() {
      return this.render();
    };

    if(a) {
      return this.condition(a);
    }
    return this;
  };

//  QueryBuilder.prototype = {};

  return function() { return new QueryBuilder(arguments) };
})();