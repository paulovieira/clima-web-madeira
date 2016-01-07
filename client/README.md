### Client side applications

## Introduction

The clima web app includes several "inner" client-side applications. We say "inner" in the sense that the main directory for those applications is part of the main clima application (they are in `lib/web/client`) and they don't have a separate repository.

The client-side applications are based on Backbone/Marionette and some other utilities from the Backbone ecosystem. The [nunjucks](https://mozilla.github.io/nunjucks/) library is used for templates.

### Using Nunjucks in the browser

 Nunjucks should be installed globally:
```
sudo npm install nunjucks -g
```

This will also make available the `nunjucks-precompile` script globally available. We can then precompile a whole directory of templates with:
```
export CLIENT_APP_PATH=lib/web/client/dashboard
nunjucks-precompile $CLIENT_APP_PATH > $CLIENT_APP_PATH/templates_dashboard.js
```

The script will search recursively all subdirectories for the templates, includes, macros, etc.

To use the pre-compiled templates in the browser we use the auxiliary nunjucks-slim.js. This is a stripped down version of Nunjucks that doesn't have the compiler. More informations:

Getting Started - When in Browser
https://mozilla.github.io/nunjucks/getting-started.html

Nunjucks API - Browser Usage
http://mozilla.github.io/nunjucks/api.html#browser-usage

### Pre-compile setup

The setup is as follows:

1. For development, use the grunt task to watch the main directory of each client side application for changes in templates and automatically precompile them into a js file
2. Load nunjucks-slim.js and templates.js (or whatever you named the precompiled js file)
3. Render templates (see example below)

So we simply have to call `grunt watch` in the main directory. The grunt task will take take of calling `nunjucks-precompile`.

### Examples

The the precompiled scripts in `templates.js` will be stored in the global object `window.nunjucksPrecompiled`. The keys are the relative file path of the template file. Example:
```js
window.nunjucksPrecompiled["users/templates/users-row.html"]
```

The values are an object like this:
```js
{root: function}
```
where function is the compiled template "per se".

To use the templates we simply pass the keys of `nunjucksPrecompiled` to the `nunjucks.render` method, along with the data (an object or array):
```js
nunjucks.render("users/templates/users-row.html", {xyz: "abc"})
```

Note that the main `nunjucks` object is made available through `nunjucks-slim.js`. This version of nunjucks will take care of obtaining the template  from `nunjucksPrecompiled` and doing the correct processing to output the template.

### Other notes

The `nunjucks-precompile` script should be located at either `/usr/bin/` or `/usr/local/bin/`. This file is just a a soft link to `../lib/node_modules/nunjucks/bin/precompile`. So `nunjucks-precompile` is actually `/usr/lib/node_modules/nunjucks/bin/precompile`. 

This script will simply create a new Environment and call call the precompile utilities available in the Nunjucks module (see `/usr/lib/node_modules/nunjucks/precompile.js`).

It is important that the `nunjucks-slim.js` used in the browser is the same version as the `nunjucks-precompile`. If we update Nunjucks globally we must update `nunjucks-slim.js` as well. This file is available in `/usr/lib/node_modules/nunjucks/browser/`
