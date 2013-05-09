
var qb = require("QueryBuilder");

module.exports = (function() {

  var o = function() {

    var query =
            qb("source", "website") // =
            .and("date", "", ">= NOW()") // =
            .or("name", "googl%", "LIKE") // LIKE
            .or(
              qb().within("name", [1,2,3])
                .or()
                  .not(
                    qb()
//                    .is('node', 'NULL')
                      .and().not("data", false)
                  )
            )
    console.log( query.toString() );

  };

  return o;
})();