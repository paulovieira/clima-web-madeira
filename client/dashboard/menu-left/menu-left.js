
var MenuLeftIV = Mn.ItemView.extend({
	template: "menu-left/templates/menu-left.html",

	events: {
		"click .list-group-item": "onLeftSectionClicked"
	},

	// handler to be executed when the user clicks in a section on the
	// left menu (Texts, Users, etc)
	onLeftSectionClicked: function(e){
		var $target   = $(e.target),
			$anchorEl = $target.is("span") ? $target.parent() : $target;

		var href = $anchorEl.prop("href");
		if(href.indexOf("tilemill") >= 0){
			return;
		}

		// for all the siblings, remove the classes that give the active look; then
		// add those classes to the selected anchor element

		$anchorEl.siblings().removeClass("active");
		$anchorEl.addClass("active");

		$anchorEl.siblings().find(".arrow-container").removeClass("glyphicon glyphicon-chevron-right");
		$anchorEl.find(".arrow-container").addClass("glyphicon glyphicon-chevron-right");

		leftMenuChannel.trigger("show:main:right", $anchorEl.attr("href"));
	},

	onAttach: function(){
		// execute the onLeftSectionClicked handler (relative to the 1st section in the left menu)
		this.$(".list-group-item").first().trigger("click");
	}
});
s