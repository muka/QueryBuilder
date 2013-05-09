QueryBuilder
============

Free-time experiment to build a node.js based SQL query builder

```javascript

  var qb = require("QueryBuilder");

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

  console.log( query.toString() );

```
