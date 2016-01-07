Cartografia.init();

Cartografia.supportsFullscreen = $.fullscreen.isNativelySupported() + "";

var router = new Router();

Backbone.history.start({
//  pushState: true
});
