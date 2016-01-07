
Clima.summernoteOptions = {
    focus: true,
    airMode: false,
    // note: the div for each group of buttons will have the "note-toolbar-group" class (besides "btn-group")
    toolbar: [
        ['toolbar-group', ['style']],
        ['toolbar-group', ['bold', 'italic', 'underline', 'clear']],
        ['toolbar-group', ['fontname']],
        ['toolbar-group', ['color']],
        ['toolbar-group', ['ul', 'ol', 'paragraph']],
        ['toolbar-group', ['height']],
        ['toolbar-group', ['link', 'picture', 'hr']],
        ['toolbar-group', ['undo', 'redo',  'codeview']],
        ['toolbar-group', ['save']],
        ['toolbar-group', ['close']],
    ]
};


var openEditor = function(e){

    var $target = $(e.target);
    var $editableElem = $target.closest("[data-editable-id]");

    $editableElem.summernote(Clima.summernoteOptions);

    // the users clicks somewhere in the editable div to open the editor; if this click
    // is over an anchor, we have to prevent the default action
    e.preventDefault();

    // the element that holds the actual editor is a sibling div next to the element where we activated summernote
    $editorContainer = $editableElem.next();

    $editorContainer.css("overflow", "auto");
    $editorContainer.css("z-index", "1050");
    $editorContainer.css("min-height", "550px");
    $editorContainer.css("min-width", "600px");


    // the colors pallete must have a min-width also
    $(".note-palette-title")
        .first()
        .parentsUntil("div[data-name='color']")
        .last()
        .css("min-width", "340px")

    // disable the align buttons for the image formatting (because they introduce floats)
    $editorContainer.livequery(
        '[data-event="floatMe"]',
        function(elem){
            $(elem).parent().css("display", "none");
        }
        //,
        // function(elem){
        //     var $elem = elem;
        //     debugger;
        // }
    );


};

$('*[data-editable-id]').on("click", openEditor);

$("body").on("click", ".THIS-IS-NOT-NECESSARY-NOW-note-editor", function(e){
debugger;

	$target = $(e.target);

	if(!$target.hasClass("note-image-input")){
		e.preventDefault();
     }
//        return;

	// // if we click an editable element that is an anchor (or a children of an anchor), we must stop the default action
 //    if($(e.target).hasClass("is-editable")){
 //    	e.preventDefault();
 //        return;
 //    }

    

 //    // similar: if we have the editor already open and click inside it, and the editable text is an anchor (or a children of an anchor),
 //    // we must prevent the default action; but if the click is in the modal, it should propagate normally;
 //    //var $editable = $(e.target).parents(".note-editor");

 //    //if($editable.length > 0){
	// if($(e.target).hasClass("note-editable") || $(e.target).hasClass("btn-close-editor")){

 //        	e.preventDefault();

 //    }
 //    // otherwise, if we click outside the editor, close it!
	// // else{
	// // 	if(!!Clima.$currentOpenEditor){
	// //         Clima.$currentOpenEditor.destroy();
	// //         Clima.$currentOpenEditor = null;
	// // 	}
 // //    }
  	//e.stopPropagation();
});



