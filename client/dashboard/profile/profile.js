
var ProfileLV = Mn.LayoutView.extend({
	initialize: function(){

		this.model.set("showEnglish", Clima.showEnglish);
	},
	template: "profile/templates/profile.html",

	ui: {
		saveBtn: "button.js-save",
		changePwBtn: "button.js-change-pw"
	},

	events: {
		"click @ui.saveBtn": "updateProfile",
		"click @ui.changePwBtn": "changePw"
	},

	updateProfile: function(){
		debugger;
		var data = Backbone.Syphon.serialize(this);
		data["updateProfile"] = true;  // flag to be used in the server

		this.ui.saveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(data, {wait: true});  // returns a promise
			})
			.then(function(){

				var msg = "Data has been updated";
				Clima.notify("success", msg);
			})
			.catch(function(jqxhr){

				var errMsg = Clima.getErrorMessage(jqxhr);
				var msg = "The data was not updated (ERROR: " + errMsg + ")";
				Clima.notify("danger", msg, 10000);
				throw new Error(msg);
			})
			.finally(function(){
				self.ui.saveBtn.prop("disabled", false);
			})
			.done();

	},

	changePw: function(){
		// NOTE: we cannot use Syphon here because it is another form)
		var newPw     = $.trim(this.$("#js-personal-new-pw").val()    ),
			newPw2    = $.trim(this.$("#js-personal-new-pw-2").val()  ),
			currentPw = $.trim(this.$("#js-personal-current-pw").val());

		if(!currentPw){
			alert("Please fill your current password");
			return;			
		}
		if(newPw !== newPw2){
			alert("The new password is not the same in the 2 fields. Please try again.");
			return;
		}

		var data = {
			currentPw: currentPw,
			newPw: newPw,
			//updateProfile: true
		};

		this.ui.changePwBtn.prop("disabled", true);
		var self = this;
		Q.delay(150)
			.then(function(){

				return self.model.save(data, {wait: true});  // returns a promise
			})
			.then(function(){

				var msg = "Data has been updated";
				Clima.notify("success", msg);
			})
			.catch(function(jqxhr){

				var errMsg = Clima.getErrorMessage(jqxhr);
				var msg = "The data was not updated (ERROR: " + errMsg + ")";
				Clima.notify("danger", msg, 10000);
				throw new Error(msg);
			})
			.finally(function(){
				self.ui.changePwBtn.prop("disabled", false);
			})
			.done();


		// remove the attriubutes from the client model
		this.model.unset("currentPw", {silent: true});
		this.model.unset("newPw", {silent: true});
	}
});
