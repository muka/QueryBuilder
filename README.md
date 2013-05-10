QueryBuilder
============

Free-time experiment to build a node.js based SQL query builder

```javascript

  var q = require("QueryBuilder");

  var where = q("title", "my title%", "LIKE")
                .or("birthday", "1367509003122", '>=')
                .and(
                  q("title", "ciao").and("birthday", "1367509003122", '<=')
                )
                .not(
                  q("title", "EMPTY").and("birthday", "NULL", '<>')
                ).toString();

  console.log('SELECT * FROM table where ' + where);
  //SELECT * FROM table WHERE `title` LIKE 'my title%' OR `birthday` >= '1367509003122' AND  (`title` = 'ciao' AND `birthday` <= '1367509003122' )  AND  NOT    (`title` = 'EMPTY' AND `birthday` <> 'NULL' )


```
