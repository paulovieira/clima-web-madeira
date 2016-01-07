
var leftMenuChannel = Backbone.Radio.channel('leftMenu');

var Dashboard = new Mn.Application();
Dashboard.$modal1 = $("#modal-1");
Dashboard.$modal2 = $("#modal-2");

Dashboard.addRegions({
	mainRegion: "#main-region",
	modal1Region: "#modal1-content-region",
	modal2Region: "#modal2-content-region"
});

var mainLayout = new MainLayout();

Dashboard.mainRegion.show(mainLayout);



Dashboard.utils = Dashboard.utils || {};


Dashboard.utils.valueClasses = function(options){

    _.defaults(options || (options = {}), {
        mode: "real",
        min: 0,
        max: 100,
        numClasses: 4,
        toFixed: 2
    });

    var internals = {};

    internals.getClassesChar = function(options){
        var classes = [];
        var i, word;
        for(i=0; i<options.distinctWords.length; i++){
            word = options.distinctWords[i];
            classes.push([word, word]);
        }

        return classes;
    };

    internals.getClassesReal = function(options){

        var classes = [];
        var iLen = (options.max - options.min) / options.numClasses;
        var toFixed = options.toFixed;

        var left, right;
        for(var k=0; k<options.numClasses; k++){
            left = options.min + k*iLen;
            right = options.min + (k+1)*iLen;
            if(toFixed > 0){
                left  = left.toFixed(toFixed);
                right = right.toFixed(toFixed);
            }

            classes.push([left, right])
        }

        return classes;
    };

    internals.getClassesInt = function(options){

        var classes = [];

        // shift to value to 1 - ... (example: instead of 11 - 18, we work with 1 - 8)
        var max = options.max - (options.min - 1);

        if(options.numClasses > max){
            throw new Error("numClasses must be <= " + max);
        }

        var iLen = Math.floor(max/options.numClasses);
        var remainder = max % options.numClasses;
        var k, j;

        // basic intervals (assume there is no remainder)
        for(k=0; k<options.numClasses; k++){
            classes.push([k*iLen + 1, (k+1)*iLen])
        }

        // correct the intervals according to the remainder
        if(remainder){

            for(j=0; j<options.numClasses; j++){
                if(j<remainder){
                    classes[j][1] = classes[j][1] + (j + 1);
                }
                else{
                    classes[j][1] = classes[j][0] + (iLen - 1);
                 }

                if(j<options.numClasses-1){
                    classes[j+1][0] = classes[j][1] + 1;
                }
            }
        }

        // shift back to the original
        for(j=0; j<options.numClasses; j++){
            classes[j][0] = classes[j][0] + options.min - 1;
            classes[j][1] = classes[j][1] + options.min - 1;
        }

        return classes;
    };


    if(options.mode === "char"){
        return internals.getClassesChar(options);
    }

    if(options.max < options.min){
        throw new Error("max should be >= min");
    }

    if(options.numClasses < 2){
        throw new Error("numClasses should be >= 2");   
    }

    return options.mode === "real" ? internals.getClassesReal(options) : internals.getClassesInt(options);
};


// select text in a div; taken from
// http://stackoverflow.com/questions/9975707/use-jquery-select-to-select-contents-of-a-div
jQuery.fn.selectText = function(){
    this.find('input').each(function() {
        if($(this).prev().length == 0 || !$(this).prev().hasClass('p_copy')) { 
            $('<p class="p_copy" style="position: absolute; z-index: -1;"></p>').insertBefore($(this));
        }
        $(this).prev().html($(this).val());
    });
    var doc = document;
    var element = this[0];
    //console.log(this, element);
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();        
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};





// Set caret position easily in jQuery
// https://github.com/DrPheltRight/jquery-caret

(function ($) {
    // Behind the scenes method deals with browser
    // idiosyncrasies and such
    $.caretTo = function (el, index) {
        if (el.createTextRange) { 
            var range = el.createTextRange(); 
            range.move("character", index); 
            range.select(); 
        } else if (el.selectionStart != null) { 
            el.focus(); 
            el.setSelectionRange(index, index); 
        }
    };
    
    // Another behind the scenes that collects the
    // current caret position for an element
    
    // TODO: Get working with Opera
    $.caretPos = function (el) {
        if ("selection" in document) {
            var range = el.createTextRange();
            try {
                range.setEndPoint("EndToStart", document.selection.createRange());
            } catch (e) {
                // Catch IE failure here, return 0 like
                // other browsers
                return 0;
            }
            return range.text.length;
        } else if (el.selectionStart != null) {
            return el.selectionStart;
        }
    };

    // The following methods are queued under fx for more
    // flexibility when combining with $.fn.delay() and
    // jQuery effects.

    // Set caret to a particular index
    $.fn.caret = function (index, offset) {
        if (typeof(index) === "undefined") {
            return $.caretPos(this.get(0));
        }
        
        return this.queue(function (next) {
            if (isNaN(index)) {
                var i = $(this).val().indexOf(index);
                
                if (offset === true) {
                    i += index.length;
                } else if (typeof(offset) !== "undefined") {
                    i += offset;
                }
                
                $.caretTo(this, i);
            } else {
                $.caretTo(this, index);
            }
            
            next();
        });
    };

    // Set caret to beginning of an element
    $.fn.caretToStart = function () {
        return this.caret(0);
    };

    // Set caret to the end of an element
    $.fn.caretToEnd = function () {
        return this.queue(function (next) {
            $.caretTo(this, $(this).val().length);
            next();
        });
    };
}(jQuery));