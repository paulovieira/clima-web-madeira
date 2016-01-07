var filesChannel = Backbone.Radio.channel('files');
Backbone.Radio.DEBUG = true;

var FileEditModalIV = Mn.ItemView.extend({
	template: "files/templates/files-edit-modal.html",

	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalSaveBtn":   "button.js-modal-save"
	},

	events: {
		"click @ui.modalSaveBtn": "updateResource"
	},

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
		},
	},

	// mix in the template context the the global variables in Clima
	templateHelpers: {
		publicUri: Clima.publicUri
	},

	updateResource: function(){

		var data = Backbone.Syphon.serialize(this);

		var attrs = {
			"tags":  $.trim(data["edit-files-tags"])
		};

		this.ui.modalSaveBtn.prop("disabled", true);
		var self = this;

		Q.delay(150)
			.then(function(){

				return self.model.save(attrs, { wait: true });  // returns a promise
			})
			.then(function(){

				var msg = "The data of file #" + self.model.get("id") + " was updated.";
				Clima.notify("success", msg);

			})
			.catch(function(err){
				debugger;
				// var msg = err.responseJSON ? err.responseJSON.message : 
				// 							( err.message ? err.message : "unknown error" );

				var errMsg = Clima.getErrorMessage(err);
				var msg = "The data of file #" + self.model.get("id") + " was not updated (ERROR: " + errMsg + ")"

				// if the model has been deleted in the server in the meantime we get a 404; 
				// the collection in the client is then outdated so we call destroy to remove 
				// the deleted model from the collection; we also abort the ajax request immediately 
				// because we are not interested in the response
				if(err.responseJSON && err.responseJSON.statusCode === 404){
					//self.model.destroy().abort();
					var collection = self.model.collection;
					collection.remove(self.model);
				}
				
				Clima.notify("danger", msg, 20000);
				throw new Error(msg);
			})
			.finally(function(){
				debugger;
				Dashboard.$modal1.modal("hide");
				self.destroy();
			})
			.done();

	},

});


var FileDeleteModalIV = Mn.ItemView.extend({
	template: "files/templates/files-delete-modal.html",

	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalDeleteBtn": "button.js-modal-delete",
	},

	behaviors: {
		CloseModal: {
			// will listen for clicks on @ui.modalCloseBtn
			behaviorClass: window.Behaviors.CloseModal,  
		},

		DeleteResourceAndCloseModal: {
			// will listen for clicks on @ui.modalDeleteBtn
			behaviorClass: window.Behaviors.DeleteResourceAndCloseModal,  
		},
	},

});

var FileRowLV = Mn.LayoutView.extend({
	template: "files/templates/files-row.html",
	tagName: "tr",
	ui: {
		"editModalBtn": "button.js-edit",
		"deleteModalBtn": "button.js-delete"
	},
	modelEvents: {
		"change": "render"
	},

	behaviors: {

		ShowEditModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "editModalBtn",  // will listen for clicks on @ui.editModalBtn
			viewClass: FileEditModalIV  // and will show this view
		},

		ShowDeleteModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "deleteModalBtn",
			viewClass: FileDeleteModalIV 
		},
	},

});

var FilesTableCV = Mn.CompositeView.extend({
	template: "files/templates/files-table.html",
	childView: FileRowLV,
	childViewContainer: "tbody",

});



var FileNewLV = Mn.LayoutView.extend({
	template: "files/templates/files-new.html",


    // use underscore.string to generate the slugged name (the native slug method is not good)
	slugFilename: function(filename) {
    	var array = filename.split(".");
    	if(array.length===1){
    		return s.slugify(array[0]);
    	}

    	var extension = array.pop();
    	filename = s(array).toSentence("-", "-").slugify().replaceAll("-", "_").value() + "." + extension;

    	return filename;
	},

	onAttach: function(){

		// self is the view
		var self = this;

		$("#new_file").fileinput({
		    uploadUrl: '/api/v1/files',
		    maxFileSize: 1000*200,  // in Kb
		    showUpload: true,
		    initialCaption: "",
		    dropZoneTitle: "Drag & drop files here, or click the browse button below&hellip;",
		    showRemove: false,
		    maxFileCount: 1,

		    slugCallback: self.slugFilename,

		    ajaxSettings: {
		    	error: function(jqxhr){
		    		debugger;
		    		var errMsg = Clima.getErrorMessage(jqxhr);
		    		var msg = "The file was not created (ERROR: " + errMsg + ")";

					Clima.notify("danger", msg, 20000);
					filesChannel.request("show:all:files");
					throw new Error(msg);
		    	},
		    	success: function(data){
		    		
		    		var msg = "The new file was successfuly created with id #" + data[0].id;
		    		Clima.notify("success", msg);
		    		filesChannel.request("show:all:files");
		    	}
		    },

		    uploadExtraData: function(){
		    	//debugger;

				return { 
					tags: self.$("input[name='new-file-tags']").val(),
					filename:  self.model.get("filename"),
					isShape:   self.model.get("isShape"),
					fromSrid:  self.$("input[name='from-srid']").val(),
					shapeDescription: JSON.stringify({
									"en": self.$("textarea[name='shape-description']").val()
								})
				};
		    }
		});


		// this callback will execute after the file is selected (and before the upload button is clicked)
		$('#new_file').on('fileloaded', function(e, file, previewId, index, reader) {
			//debugger;

			// NOTE: slugFilename replaces any extra dots by dashes, so we know that 
			// the returned string is of the form "abc_xyz.ext"; when we call .split,
			// it is garanteed that the array will have either lenght 1 or 2

			var filename = self.slugFilename(file.name);
			self.model.set("filename", filename);
			
		});

		// $('#new_file').on('fileuploaded', function(event, data, previewId, index) {
		// 	debugger;
		// });


		// $('#new_file').on('fileuploaderror', function(event, data, previewId, index) {
		// 	debugger;
		// });

		// // $('#new_file').on('filebatchuploadcomplete', function(event, files, extra) {
		// //     debugger;
		// // });

		// $('#new_file').on('filelock', function(event, filestack, extraData) {
		// 	debugger;
		// });

		// $('#new_file').on('fileunlock', function(event, filestack, extraData) {
		// 	debugger;
		// });



	},

});


