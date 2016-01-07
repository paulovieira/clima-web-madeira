var Fs = require("fs");
var Path = require("path");
var Config = require("config");
//var Pre = require("../common/prerequisites");

exports.endpoints = [




    // STATIC ASSETS - the handler is given here directly (unlike the handlers for the base routes)

    // IMPORTANT: this path below is now being served directly by nginx
    {
        path: '/static/{anyPath*}',
        method: 'GET',
        config: {
            handler: {
                directory: { 
                    path: Path.join(Config.get("rootDir"), "lib/web/client/static"),
                    index: false,
                    listing: false,
                    showHidden: false
                }
            },
            auth: false

        }
    },


    // INLINE EDITOR ASSETS (using the summernote lib)

    // IMPORTANT: this path below is now being served directly by nginx
    {
        path: '/summernote-app/{anyPath*}',
        method: 'GET',
        config: {
            handler: {
                directory: { 
                    path: Path.join(Config.get("rootDir"), "lib/web/client/summernote-app"),
                    index: false,
                    listing: false,
                    showHidden: false
                }
            },
            auth: false

        }
    },


    // FAVICON

    // IMPORTANT: this path below is now being served directly by nginx
    {
        path: '/favicon.ico',
        method: 'GET',
        config: {
            handler: {
                file: Path.join(Config.get("rootDir"), 'lib/web/client/static/_images/favicon.ico')
            },

            auth: false
        }
    },



    // IMPORTANT: this path is now being served directly by nginx
    {
        path: '/uploads/{anyPath*}',
        method: 'GET',
        config: {
            handler: {
                directory: { path: Path.join(Config.get("rootDir"), "data/uploads") }
            },
            auth: false,
        }
    },

    // old route - to be removed (in the html templates "/common/..."" should be replaced  with "/stats/..."")
    {
        path: '/common/{anyPath*}',
        method: 'GET',
        config: {
            handler: {
                directory: { path: Path.join(Config.get("rootDir"), "lib/web/client/static") }
            },
            auth: false,
        }
    },


        // dummy - trying to use server side caching for static content
    /*
        {
            path: '/static/_css/main.css',
            method: 'GET',
            config: {
                handler: {
                    //file: Path.join(Config.get("rootDir"), 'lib/web/client/static/_css/dummy.css')
                },

                handler: function(request, reply){

                    var key = request.path;
                    // request.server.app.staticCache.get(key, function(err, value, cachedData, report){
                    //     console.log("cachedData: \n", cachedData);
                    //     console.log("\nreport: \n", report);
                    //     console.log("--------------")

                    //     if(err){
                    //         return reply(Boom.badImplementation());
                    //     }

                    //     if(cachedData){
                    //         return reply.file(value);                
                    //     }
                    // })

                    var file = Fs.readFileSync(Path.join(Config.get("rootDir"), 'lib/web/client/static/_css/dummy.txt'));
                    console.log(file);
                    //reply.file(Path.join(Config.get("rootDir"), 'lib/web/client/static/_css/dummy.txt'));
                    return reply(file).header("Content-Disposition", "attachment");
                },

                auth: false,


            }
        },
    */


    // {
    //     method: 'GET',
    //     path: '/dashboard/{anyPath*}',
    //     handler: {
    //         directory: { path: './client/dashboard' }
    //     },
    //     config: {
    //         auth: false,
    //     }
    // },

    // {
    //     method: 'GET',
    //     path: '/dashboard2/{anyPath*}',
    //     handler: {
    //         directory: { path: './client/dashboard2' }
    //     },
    //     config: {
    //         auth: false,
    //     }
    // },


    // {
    //     method: 'GET',
    //     path: '/ferramenta/{anyPath*}',
    //     handler: {
    //         directory: { path: './client/ferramenta' }
    //     },
    //     config: {
    //         auth: false,
    //     }
    // },

    // {
    //     path: '/editor/{anyPath*}',
    //     method: 'GET',
    //     handler: {
    //         directory: { path: Path.join(Config.get("rootDir"), "lib/web/client/editor") }
    //     },
    //     config: {
    //         auth: false,
    //     }
    // }

];

