var Path = require("path");
var Hoek = require("hoek");
var Config = require("config");
var _ = require("underscore");

var rootDir = require('config').get("rootDir");
var Utils = require(Path.join(rootDir, "lib/common/utils"));
var Validate = require(Path.join(rootDir, "lib/common/validate"));
var Pre = require(Path.join(rootDir, "lib/common/prerequisites"));


var internals = {};
internals.config = {};

//internals.config.dashboard = Hoek.applyToDefaults(CommonConfig.config, {
internals.config.dashboard = {

    handler: function(request, reply) {

    	Utils.logCallsite(Hoek.callStack()[0]);

        if(!request.auth.isAuthenticated){
            Utils.serverLog(["auth"], "requested " + request.path + " but authentication failed - will now redirect to /{lang}/login");
            return reply.redirect("/" + request.params.lang + "/login");
        }

        var context = {
            texts:      _.indexBy(request.pre.texts, "id"),
            textsArray: request.pre.texts,
            auth:       request.auth,
            urlParam1:  "dashboard",
            showEnglish: request.pre.showEnglish
        };

        return reply.view('dashboard', {
            ctx: context
        });

    },

    validate: {
        params: Validate.lang
    },
    
    pre: [
        [Pre.abortIfInvalidLang],
        [Pre.readShowEnglish, Pre.readAllTexts],
        [Pre.prepareTextsForView]

    ]
};



exports.endpoints = [

    {
        path: "/{lang}/dashboard",
        method: "GET",
        config: internals.config.dashboard
    },

    // IMPORTANT: this path below is now being served directly by nginx
    {
        path: '/dashboard/{anyPath*}',
        method: 'GET',
        handler: {
            directory: { path: Path.join(Config.get("rootDir"), "lib/web/client/dashboard") }
        },
        config: {
            auth: false,
        }
    },
];

