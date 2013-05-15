QueryBuilder
============

Free-time experiment to build a node.js based SQL query builder

```javascript


  var qb = require('QueryBuilder');
  var query =
            qb("source", "website") // =
            .and("date", "", ">= NOW()") // =
            .or(qb().like("name", "googl%")) // LIKE
            .or(
              qb()
                .within("name", [1,2, '3'])
                .or()
                  .not(
                    qb()
                    .is('node', false)
                    .or().isNot(
                      qb().within('pippo', ['a', 'b', 'c']))
                    )
                    .and(
                      qb()
                      .not("locked", true)
                      .or()
                        .not().between('a','z').or().between(0.9, 0.99)
                    )

            )
  console.log( query.toString() );


```
