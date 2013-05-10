QueryBuilder
============

Free-time experiment to build a node.js based SQL query builder

```javascript

  var qb = require("QueryBuilder");

  var where = 
          qb("source", "website") // =
          .and("date", "", ">= NOW()") // no escaping
          .or("name", "googl%", "LIKE") // LIKE 
          .or( // nested OR
            qb().within("name", [1,2,3])
              .or()
                .not(
                  qb()
  //                    .is('node', 'NULL')
                    .and().not("data", false)
                )
          ).toString();

  console.log( where );

```
