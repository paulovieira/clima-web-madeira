var Path = require("path");
var Hoek = require("hoek");
var Config = require("config");
var _ = require("underscore");
var Utils = require("../common/utils");
//var CommonConfig = require("./common-config");
var Validate = require("../common/validate");
var Pre = require("../common/prerequisites");

var internals = {};
internals.config = {};

//internals.config.cartografia = Hoek.applyToDefaults(CommonConfig.config, {
internals.config.cartografia = {

    handler: function(request, reply) {

    	Utils.logCallsite(Hoek.callStack()[0]);

        var context = {
            texts:      _.indexBy(request.pre.texts, "id"),
            textsArray: request.pre.texts,
            maps:       request.pre.maps,
            mapsMenu:   request.pre.mapsMenu,
            auth:       request.auth,
            urlParam1:  "cartografia",
            showEnglish: request.pre.showEnglish
        };

        return reply.view('cartografia', {
            ctx: context
        });

    },

    validate: {
        params: Validate.lang
    },
    
    pre: [
        [Pre.abortIfInvalidLang],
        [Pre.readShowEnglish, Pre.readAllTexts, Pre.readAllMaps],
        [Pre.readMapsMenu],   // <- this pre must come after Pre.readAllMapss
        [Pre.prepareTextsForView]

    ]
};




exports.endpoints = [

    {
        path: "/{lang}/cartografia",
        method: "GET",
        config: internals.config.cartografia
    },

    // IMPORTANT: this path below is now being served directly by nginx
    {
        path: '/cartografia/{anyPath*}',
        method: 'GET',
        handler: {
            directory: { path: Path.join(Config.get("rootDir"), "lib/web/client/cartografia") }
        },
        config: {
            auth: false,
        }
    },

];

