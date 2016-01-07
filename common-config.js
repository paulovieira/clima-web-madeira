var Validate = require("../common/validate");
var Pre = require("../common/prerequisites");
var Utils = require("../common/utils");

exports.config = {

    validate: {
        params: Validate.lang
    },
    
    pre: [
    	[Pre.abortIfInvalidLang],
    	[Pre.readAllTexts],
    	[Pre.prepareTextsForView]

    ]
};
