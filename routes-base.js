var Hoek = require("hoek");
var Config = require("config");
var _ = require("underscore");
var Utils = require("../common/utils");
//var CommonConfig = require("./common-config");
var Validate = require("../common/validate");
var Pre = require("../common/prerequisites");

var internals = {};
internals.config = {};

//internals.config.generalPage = Hoek.applyToDefaults(CommonConfig.config, {
internals.config.generalPage = {

	handler: function(request, reply) {

		Utils.logCallsite(Hoek.callStack()[0]);

	    var viewFile = Utils.getView(request);

        console.log("viewFile: ", viewFile);

	    // if the lang does not exist, show the 404 template with the default language (english)
		if(!request.params.lang){
		    return reply.view('404', {
		    }).code(404);
		}

        // if(Config.get('hapi.auth')===false){
        //     request.auth.credentials = Hoek.clone(Config.get("hapi.dummyCredentials"));
        //     request.auth.isAuthenticated = true;
        // }


        // TODO: we can filter request.pre.texts to send only the texts for this page

	    var context = {
	        urlParam1: request.params.level1,
	        urlParam2: request.params.level2,
	        urlParam3: request.params.level3,
	        urlParam4: request.params.level4,
	        urlParam5: request.params.level5,
	        urlWithoutLang: Utils.getUrlWithoutLang(request.params),
            auth: JSON.parse(JSON.stringify(request.auth)),
            showEnglish: request.pre.showEnglish
	        //textsArray: request.pre.texts,
            //defaultTexts: request.server.app.defaultTexts
	    };

	    // add the data available in request.pre that has been treated and ready to be used
	    // in the nunjucks template: texts, textArray, files, etc
	    for(var key in request.pre){
	        if(request.pre.hasOwnProperty(key)){
	            context[key] = request.pre[key];
	        }
	    }

        //return reply({"abc": 123})
	    // to get the texts in the views, instead of the array we want an object whose keys are the ids

        context.editableTexts = context.texts.filter(function(obj){
            return viewFile.indexOf(obj.pageName) >= 0;
        });

        context.editableTexts = _.indexBy(context.editableTexts, "editableId");
        context.texts = _.indexBy(context.texts, "id");
        context.showEnglish = request.pre.showEnglish;
        //console.log("context.editableTexts: ", context.editableTexts);
		// context.editableTexts = _.indexBy(context.editableTexts, "editableId");
  //       console.log("context.editableTexts: ", context.editableTexts);

	    var response = reply.view(viewFile, {
	        ctx: context
	    });

	    if(viewFile === "404"){
	    	response.code(404);
	    }

		return response;
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


//internals.config.notFound = Hoek.applyToDefaults(CommonConfig.config, {
internals.config.notFound = {

	handler: function(request, reply) {

		Utils.logCallsite(Hoek.callStack()[0]);

	    var context = {
	    };

	    return reply.view('404', {
	        ctx: context
	    }).code(404);
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

    // if lang param is not given, redirect immediately to the default laguage

    {
        path: "/",
        method: "GET",
        config: {
	        handler: function(request, reply) {
		        return reply.redirect("/" + Config.get("allowedLanguages")[0]);
		    },
            auth: false,
        }
    },

    // ordinary routes

    {
        path: "/{lang}",
        method: "GET",
        config: internals.config.generalPage
    },

    {
        path: "/{lang}/{level1}",
        method: "GET",
        config: internals.config.generalPage
    },

    {
        path: "/{lang}/{level1}/{level2}",
        method: "GET",
        config: internals.config.generalPage
    },

    {
        path: "/{lang}/{level1}/{level2}/{level3}",
        method: "GET",
        config: internals.config.generalPage
    },

    {
        path: "/{lang}/{level1}/{level2}/{level3}/{level4}",
        method: "GET",
        config: internals.config.generalPage
    },

    {
        path: "/{lang}/{level1}/{level2}/{level3}/{level4}/{level5}",
        method: "GET",
        config: internals.config.generalPage
    },


    // catch-all route

    {
        method: "GET",
        path: "/{lang}/{anyPath*}",
        config: internals.config.notFound
    },
];