$.summernote.addPlugin({

    buttons: { 
        save: function() {
        	var buttonHtml = "";

			buttonHtml += '<button type="button" style="padding-top: 5px; padding-bottom: 4px;" class="btn btn-default btn-sm btn-save" title="Save changes in the database" data-event="save-data" data-hide="true" tabindex="-1">';
			buttonHtml += '<i class="fa fa-floppy-o"></i>';
			buttonHtml += '<span style="font-size: 110%; padding: 0; margin-left: 7px;" class="btn-save-text">Save</span>';
			buttonHtml += '</button>';
		 	
		 	return buttonHtml;
        },

        close: function() {
        	var buttonHtml = "";

			buttonHtml += '<button type="button" style="padding-top: 5px; padding-bottom: 4px;" class="btn btn-default btn-sm btn-close" title="Close editor" data-event="close-editor" data-hide="true" tabindex="-1">';
			buttonHtml += '<i class="fa fa-times"></i>';
			buttonHtml += '<span style="font-size: 110%; padding: 0; margin-left: 7px;" class="btn-close-editor">Close</span>';
			buttonHtml += '</button>';
		 	
		 	return buttonHtml;
        },

    },

    events: { 
        "save-data": function(event, editor, layoutInfo) {

			var $editorElem = $(event.target).closest(".note-editor");
            var $editableElem = $editorElem.prev();

            var editableId = $editableElem.data("editableId");
            var textObj = Clima.editableTexts[editableId];
            var ajaxOptions, dataObj;

            // the text that is shown is a default lorem; we have to create a 
            // a new text in the database
            if (!textObj) {

                var pathname = window.location.pathname.split("/")

                // in some browsers location.pathname will not have a slash at the beggining
                if(pathname[0] === ""){ pathname.shift(); }

                // remove the 1st component of the path (should be "pt", "en", etc)
                pathname.shift();

                // finally we have the pagename
                var pageName = pathname.join("/");

                var contents = {pt: "", en: ""};
                contents[Clima.lang] = $.trim($editableElem.code());

                dataObj = {
                    contents: contents,
                    tags: [],
                    pageName: pageName,
                    editableId: editableId
                };


                // IMPORTANT: in the ajax request below we are "sending an object"
                // so we must do this:
                //  - "content-type" shouldn't be set (the default will be used - "application/x-www-form-urlencoded", which is probably what we want)
                //  - "data" must be the actual js object (no stringify);
                // this is in constrast to the situation where we want to send an array
                // of objects (in that case content-type should be "json" and data should be
                // the stringified array)
                ajaxOptions = {
                    url: "/api/v1/texts",
                    method: "POST",
                    data: dataObj
                };
            }
            else{
debugger;
                var textId = textObj.id;
                var newContents = {};
                newContents[Clima.lang] = $.trim($editableElem.code());

                dataObj = {
                    id: textId,
                    contents: _.extend(textObj.contents, newContents),
                    tags: []
                };

                ajaxOptions = {
                    url: "/api/v1/texts/" + textId,
                    method: "PUT",
                    data: dataObj
                };
            }



            $editorElem.find(".btn-save").prop('disabled', true);
            $editorElem.find(".btn-save-text").html("Saving...");

            var msg = "";
            Q($.ajax(ajaxOptions))
            .delay(300)
            .then(function(newTextObj) {

                // update the in-memory Clima.editableTexts array with the new text
                Clima.editableTexts[editableId] = newTextObj[0];

                msg = Clima.lang === "pt" ? "As alterações ao texto " + editableId + " foram gravadas" : "Changes to text " + editableId  +" were saved";

                $editorElem.find(".btn-save").prop('disabled', false);
                $editorElem.find(".btn-save-text").html("Save");

                Clima.notify("success", msg);
            })
            .catch(function(err) {

                msg = Clima.lang === "pt" ? "ERRO: o texto " + editableId + " não foi actualizado" : "ERROR: text " + editableId  +" was not updated"


                msg = msg + " (" + Clima.getErrorMessage(err) + ")";
                $editorElem.find(".btn-save").prop('disabled', false);
                $editorElem.find(".btn-save-text").html("Save");

                Clima.notify("danger", msg);
            });

            


        },

        "close-editor": function(event, editor, layoutInfo) {
        	//debugger;

            // we have to call the destroy in setTimeout because there's an error thrown
            // otherwise
            setTimeout(function(){ 

                // select the .is-editable corresponding to this editor widget
                var $editableElem = $(event.target).closest(".note-editor").prev();
                $editableElem.destroy(); 

                // the destroy method removes the click handler; add it again;
                $editableElem.on("click", openEditor);
            }, 10);

        },

    }
});

