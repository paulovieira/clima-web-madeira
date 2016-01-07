var usersChannel = Backbone.Radio.channel('users');
Backbone.Radio.DEBUG = true;

var UserEditModalIV = Mn.ItemView.extend({
	initialize: function(){

		this.model.set("sessionUserId", Clima.userId);
		this.model.set("sessionIsAdmin", Clima.isAdmin);
	},

	template: "users/templates/users-edit-modal.html",

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

// onAttach: function(){
// 	var m = this.model.toJSON();
// 	debugger;
// },

	updateResource: function(){

		var data = Backbone.Syphon.serialize(this);
debugger;
		var attrs = {
			"firstName": $.trim(data["syphon-user-first-name"]),
			"lastName":  $.trim(data["syphon-user-last-name"]),
			"email":     $.trim(data["syphon-user-email"]),
			"isAdmin":        data["syphon-is-admin"],
			"canEditTexts":   data["syphon-can-edit-texts"]   || data["syphon-is-admin"],
			"canDeleteTexts": data["syphon-can-delete-texts"] || data["syphon-is-admin"],
			"canEditMaps":    data["syphon-can-edit-maps"]    || data["syphon-is-admin"],
			"canDeleteMaps":  data["syphon-can-delete-maps"]  || data["syphon-is-admin"],
			"canEditFiles":    data["syphon-can-edit-files"]    || data["syphon-is-admin"],
			"canDeleteFiles":  data["syphon-can-delete-files"]  || data["syphon-is-admin"],
		};
 
		// all the fields must be filled (otherwise the validation in the server will reject)
		if(attrs.firstName==="" || attrs.lastName==="" || attrs.email===""){
			alert("Please fill the missing fields");
			return;
		}

		this.ui.modalSaveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.then(function(){

				var msg = "Data for user #" + self.model.get("id") + " has been updated";
				Clima.notify("success", msg)
			})
			.catch(function(err){
				// var msg = err.responseJSON ? err.responseJSON.message : 
				// 							( err.message ? err.message : "unknown error" );

				var errMsg = Clima.getErrorMessage(err);
				var msg = "Data for user " + self.model.get("id") + " was not updated (ERROR: " + errMsg + ").";

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


var UserDeleteModalIV = Mn.ItemView.extend({
	template: "users/templates/users-delete-modal.html",

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



var UserRowLV = Mn.LayoutView.extend({
	template: "users/templates/users-row.html",
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
			viewClass: UserEditModalIV  // and will show this view
		},

		ShowDeleteModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "deleteModalBtn",
			viewClass: UserDeleteModalIV 
		},
	},

});

var UsersTableCV = Mn.CompositeView.extend({
	template: "users/templates/users-table.html",
	childView: UserRowLV,
	childViewContainer: "tbody",
});

var UserNewIV = Mn.ItemView.extend({
	template: "users/templates/users-new.html",

	ui: {
		saveBtn: "button.js-save"
	},

	events: {
		"click @ui.saveBtn": "createResource"
	},

	createResource: function(){

		var data = Backbone.Syphon.serialize(this);

		var attrs = {
			firstName:     $.trim(data["syphon-first-name"]),
			lastName:      $.trim(data["syphon-last-name"]),
			email:         $.trim(data["syphon-email"]),
			password:      $.trim(data["syphon-pw"]),
			passwordAgain: $.trim(data["syphon-pw-again"]),
		};

		if(!attrs.firstName || !attrs.lastName || !attrs.email || !attrs.password){
			alert("Please fill the missing fields");
		}

		if(attrs.password !== attrs.passwordAgain){
			alert("The password doesn't match");
		}

		delete attrs.passwordAgain;

		this.ui.saveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){

				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.then(function(){

				var msg = "The new user was successfuly created with id #" + self.model.get("id");
				Clima.notify("success", msg);
				usersChannel.request("show:all:users");
			})
			.catch(function(err){

				var errMsg = Clima.getErrorMessage(err);
				var msg = "The new user could not be created (ERROR: " + errMsg + ")";
				Clima.notify("danger", msg, 20000);

				throw new Error(msg);
			})
			.finally(function(){
				self.ui.saveBtn.prop("disabled", false);
			})
//			.done();

	}
});

var UsersTabLV = Mn.LayoutView.extend({

	initialize: function(){

		usersChannel.reply("show:all:users", function(){

			this.$("li").removeClass("active");
			this.$("a[data-tab-separator='users-all']").parent().addClass("active");
			this.showAll();
		}, this);

		usersChannel.reply("show:new:user", function(){

			this.$("li").removeClass("active");
			this.$("a[data-tab-separator='users-new']").parent().addClass("active");
			this.showNew();
		}, this);
	},

	onBeforeDestroy: function(){
		usersChannel.reset();
	},

	template: "users/templates/users-tab.html",

	regions: {
		tabContentRegion: "#users-region"
	},

	events: {
		"click a.js-dashboard-sep": "updateTabView"
	},

	// the initial view will be the list of all users
	onBeforeShow: function(){
		//this.showAll();
		usersChannel.request("show:all:users");
	},

	updateTabView: function(e){

		e.preventDefault();

		switch($(e.target).data("tab-separator")){
			case "users-all":
				usersChannel.request("show:all:users");
				break;
			case "users-new":
				usersChannel.request("show:new:user");
				break;
			default:
				throw new Error("unknown tab separator");
		}
	},

	showNew: function(){

		var userNewIV = new UserNewIV({
			model: new UserM()
		});
		this.tabContentRegion.show(userNewIV); 
	},

	showAll: function(){
		var usersTableCV = new UsersTableCV({
			collection: usersC
		});

		var self = this;

		Q(usersC.fetch())
			.then(function(){ 
				self.tabContentRegion.show(usersTableCV); 
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