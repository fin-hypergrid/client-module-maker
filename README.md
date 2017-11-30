# fin-hypergrid-client-module-maker

Standard Hypergrid Client Module maker

This module is essentially a packaged "gulpfile" which may be called _from_ your actual `gulplfile.js` as follows:

```js
require('fin-hypergrid-client-module-maker')(require('gulp'), require('package.json'));
```

If you have more than the one source file (`index.js`) and/or any other processing to do, you won't be able to use
this as is. Instead, use it as an example and a starting point for creating your own gulpfile.

Please see the [Client Modules](https://github.com/fin-hypergrid/core/wiki/Client-Modules) wiki for more information
about what this is and how it works.