var ShapeNewLV = Mn.LayoutView.extend({
	template: "files/templates/shapes-new.html",

	ui: {
		shapeRadio: "input[type='radio'][name='new-shape-or-raster']",
	},

	events: {
		"change @ui.shapeRadio": "changeType"
	},

	changeType: function(e){
		var val = $(e.target).val();
		this.model.set("isShape",  val==="shape");
		this.model.set("isRaster", val==="raster");
	},


    // use underscore.string to generate the slugged name (the native slug method is not good)
	slugFilename: function(filename) {
    	var array = filename.split(".");
    	if(array.length===1){
    		return s.slugify(array[0]);
    	}

    	var extension = array.pop();
    	filename = s(array).toSentence("-", "-").slugify().replaceAll("-", "_").value() + "." + extension;

    	return filename;
	},

	onAttach: function(){

		this.model.set("isShape", this.ui.shapeRadio.val()==="shape");
		// self is the view
		var self = this;

		$("#new_file").fileinput({
		    uploadUrl: '/api/v1/files',
		    maxFileSize: 1000*200,  // in Kb
		    showUpload: true,
		    initialCaption: "",
		    dropZoneTitle: "Drag & drop the zip file here, or click the browse button below&hellip;",
		    showRemove: false,
		    maxFileCount: 1,

		    slugCallback: self.slugFilename,

		    ajaxSettings: {
    	    	error: function(jqxhr){
    	    		debugger;
    	    		var errMsg = Clima.getErrorMessage(jqxhr);
    	    		var msg = "The file was not created (ERROR: " + errMsg + ")";

    				Clima.notify("danger", msg, 20000);
    				filesChannel.request("show:all:files");
    				throw new Error(msg);
    	    	},
    	    	success: function(data){
    	    		
    	    		var msg = "The new file was successfuly created with id #" + data[0].id;
    	    		Clima.notify("success", msg);
    	    		filesChannel.request("show:all:files");
    	    	}
		    },

		    uploadExtraData: function(){

		    	var extraData = { 
					tags: self.$("input[name='new-file-tags']").val(),
					filename:  self.model.get("filename"),
					isShape:   self.model.get("isShape"),
					fromSrid:  self.$("input[name='from-srid']").val(),
					shapeDescription: JSON.stringify({
									"en": self.$("textarea[name='shape-description']").val()
								})
				};

				return extraData;
		    }
		});


		// this callback will execute after the file is selected (and before the upload button is clicked)
		$('#new_file').on('fileloaded', function(e, file, previewId, index, reader) {
			//debugger;

			// NOTE: slugFilename replaces any extra dots by dashes, so we know that 
			// the returned string is of the form "abc_xyz.ext"; when we call .split,
			// it is garanteed that the array will have either lenght 1 or 2

			var filename = self.slugFilename(file.name);
			self.model.set("filename", filename);

		});


	},

});

var FilesTabLV = Mn.LayoutView.extend({

	initialize: function(){

		filesChannel.reply("show:all:files", function(){

			this.$("li").removeClass("active");
			this.$("a[data-tab-separator='files-all']").parent().addClass("active");
			this.showAllFiles();
		}, this);

		filesChannel.reply("show:new:file", function(){

			this.$("li").removeClass("active");
			this.$("a[data-tab-separator='files-new']").parent().addClass("active");
			this.showNewFile();
		}, this);

		filesChannel.reply("show:new:shape", function(){

			this.$("li").removeClass("active");
			this.$("a[data-tab-separator='shapes-new']").parent().addClass("active");
			this.showNewShape();
		}, this);

	},

	template: "files/templates/files-tab.html",

	regions: {
		tabContentRegion: "#files-region"
	},

	events: {
		"click a.js-dashboard-sep": "updateTabView"
	},

	onBeforeDestroy: function(){
		filesChannel.reset();
	},

	// the initial view will be the list of all files
	onBeforeShow: function(){
		//this.showAll();
		filesChannel.request("show:all:files");
	},

	updateTabView: function(e){

		e.preventDefault();

		switch($(e.target).data("tab-separator")){
			case "files-all":
				filesChannel.request("show:all:files");
				break;
			case "files-new":
				filesChannel.request("show:new:file");
				break;
			case "shapes-new":
				filesChannel.request("show:new:shape");
				break;
			default:
				throw new Error("unknown tab separator");
		}
	},

	showNewFile: function(){

		var fileM = new FileM();
		var fileNewLV = new FileNewLV({
			model: fileM
		});
		this.tabContentRegion.show(fileNewLV); 
	},

	showNewShape: function(){

		var fileM = new FileM();
		var shapeNewLV = new ShapeNewLV({
			model: fileM
		});
		this.tabContentRegion.show(shapeNewLV); 
	},

	showAllFiles: function(){

		var filesTableCV = new FilesTableCV({
			collection: filesC
		});

		var self = this;

		Q(filesC.fetch())
			.then(function(){ 
				self.tabContentRegion.show(filesTableCV); 
			})
			.catch(function(err){
				// var msg = err.responseJSON ? err.responseJSON.message : 
				// 							( err.message ? err.message : "unknown error" );
				
				var msg = Clima.getErrorMessage(err);

				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.done();
	},


});
