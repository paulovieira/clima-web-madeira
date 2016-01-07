var textsChannel = Backbone.Radio.channel('texts');
Backbone.Radio.DEBUG = true;
var TextEditModalIV = Mn.ItemView.extend({
	template: "texts/templates/texts-edit-modal.html",

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

	updateResource: function(){
debugger;
		var data = Backbone.Syphon.serialize(this);

		var attrs = {
			"contents": {
				"pt": $.trim(data["edit-text-pt"]),
				"en": $.trim(data["edit-text-en"])
			},
			"tags": data["edit-text-tags"]
		};

		if(attrs.contents.pt + attrs.contents.pt===""){
			alert("Please fill the missing fields");
			return;
		}

		// NOTE: we should always use model.save(attrs, {wait: true}) instead of 
		// model.set(attrs) + model.save(); this way the model will be updated (in the client) only 
		// after we get a 200 response from the server (meaning the row has actually been updated)

		this.ui.modalSaveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.then(function(){
				var msg = "Text #" +  self.model.get("id") + " was saved"
				Clima.notify("success", msg);
			})
			.catch(function(err){
				debugger;
				var errMsg = Clima.getErrorMessage(err);
				var msg = "Text #" +  self.model.get("id") + " was not saved (ERROR: " + errMsg + ")"

				// if the model has been deleted in the server in the meantime we get a 404; 
				// the collection in the client is then outdated so we call destroy to remove 
				// the deleted model from the collection; we also abort the ajax request immediately 
				// because we are not interested in the response
				if(err.responseJSON && err.responseJSON.statusCode === 404){
					self.model.destroy().abort();
				}
				
				Clima.notify("danger", msg, 20000);
				throw new Error(msg);
			})
			.finally(function(){
				Dashboard.$modal1.modal("hide");
				self.destroy();
			})
			.done();

	},

});


var TextDeleteModalIV = Mn.ItemView.extend({
	template: "texts/templates/texts-delete-modal.html",

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


var TextRowLV = Mn.LayoutView.extend({
	template: "texts/templates/texts-row.html",
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
			viewClass: TextEditModalIV  // and will show this view
		},

		ShowDeleteModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "deleteModalBtn",
			viewClass: TextDeleteModalIV 
		},
	},

});

var TextsTableCV = Mn.CompositeView.extend({
	template: "texts/templates/texts-table.html",
	childView: TextRowLV,
	childViewContainer: "tbody",
});


var TextNewLV = Mn.LayoutView.extend({
	template: "texts/templates/texts-new.html",

	ui: {
		saveBtn: "button.js-save"
	},

	events: {
		"click @ui.saveBtn": "createResource"
	},

	createResource: function(){

		var data = Backbone.Syphon.serialize(this);

		var attrs = {
			"contents": {
				"pt": $.trim(data["new-text-pt"]),
				"en": $.trim(data["new-text-en"])
			},
			"tags": data["new-text-tags"]
		};

		if(attrs.contents.pt + attrs.contents.pt === ""){
			alert("Please fill the missing fields");
			return;
		}

		this.ui.saveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){

				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.then(function(){

				var msg = "The new text was successfuly created with id #" + self.model.get("id");
				Clima.notify("success", msg);
				textsChannel.request("show:all:texts");
			})
			.catch(function(err){

				var errMsg = Clima.getErrorMessage(err);
				var msg = "The new text could not be created (ERROR: " + errMsg + ")";
				Clima.notify("danger", msg, 20000);

				throw new Error(msg);
			})
			.finally(function(){
				self.ui.saveBtn.prop("disabled", false);
			})
//			.done();

	}
});


var TextsTabLV = Mn.LayoutView.extend({

	initialize: function(){
		
		textsChannel.reply("show:all:texts", function(){

			this.$("li").removeClass("active");
			this.$("a[data-tab-separator='texts-all']").parent().addClass("active");
			this.showAll();
		}, this);

		textsChannel.reply("show:new:text", function(){

			this.$("li").removeClass("active");
			this.$("a[data-tab-separator='texts-new']").parent().addClass("active");
			this.showNew();
		}, this);

	},

	onBeforeDestroy: function(){

		textsChannel.reset();
	},

	template: "texts/templates/texts-tab.html",

	regions: {
		tabContentRegion: "#texts-region"
	},

	events: {
		"click a.js-dashboard-sep": "updateTabView"
	},

	// the initial view will be the list of all texts
	onBeforeShow: function(){
		textsChannel.request("show:all:texts");
	},

	updateTabView: function(e){

		e.preventDefault();

		switch($(e.target).data("tab-separator")){
			case "texts-all":
				textsChannel.request("show:all:texts");
				break;
			case "texts-new":
				textsChannel.request("show:new:text");
				break;
			default:
				throw new Error("unknown tab separator");
		}
	},

	showNew: function(){
		var textNewLV = new TextNewLV({
			model: new TextM()
		});
		this.tabContentRegion.show(textNewLV); 
	},

	showAll: function(){
		var textsTableCV = new TextsTableCV({
			collection: textsC
		});

		var self = this;

		Q(textsC.fetch())
			.then(function(){ 

				self.tabContentRegion.show(textsTableCV); 
			})
			.catch(function(err){

				var errMsg = Clima.getErrorMessage(err);
				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.done();
	},


});


