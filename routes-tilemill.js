var Url = require("url");
var Hoek = require("hoek");
var Config = require("config");
var Boom = require("boom");
var Utils = require("../common/utils");


var internals = {};

internals.apiPrefix = Config.get("apiPrefix.v1");
internals.config = {};
internals.port = Config.get("tilemill.port");
internals.tilePort = Config.get("tilemill.tilePort");



internals.config.tilemillHome = {

    handler: function(request, reply) {

    	Utils.logCallsite(Hoek.callStack()[0]);

        if(!request.auth.isAuthenticated){
            Utils.serverLog(["auth"], "requested " + request.path + " but authentication failed - will now redirect to /{lang}/login");
            return reply.redirect("/" + request.params.lang + "/login");
        }
        
        // // when NODE_ENV is "dev-no-auth", the route's auth configuration is set to false
        // if(Config.get('hapi.auth')!==false){
        //     if(!request.auth.isAuthenticated){
        //         Utils.serverLog(["auth"], "requested " + request.path + " but authentication failed - will now redirect to /{lang}/login");
        //         return reply.redirect("/" + request.params.lang + "/login");
        //     }
        // }
        // else{
        // 	request.auth.credentials = Hoek.clone(Config.get("hapi.dummyCredentials"));
        // }

        var context = {
            auth: request.auth,
            lang: request.params.lang
        }

        return reply.view('tilemill', {
            ctx: context
        });
    }

};

internals.getQueryString2 = function(fullPath){

    return "?" + (Url.parse(fullPath).query || "");
};


// internals.getQueryString = function(queryObj){
//     var qs = "";
//     for(key in queryObj){
//         qs += key + "=" + encodeURIComponent(queryObj[key]) + "&";
//     }

//     return qs.slice(0, -1);
// }

internals.config.tilemillTileServer = {

    handler: {
        proxy: {
            mapUri: function(request, cb){

                // note: request.url.path includes the query string as well
                var proxyUrl = "http://localhost:" + internals.port + 
                                request.path + 
                                internals.getQueryString2(request.url.path);
                                //(Object.keys(request.query).length ? "?" + internals.getQueryString(request.query) : "");

                return cb(null, proxyUrl);
            },
            passThrough: true
        }
    },
    auth: false
};

internals.config.tilemillServer = {

    handler: {
        proxy: {
            mapUri: function(request, cb){

                var proxyUrl = "http://localhost:" + internals.tilePort + 
                                request.path + 
                                internals.getQueryString2(request.url.path);
                                //(Object.keys(request.query).length ? "?" + internals.getQueryString(request.query) : "");

                return cb(null, proxyUrl);
            },
            passThrough: true
        }
    },
    auth: false
};

// internals.config.tileStream = {
//     handler: {
//         proxy: {
//             mapUri: function(request, cb){
//                 return cb(null, "http://localhost:8001/v2/" + request.params.anyPath);
//             },

//             // based on the code from h2o2
//             onResponse: function(err, res, request, reply, settings, ttl){

//                 if (err) {
//                     return reply(err);
//                 }

//                 // the 404 message from tilestream displays stuff we don't want to expose
//                 // so we send out own 404 using a boom object
//                 if(res.statusCode===404){
//                     return reply(Boom.notFound("Tile not found"));
//                 }

//                 return reply(res)
//                     .code(res.statusCode)
//                     .passThrough(false);   // Default to false
//             }
//         }
//     },
//     auth: false,
//     cache: {
//         expiresIn: 120 * 1000,
//         privacy: "public",
//         statuses: [200, 404]
//     }
// };

exports.endpoints = [


    {
        path: "/tilejson_test",
        method: "GET",
        config: {
            handler: function(request, reply){
                reply.view("tilejson_test");
            },
            auth: false
        }
    },

/*
    {
        //  will forward tiles requests to tilestream. Example:
        //  clima.dev/api/v1/tiles/<map-id>/4/11/7.png  ->  localhost:8001/v2/<map-id>/4/11/7.png
        path: internals.apiPrefix + "/tiles/{anyPath*}",
        method: "GET",
        config: internals.config.tileStream
    },
*/

    {
        path: "/{lang}/tilemill",
        method: "GET",
        config: internals.config.tilemillHome
    },

    {
        path: "/assets/tilemill-clima/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/assets/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/status/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillServer
    },

    // {
    //     path: "/status/{anyPath"*"}",
    //     method: "GET",
    //     config: internals.config.tilemillTileServer
    // },

    // TODO: this endpoint should be accessed only by admins
    {
        path: "/restart/{anyPath*}",
        method: "POST",
        config: internals.config.tilemillServer
    },

    {
        path: "/manual/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/oauth/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/tile/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillServer
    },

    {
        path: "/datasource/{anyPath*}",
        method: ["GET", "OPTIONS"],
        config: internals.config.tilemillServer
    },

    {
        path: "/clear-mapnik-cache/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillServer
    },

    {
        path: "/export/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/api/Project/{anyPath*}",
        method: ["GET", "PUT", "DELETE"],
        config: internals.config.tilemillTileServer
    },

    {
        path: "/api/updatesVersion/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/api/Error/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/api/Export/{anyPath*}",
        method: ["GET", "PUT", "DELETE"],
        config: internals.config.tilemillTileServer
    },

    {
        path: "/api/Preview/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/api/Config/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/api/Favorite/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/api/Library/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/api/Page/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/api/Plugin/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },

    {
        path: "/api/Key/{anyPath*}",
        method: "GET",
        config: internals.config.tilemillTileServer
    },



    // {
    //     path: ,
    //     method: "GET",
    //     config: internals.config.tilemillTileServer
    // },




];