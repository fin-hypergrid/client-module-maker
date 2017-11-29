# fin-hypergrid-client-module-maker

Standard Hypergrid Client Module maker, essentially a sample gulpfile which may be called from your actual guplfile (with `gulp` as the only param):

```js
require('fin-hypergrid-client-module-maker')(require('gulp'));
```

If you have more than the one source file `index.js` and/or other processing to do, rather than calling this module, just use it as an example and a starting point for creating your own gulpfile.

See the [Client Modules](https://github.com/fin-hypergrid/core/wiki/Client-Modules) wiki for more information.