var SequenceControlIV = ControlLV.extend({
	template: "sequence/templates/sequence.html",	

	ui: {
		sequenceBtn: "button.js-select-layer-seq",
		playBtn: "button.js-play-seq",
		stopBtn: "button.js-stop-seq"
	},

	events: {
		"click @ui.sequenceBtn": "buttonClicked",
		"click @ui.playBtn": "playSequence",
		"click @ui.stopBtn": "stopSequence"
	},

	playSequence: function(e){

		// if we are already playing a sequence, don't play again (otherwise we would have 2 timers)
		if(this.intervalHandle){
			return;
		}
		
		var self = this;
		this.intervalHandle = setInterval(function(){

			self.selectNext();
		}, 1600);

		// highlight the play button by changing the class
		this.$el
			.find("div.btn-group")
			.eq(0)
			.children()
			.eq(0)
			.removeClass("btn-default")
			.addClass("btn-info");
	},

	stopSequence: function(e){

		if(this.intervalHandle){
			clearInterval(this.intervalHandle);
			this.intervalHandle = undefined;

			// remove the highlight from the play button
			this.$el
				.find("div.btn-group")
				.eq(0)
				.children()
				.eq(0)
				.removeClass("btn-info")
				.addClass("btn-default");
		}

	},

	buttonClicked: function(e){
		var $btn = $(e.target);

		// toggle the "active" class in the button that was clicked
		this.toggleButtonsState($btn);

		// deselect all maps relative to the button group
		this.deselectAllMaps();

		// select the map relative to the button that was clicked
		this.selectClickedMap($btn);

		this.$currentSelectedButton = $btn;

	},

	toggleButtonsState: function($buttonEl){

		$buttonEl.siblings().removeClass("active");
		$buttonEl.addClass("active");
	},

	deselectAllMaps: function($buttonEl){
//debugger;

		var $children = this.$el
						.find("div.btn-group")
						.eq(1)
						.children();

		var mapIds = [];
		$children.each(function(i, el){ 

			mapIds.push($(el).data("mapId")); 
		});

		var mapIndex = $children.first().data("mapIndex");

		for(var i=0; i<mapIds.length; i++){
			cartografiaChannel.request("deselectLayer", mapIndex, mapIds[i]);
		}
	},

	selectClickedMap: function($buttonEl){
//debugger;
		var mapId = $buttonEl.data("mapId");
		var mapIndex = $buttonEl.data("mapIndex");
		cartografiaChannel.request("selectLayer", mapIndex, mapId);
	},

	selectFirst: function(){

		var $first = this.$el
					.find("div.btn-group")
					.eq(1)
					.children()
					.first();

		$first.trigger("click");
	},

	selectNext: function(){

		var $next = this.$currentSelectedButton.next();
		if($next.length){
			$next.trigger("click");
		}
		else{
			this.selectFirst();
		}
	}

});


