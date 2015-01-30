# node-diff-utility

Compares two files using the system's [`diff` utility](http://en.wikipedia.org/wiki/Diff_utility), and returns the output as structured JS objects.

Usage:

```js
var diff = require('node-diff-utility');
diff(filename1, filename2)
  .on('diff', function (obj) {
    console.log(obj);
  })
  .on("error", function(error) {
    console.log("Error: " + error);
  })
  .on("end", function() {
    console.log("Done!");
  });
```

## Example

This example shows the output of `node-diff-utility` comparing two [ndjson](http://ndjson.org/) files.

Contents of file 1:

```js
{"id": 1, "name": "Amsterdam", "type": "place"}
{"id": 2, "name": "Utrecht", "type": "place"}
{"id": 3, "name": "Rotterdam", "type": "place"}
```

Contents of file 2:

```js
{"id": 1, "name": "Amsterdam", "type": "place"}
{"id": 3, "name": "Rotterdam", "type": "place"}
{"id": 4, "name": "Den Haag", "type": "place"}
{"id": 5, "name": "Eindhoven", "type": "place"}
```

Output:

```js
{ change: 'delete',
  line: 2,
  type: 'out',
  str: '{"id": 2, "name": "Utrecht", "type": "place"}' }

{ change: 'add',
  line: 3,
  type: 'in',
  str: '{"id": 4, "name": "Den Haag", "type": "place"}' }

{ change: 'add',
  line: 4,
  type: 'in',
  str: '{"id": 5, "name": "Eindhoven", "type": "place"}' }
```
