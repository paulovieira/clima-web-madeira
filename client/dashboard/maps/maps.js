var mapsChannel = Backbone.Radio.channel('maps');
/*
var ShapeNewIV = Mn.ItemView.extend({
	template: "maps/templates/shapes-new.html",

	ui: {
		saveBtn: "button.js-save"
	},

	events: {
		"click @ui.saveBtn": "createResource",
		"click tr.js-shape-row": "shapeRowClicked"
	},

	shapeRowClicked: function(e){
		var $el = $(e.target);

		// if the click was directly in the radio, return early (there's nothing to do)
		if($el.is("input")){
			return;
		}

		// if the click was in some children of <tr>, we have to select the corresponding radio
		$el.closest("tr").find("input:radio").prop("checked", true);
	},

	createResource: function(){

		var attrs = Backbone.Syphon.serialize(this);

		if(attrs.code===""){
			alert("To load a new shape file you must submit a code for the shape");
			return;
		}			

		if(attrs.fileId===undefined){
			alert("To load a new shape file you must selected a file from the list");
			return;
		}

		this.ui.saveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.then(function(){
				alert("O shape foi carregado com sucesso.");

				// the handler for show:all:shapes will trigger a fake click on the correct
				// anchor elem, this showing the list of shapes
				mapsChannel.trigger("show:all:shapes");
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );
				
				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.finally(function(){
				self.ui.saveBtn.prop("disabled", false);
			})
			.done();

	}
});
*/

var ShapeEditModalIV = Mn.ItemView.extend({
	template: "maps/templates/shapes-edit-modal.html",

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

		var data = Backbone.Syphon.serialize(this);

		var attrs = {
			"description": {
				//"pt": $.trim(data["edit-desc-pt"]),
				"en": $.trim(data["edit-desc-en"])
			},
		};

		// if(attrs.description.pt + attrs.description.pt===""){
		// 	alert("Please fill the missing fields");
		// 	return;
		// }

		// NOTE: we should always use model.save(attrs, {wait: true}) instead of 
		// model.set(attrs) + model.save(); this way the model will be updated (in the client) only 
		// after we get a 200 response from the server (meaning the row has actually been updated)

		this.ui.modalSaveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.catch(function(err){
				// var msg = err.responseJSON ? err.responseJSON.message : 
				// 							( err.message ? err.message : "unknown error" );

				var msg = Clima.getErrorMessage(err);

				// if the model has been deleted in the server in the meantime we get a 404; 
				// the collection in the client is then outdated so we call destroy to remove 
				// the deleted model from the collection; we also abort the ajax request immediately 
				// because we are not interested in the response
				if(err.responseJSON && err.responseJSON.statusCode === 404){
					self.model.destroy().abort();
				}
				
				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.finally(function(){
				Dashboard.$modal1.modal("hide");
				self.destroy();
			})
			.done();
	},

});


var ShapeDeleteModalIV = Mn.ItemView.extend({
	template: "maps/templates/shapes-delete-modal.html",

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

var ShapeRowLV = Mn.LayoutView.extend({
	template: "maps/templates/shapes-row.html",
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
			uiKey: "editModalBtn",  // will listen for clicks on @ui.editModalBtn
			behaviorClass: window.Behaviors.ShowModal,
			viewClass: ShapeEditModalIV  // and will show this view
		},

		ShowDeleteModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "deleteModalBtn",
			viewClass: ShapeDeleteModalIV 
		},
	}

});

var ShapesTableCV = Mn.CompositeView.extend({
	template: "maps/templates/shapes-table.html",
	childView: ShapeRowLV,
	childViewContainer: "tbody",

	// ui: {
	// 	"addModalBtn": "button.js-add-control",
	// },

	behaviors: {

		// ShowEditModal: {
		// 	behaviorClass: window.Behaviors.ShowModal,
		// 	uiKey: "addModalBtn",  // will listen for clicks on @ui.addModalBtn
		// 	viewClass: ShapeEditModalIV  // and will show this view
		// },

		// ShowDeleteModal: {
		// 	behaviorClass: window.Behaviors.ShowModal,
		// 	uiKey: "deleteModalBtn",
		// 	viewClass: ShapeDeleteModalIV 
		// },
	}
});



/*
The interaction in controls edit modal is:
1) the user updates the data and clicks the apply button
2) the current control model is updated (updateResource method) and the modal (2nd level) is closed
3) the parent collectionView for controls is listening for changes on any model, and when that happens it will execute the "update:controls" command
4) the handler for that command will update the controls property on the underlying map model (using controlsCollection's toJSON); it will also remove the extra "availableShapes" property from the controls model
*/

/*
var ControlEditModalIV = Mn.ItemView.extend({
	template: "maps/templates/controls-edit-modal.html",

	ui: {
		"modalApplyBtn":  "button.js-modal-apply",
		"modalCloseBtn":  "button.js-modal-close"
	},

	events: {
		"click @ui.modalApplyBtn": "updateResource"
	},

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
			stackLevel: 2
		},
	},

	updateResource: function(){
		var tempObj = Backbone.Syphon.serialize(this);

		var selectedColumns = [];

		// the key of the outermost object is the shapeId
		_.each(tempObj, function(columns, shapeId){

			// the key of the inner object is the column number
			_.each(columns, function(props, columnNumber){

				if(props.isSelected){
					selectedColumns.push({
						shapeId: shapeId,
						columnNumber: columnNumber,
						publicName: props.publicName
					});
				}
			});
		});

		attrs = {
			selectedColumns: selectedColumns,
			showPlayButton: tempObj.showPlayButton,
			period: tempObj.period
		}
debugger;
		this.model.set(attrs);

		Dashboard.$modal2.modal("hide");
		this.destroy();

	}
});

var ControlDeleteModalIV = Mn.ItemView.extend({
	template: "maps/templates/controls-delete-modal.html",

	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalDeleteBtn": "button.js-modal-delete",
	},

    events: {
        "click @ui.modalDeleteBtn": "deleteResource"
    },

	behaviors: {
		CloseModal: {
			// will listen for clicks on @ui.modalCloseBtn
			behaviorClass: window.Behaviors.CloseModal,  
			stackLevel: 2
		},

		// DeleteResourceAndCloseModal: {
		// 	// will listen for clicks on @ui.modalDeleteBtn
		// 	behaviorClass: window.Behaviors.DeleteResourceAndCloseModal,  
		// },
	},

	deleteResource: function(){
		debugger;
		this.model.destroy().abort();
		Dashboard.$modal2.modal("hide");
		this.destroy();
	}

});

var ControlRowIV = Mn.ItemView.extend({
	template: "maps/templates/controls-row.html",
	tagName: "tr",
	ui: {
		"editModalBtn": "button.js-edit",
		"deleteModalBtn": "button.js-delete"
	},


	behaviors: {

		ShowEditModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "editModalBtn",  // will listen for clicks on @ui.editModalBtn
			viewClass: ControlEditModalIV,  // and will show this view
			stackLevel: 2
		},

		ShowDeleteModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "deleteModalBtn",
			viewClass: ControlDeleteModalIV,
			stackLevel: 2
		},
	}

});

var ControlsTableCV = Mn.CompositeView.extend({
	template: "maps/templates/controls-table.html",
	childView: ControlRowIV,
	childViewContainer: "tbody",

	collectionEvents: {
		"remove change": function(){
//			debugger;
			var controlsArray = this.collection.toJSON();

			_.each(controlsArray, function(obj){
				delete obj.selectedShapes;
			});

			mapsChannel.command("update:controls", controlsArray);
		},

	},
});


var MapEditModalIV = Mn.LayoutView.extend({
	template: "maps/templates/maps-edit-modal.html",

	initialize: function(){

		this.controlsC = new Backbone.Collection(this.model.get("controls"));

		mapsChannel.comply("update:controls", function(controlsArray){
//			debugger;
			this.model.set("controls", controlsArray);
		}, this);

	},

	onDestroy: function(){
		mapsChannel.stopComplying("update:controls");
	},

	regions: {
		controlsRegion: "#controls-region"
	},

	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalSaveBtn":   "button.js-modal-save",
		"modalAddControlBtn":    "button.js-add-control",
	},

	events: {
		"click @ui.modalSaveBtn": "updateResource",
		"click tr.js-shape-row": "shapeRowClicked",
		"click @ui.modalAddControlBtn": "addControl"
	},

	shapeRowClicked: function(e){
		var $el = $(e.target);

		// if the click was directly in the checkbox, return early (there's nothing to do)
		if($el.is("input")){
			return;
		}

		// if the click was in some children of <tr>, we have to select the corresponding checkbox
		var $checkbox = $el.closest("tr").find("input:checkbox"),
			isChecked = $checkbox.prop("checked");

		// finally, toggle the checkbox
		$checkbox.prop("checked", !isChecked);
	},

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
		},

	},

	onBeforeShow: function(){
		var shapesData = this.model.get("shapesData");
//			controlsArray = this.model.get("controls"),
//			controlsC = new Backbone.Collection(controlsArray);


		// TODO: improve this pre-processing
		var controlId = 0;
		this.controlsC.each(function(controlM){
//debugger;
			controlM.set("id", ++controlId);
			controlM.url = "/api/maps/controls";  // fake url!

			// make a new deep clone of shapesC.toJSON()
			var shapesArray = $.extend(true, {}, shapesC.toJSON());

			// NOTE: selectedShapes will be a new (distinct) array for each control model (because
			//	shapesArray is also a new object for each model)
			var selectedShapes = _.filter(shapesArray, function(shapeObj){
				return _.findWhere(shapesData, {id: shapeObj.id});
			});

			var selectedColumns = controlM.get("selectedColumns");

			_.each(selectedColumns, function(columnObj){
				var shapeObj = _.findWhere(selectedShapes, {id: Number(columnObj.shapeId)});
//				debugger;
				if(shapeObj){
					for(var i=0, l=shapeObj.shapeColumnsData.length; i<l; i++){

						if(shapeObj.shapeColumnsData[i].column_number === Number(columnObj.columnNumber)){

							shapeObj.shapeColumnsData[i].isSelected = true;
							shapeObj.shapeColumnsData[i].publicName = columnObj.publicName;
						}
					}
				}
			})
//debugger;
			controlM.set("selectedShapes", selectedShapes);
//			debugger;
		});

		var controlsTableCV = new ControlsTableCV({
			collection: this.controlsC
		})

		this.controlsRegion.show(controlsTableCV);
	},

	addControl: function(){
		// make a new deep clone of shapesC.toJSON()
		var shapesArray = $.extend(true, {}, shapesC.toJSON()),
			shapesData = this.model.get("shapesData");

		// NOTE: selectedShapes will be a new (distinct) array for each control model (because
		//	shapesArray is also a new object for each model)
		var selectedShapes = _.filter(shapesArray, function(shapeObj){
			return _.findWhere(shapesData, {id: shapeObj.id});
		});


		// TODO: prepara de controlM
		var controlM = new Backbone.Model({
			id: _.max(this.controlsC.pluck("id")) + 1,
			selectedShapes: selectedShapes
		});

		this.controlsC.push(controlM);

		// var view = new ControlEditModalIV({
		// 	model: controlM
		// });

        // first set the content of the modal
        // Dashboard["modal2Region"].show(view);

        // // then show the modal 
        // Dashboard["$modal2"].modal("show");
	},

	updateResource: function(){

		var attrs = Backbone.Syphon.serialize(this);

		if(attrs.code===""){
			alert("To create a new map you must submit a code for the map");
			return;
		}			

		// the selected shapes are in the form: {"1": true, "3": false, "8": true}; we want an array of objects like
		// this: [{shapeId: 1}, {shapeId: 8}]
		var temp = [];
		_.forEach(attrs.selectedShapes, function(value, key){
			if(value === true){
				temp.push({"shapeId": key})
			}
		})
		attrs.selectedShapes = temp;

		this.ui.modalSaveBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );

				// if the model has been deleted in the server in the meantime we get a 404; 
				// the collection in the client is then outdated so we call destroy to remove 
				// the deleted model from the collection; we also abort the ajax request immediately 
				// because we are not interested in the response
				if(err.responseJSON && err.responseJSON.statusCode === 404){
					self.model.destroy().abort();
				}
				
				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.finally(function(){
				Dashboard.$modal1.modal("hide");
				self.destroy();
			})
			.done();
//TODO: after we update the associated shape, it doesn't show immediately
	},

});


var MapDeleteModalIV = Mn.ItemView.extend({
	template: "maps/templates/maps-delete-modal.html",

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

var MapNewLV = Mn.LayoutView.extend({
	template: "maps/templates/maps-new.html",

	ui: {
		saveMapBtn: "button.js-save-map",
		editMapBtn: "a.js-edit-map",
		centerRadio: "input[type='radio'][name='center']",
		newMapContainer: "div#new-map-container"
	},

	events: {
		"click  @ui.saveMapBtn": "createResource",
		"change @ui.centerRadio": "updateCenter",
		"click  @ui.editMapBtn": "showAllMaps",
	},

	showAllMaps: function(){
		mapsChannel.trigger("show:all:maps");
	},

	updateCenter: function(e){
		this.model.set("center", $(e.target).val());
	},

	createResource: function(){

		var attrs = Backbone.Syphon.serialize(this);

		// the selected shapes are in the form: {"1": true, "3": false, "8": true}; we want an array of objects like
		// this: [{shapeId: 1}, {shapeId: 8}]



		this.ui.saveMapBtn.prop("disabled", true);

		var self = this;
		Q.delay(150)
			.then(function(){
				return self.model.save(attrs, {wait: true});  // returns a promise
			})
			.then(function(){
				//debugger;
				self.ui.newMapContainer.css("display", "block")
				self.ui.newMapContainer.find(".js-edit-map").attr("href", "/pt/tilemill#/project/" + self.model.get("id"));

				//self.editMap
				//alert("O mapa foi criado com sucesso.");

				// the handler for show:all:shapes will trigger a fake click on the correct
				// anchor elem, this showing the list of maps
				//var x = self.model;
				//debugger;
				//mapsChannel.trigger("show:all:maps");
				//window.open("/pt/tilemill#/project/" + self.model.get("id"));
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );
				
				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			// .finally(function(){
			// 	self.ui.saveMapBtn.prop("disabled", false);
			// })
			.done();

	}
});


var MapRowLV = Mn.LayoutView.extend({
	template: "maps/templates/maps-row.html",
	tagName: "tr",
	ui: {
		"editModalBtn": "button.js-edit",
		"deleteModalBtn": "button.js-delete"
	},

	modelEvents: {
		"change": "render"
	},

	events: {
		"click @ui.editModalBtn": "showEditModal"
	},

	showEditModal: function(){

        var mapEditModalIV = new MapEditModalIV({
            model: this.model
        });


        var self = this;
		Q.all([shapesC.fetch(), textsC.fetch()])
			.then(function(){ 

				// add the map categories to the current map models (to be available in the template)
				var mapCategories = _.filter(textsC.toJSON(), function(obj){
					return _.contains(obj.tags, "map_category");
				});

				self.model.set("mapCategories", mapCategories);

				// do the same with with the shapes collection; however we also want to 
				// add a "isSelected" property, indicating if the shape has been
				// selected or not (for the current model)

				// get the shape data (seleted shapes for the current model)
				var shapesData = self.model.get("shapesData");

				// get a new copy of all the shapes (array)
				var allShapes = shapesC.toJSON();

				_.each(allShapes, function(shapeObj){
					shapeObj.isSelected = _.findWhere(shapesData, {id: shapeObj.id}) ? true : false;
				});

				self.model.set("allShapes", allShapes);

		        // first set the content of the modal
		        Dashboard.modal1Region.show(mapEditModalIV);

		        // then show the modal 
		        Dashboard.$modal1.modal("show");
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );

				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.done();
	},

	behaviors: {

		// ShowEditModal: {
		// 	behaviorClass: window.Behaviors.ShowModal,
		// 	uiKey: "editModalBtn",  // will listen for clicks on @ui.editModalBtn
		// 	viewClass: MapEditModalIV,  // and will show this view
		// },

		ShowDeleteModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "deleteModalBtn",
			viewClass: MapDeleteModalIV 
		},
	}

});

var MapsTableCV = Mn.CompositeView.extend({
	template: "maps/templates/maps-table.html",
	childView: MapRowLV,
	childViewContainer: "tbody"
});
*/

/*

TODO: 
 - add a button or checkbox to select the state: order groups / order web maps;
 - when the checkbox changes we must restart the sortable plugin
 - save
*/


var MapsMenuSortableIV = Mn.ItemView.extend({
	template: "maps/templates/map-menu-sortable.html",

	// the object returned by templateHelpers will be mixed into the 
	// context object returned from serializeData, which is the context
	// object given to nunjucks
	templateHelpers: function(){
		return {
			mode: this.mode 
		};
	},

	onAttach: function(){

		var self = this;

		var sortableOptions = {
			onDrag: function($item, position, _super, event) {

			    // default code from the plugin
			    $item.css(position);

			    // custom code from here below
			    self.adjustScroll($item);
			},

			onDrop: function ($item, container, _super, event) {

			  // default code from the plugin
			  $item.removeClass(container.group.options.draggedClass).removeAttr("style");
			  $("body").removeClass(container.group.options.bodyClass);

			  // custom code from here below (update the collection)
			  self.resetCollection();
			}
		};

		if(this.mode==="maps"){

			sortableOptions = _.extend(sortableOptions, {
				group: 'ul[data-items-type="map-item"]'
			});

			this.mapsMenu = $('ul[data-items-type="map-item"]').sortable(sortableOptions);

			// window.mapsMenu = this.mapsMenu = $('ul[data-items-type="map-item"]').sortable({
			// 	group: 'ul[data-items-type="map-item"]',
			// 	onDrag: function($item, position, _super, event) {
			// 	    // default code from the plugin
			// 	    $item.css(position);

			// 	    // custom code from here below
			// 	    self.adjustScroll($item);
			// 	},
			// });

		}
		else if(this.mode === "groups"){

			sortableOptions = _.extend(sortableOptions, {
			    exclude: "ul[data-items-type='map-item'] > li",
			    nested: false,
			    distance: 10,
				onDrag: function($item, position, _super, event) {
				    // default code
				    $item.css(position);

				    // custom code from here below
				    self.adjustScroll($item);
				},
			});

			this.mapsMenu = $('ul[data-items-type="map-group"]').sortable(sortableOptions);

			// window.mapsMenu = this.mapsMenu = $('ul[data-items-type="map-group"]').sortable({
			//     exclude: "ul[data-items-type='map-item'] > li",
			//     nested: false,
			//     distance: 10,
			// 	onDrag: function($item, position, _super, event) {
			// 	    // default code
			// 	    $item.css(position);

			// 	    // custom code from here below
			// 	    self.adjustScroll($item);
			// 	},
			// });

		}
		else{
			// this should never happen
			throw new Error("MapsMenuOrderLV - unknown mode");
		}
	},

	adjustScroll: function($item){

	    var distanceToTop = $item.offset().top - $(window).scrollTop();
	    var distanceToBottom = $(window).height() + $(window).scrollTop() - $item.offset().top;
	    var currentScrollTop = $(window).scrollTop();

	    // console.log(distanceToTop);
	    // console.log(distanceToBottom);
	    // console.log(currentScrollTop)
	    // console.log("-----");

	    var limit = 100, scrollDelta = 15;
	    if (distanceToTop < limit) {
	        $(window).scrollTop(currentScrollTop - scrollDelta);
	    }
	    else if (distanceToBottom < limit && currentScrollTop < $("body").height() - $(window).height()) {
	        $(window).scrollTop(currentScrollTop + scrollDelta);
	    }
	},

	resetCollection: function(){
//debugger;
		var array = [];

		var $groups = $('ul[data-items-type="map-group"] > li');
		$groups.each(function(i, elem){
			
			//console.log($(this).data("groupName"));
			var obj = {
				groupName: $(elem).data("groupName"),
				maps: []
			};
			
			var $maps = $(elem).find('ul[data-items-type="map-item"] > li');
//			debugger;
			$maps.each(function(i, elem2){

				obj.maps.push({
					mapId: $(elem2).data("mapId")
				});
			});

			array.push(obj);	
		
		});

		this.collection.reset(array);

	},

	onBeforeDestroy: function(){

		this.mapsMenu.sortable("destroy");
	},



});

var MapsMenuAddGroupModalIV = Mn.ItemView.extend({

	template: "maps/templates/map-menu-add-group-modal.html",

	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalAddBtn":   "button.js-modal-add"
	},

	events: {
		"click @ui.modalAddBtn": "addGroup"
	},

	behaviors: {
		CloseModal: {
			// will listen for clicks on @ui.modalCloseBtn
			behaviorClass: window.Behaviors.CloseModal,  
		},
	},

	addGroup: function(){

		var data = Backbone.Syphon.serialize(this);
		var groupName = $.trim(data["add-group-name"]);

		if(!groupName){
			alert("The group name is empty.");
			return;
		}			

		this.collection.add({
			groupName: groupName, 
			maps: []
		});

		Dashboard.$modal1.modal("hide");
		this.destroy();
	}
});

var MapsMenuOrderLV = Mn.LayoutView.extend({

	initialize: function(){
		this.listenTo(this.collection, "add remove", function(){

			this.resetSortableList();
		});
	},

	template: "maps/templates/map-menu.html",
	
	ui: {
		chooseModeRadio: "input[type='radio'][name='menu-order-mode']",
		addGroupBtn: "button#js-menu-add-group",
		removeGroupBtn: "i.fa-trash"
	},

	events: {
		"click button#js-save-map-menu": "saveMapsMenu",
		"change @ui.chooseModeRadio": "resetSortableList",
		"click @ui.removeGroupBtn": "removeGroup"
		//"click @ui.addGroupBtn": "addGroup",
	},

	// collectionEvents: {
	// 	"add": "resetSortableList"
	// },

	regions: {
		sortableRegion: "#mn-r-sortable-list"
	},

	behaviors: {

		ShowAddGroupModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "addGroupBtn",  // will listen for clicks on @ui.editModalBtn
			viewClass: MapsMenuAddGroupModalIV  // and will show this view
		},
	},


	removeGroup: function(e){

		var groupName = $(e.target).parent().data("groupName");
		var model = this.collection.findWhere({groupName: groupName});
		this.collection.remove(model);
	},

	resetSortableList: function(e){
		
		if(!this.onAttachHasExecuted){
			return;
		}
		
		//var m = new Backbone.Model({ groupName: "xyz", maps: []});
		//this.collection.add(m);

		var mapsMenuSortableIV = new MapsMenuSortableIV({
			collection: this.collection
		});

		// if the method is being executed as the click event handler,
		// get the updated mode
		if(e && e.target){
			mapsMenuSortableIV.mode = $(e.target).val();
		}
		else{
			mapsMenuSortableIV.mode  = this.sortableRegion.currentView.mode;
		}

		this.sortableRegion.show(mapsMenuSortableIV);
	},

	onAttach: function(){

		this.onAttachHasExecuted = true;

		// the default mode is the one in the 1st radio (order maps)
		this.ui.chooseModeRadio.first().trigger("click");
		
	},

	saveMapsMenu: function(){

		// we don't need to save the maps in the "not published" group
		// (that group will be dynamically generated when reading the contents of the menu)
		var menuData = this.collection.toJSON();
		for(var i=0; i<menuData.length; i++){
			if(menuData[i].groupName === "not published"){
				menuData.splice(i, 1);
				break;
			}
		}

		// IMPORTANT: in the ajax request below we are "sending an array of object",
		// so we must do this:
		//  - "content-type" should be json
		//  - "data" must be the stringified array
		// this is in constrast to the situation where we want to "send an object"
		var ajaxOptions = {
			url: "/api/v1/maps-menu",
			method: "PUT",
			data: JSON.stringify(menuData),
			contentType:"application/json; charset=utf-8",
		};

		Q.delay(250)
			.then(function(){
				return $.ajax(ajaxOptions);
			})
			.then(function(){

				Clima.notify("success", "The menu has been saved");
			})
			.catch(function(err){

				var errMsg = Clima.getErrorMessage(err);
				var msg = "The menu has not been saved (ERROR: " + errMsg + ")"
				
				Clima.notify("danger", msg, 20000);
			});



/*
Note: the payload should be like this:

[
    {
        "groupName": "published", 
        "maps": [
            { "mapId": "geography-class" }
        ], 
    }, 
    {
        "groupName": "not published", 
        "maps": [
            { "mapId": "new-mapa-1-owe-gw" }, 
            { "mapId": "open-streets-dc" }, 
            { "mapId": "road-trip" }
        ], 
    }
]

*/		
	}
});



var SequentialMapsDeleteIV = Mn.ItemView.extend({

	template: "maps/templates/sequential-maps-delete.html",

	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
		"modalDeleteBtn":   "button.js-modal-delete"
	},

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
		},
		DeleteResourceAndCloseModal: {
			// will listen for clicks on @ui.modalDeleteBtn
			behaviorClass: window.Behaviors.DeleteResourceAndCloseModal,  
		},
	},

});

/*
var SequentialMapsNewIV = Mn.ItemView.extend({
	template: "maps/templates/sequential-maps-new.html",

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
		var self = this;

		Dashboard.$modal1.modal("hide");
		self.destroy();
	}
});


var SequentialMapsEditIV = Mn.ItemView.extend({
	template: "maps/templates/sequential-maps-edit.html",

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
		var self = this;

		Dashboard.$modal1.modal("hide");
		self.destroy();
	}
});
*/



var SequentialMapsRowLV = Mn.LayoutView.extend({
	template: "maps/templates/sequential-maps-row.html",
	tagName: "tr",
	ui: {
		"editModalBtn": "button.js-edit",
		"deleteModalBtn": "button.js-delete"
	},
	modelEvents: {
		"change": "render"
	},

	behaviors: {

		// ShowEditModal: {
		// 	behaviorClass: window.Behaviors.ShowModal,
		// 	uiKey: "editModalBtn",  // will listen for clicks on @ui.editModalBtn
		// 	viewClass: SequentialMapsEditIV  // and will show this view
		// },

		ShowDeleteModal: {
			behaviorClass: window.Behaviors.ShowModal,
			uiKey: "deleteModalBtn",
			viewClass: SequentialMapsDeleteIV 
		},
	},

});

var SequentialsMapsTableCV = Mn.CompositeView.extend({
	template: "maps/templates/sequential-maps-table.html",
	childView: SequentialMapsRowLV,
	childViewContainer: "tbody",
});









var LegendPreviewModalIV = Mn.ItemView.extend({
	template: "maps/templates/legends-preview-modal.html",

	ui: {
		"modalCloseBtn":  "button.js-modal-cancel",
	},

	behaviors: {
		CloseModal: {
			behaviorClass: window.Behaviors.CloseModal,  // will listen for clicks on @ui.modalCloseBtn
		},
	},
});

var LegendsCodeIV = Mn.ItemView.extend({
	template: "maps/templates/legends-code.html",

	ui: {
		selectCodeBtn: "button.js-select-code",
		legendPreviewBtn: "button#code-html-preview"
	},

	events: {
		"click @ui.selectCodeBtn":   "selectCodeBlock",
	},
	
	behaviors: {

		ShowLegendPreviewModal: {
			uiKey: "legendPreviewBtn",  // listen for clicks on @ui.editModalBtn (the "click" event is hardcoded in the behaviour)...
			behaviorClass: window.Behaviors.ShowModal,  // will execute the ShowModal behaviour...
			viewClass: LegendPreviewModalIV,  // creating an instance of this view...
			modelKey: "model"  // and using the model referenced in this key
		},
	},

	onAttach: function(){

		// execute the prism plugin

		// trim any remaining space in the begin and end
		this.$("code").text(function(i, oldText){
			return $.trim(oldText);
		});

		Prism.highlightAll();
	},

	selectCodeBlock: function(e){

		var id = $(e.target).prop("id");
		if(id==="code-carto-0"){
			this.$("#js-carto-0.language-css").selectText();
		}
		else if(id==="code-carto-1"){
			this.$("#js-carto-1.language-css").selectText();
		}
		else if(id==="code-html"){
			this.$(".language-markup").selectText();
		}
	},
})

var LegendColorsLV = Mn.LayoutView.extend({
	template: "maps/templates/legends-colors.html",
	events: {
		"change         input.js-classes-left-extreme": "showCodeAgain",
		"propertychange input.js-classes-left-extreme": "showCodeAgain",
		"input          input.js-classes-left-extreme": "showCodeAgain",

		"change         input.js-classes-right-extreme": "showCodeAgain",
		"propertychange input.js-classes-right-extreme": "showCodeAgain",
		"input          input.js-classes-right-extreme": "showCodeAgain"
	},
	regions: {
		codeRegion: "#code-region"
	},

	updateClassValues: function(){
		var dataType = this.model.get("dataType");

		var currentLeftExtremes  = this.getInputValues('input.js-classes-left-extreme',  dataType);
		var currentRightExtremes = this.getInputValues('input.js-classes-right-extreme', dataType);
		var currentColors        = this.getInputValues('input.my-color-picker');
//debugger;

		// update the objects in the "scale" array
		var scale = this.model.get("scale");

		if(currentLeftExtremes.length !== scale.length ||
				currentRightExtremes.length !== scale.length ||
				currentColors.length !== scale.length){
			throw new Error("Unexpected array length");
		}
		
		for(var i=0; i<scale.length; i++){
			scale[i].valueClass[0] = currentLeftExtremes[i];
			scale[i].valueClass[1] = currentRightExtremes[i];
			scale[i].colorHex      = currentColors[i];
		}

		this.model.set("scale", scale);
	},

	showCodeAgain: function(e){

// TODO: if dataType is int or real, check all the values are actually numbers

		this.updateClassValues();
		var legendsCodeIV = new LegendsCodeIV({
			model: this.model
		});
		this.codeRegion.show(legendsCodeIV);			

		// destroys the colorpicker plugin and unbind all .colorpicker events
		//this.$('.my-color-picker').colorpicker('destroy');

		// re-render the view (the plugin will be initialized again in the new elements)
		//this.render();

		// make sure focus is in the right place (this implies the scroll will be in the right place too)
		//this.$("#" + currentId).caretToEnd();
		//this.$("#" + currentId).focus();
	},

	getInputValues: function(classSelector, dataType){
		return this.$(classSelector)
						.map(function(){ 

							var value = $(this).val();

							if(dataType==="int"){
								value = parseInt(value, 10);
							}
							else if(dataType==="real"){
								value = parseFloat(value);
							}

							return value;
						})
						.get();
	},

	onRender: function(){

		// bootstrap color-picker plugin

		this.$(".my-color-picker").colorpicker({
            customClass: 'colorpicker-2x',
            sliders: {
                saturation: {
                    maxLeft: 150,
                    maxTop: 150
                },
                hue: {
                    maxTop: 150
                },
                alpha: {
                    maxTop: 150
                }
            }
        });

		//this.model.set("colorPickerHasInitialized", true);

		var self = this;
		this.$('.my-color-picker').colorpicker().on('hidePicker.colorpicker', function(e){
debugger;
			// make sure the color is in hex code (if the user used a transparency, it will in rgba)
			$(e.target).val(e.color.toHex());

			self.updateClassValues();
			self.render();

		});


		if(this.model.get("scale")){
			var legendsCodeIV = new LegendsCodeIV({
				model: this.model
			});
			this.codeRegion.show(legendsCodeIV);			
		}


	},

	onBeforeDestroy: function(){
		//this.$('.my-color-picker').colorpicker('destroy');
	}

});




var LegendChooseAttributeLV = Mn.LayoutView.extend({

	initialize: function(){
	},

	template: "maps/templates/legends-choose-attribute.html",

	ui: {
		availableAttributes: "select.js-available-attributes",
		numberOfClasses: "select.js-number-classes",
		colorSchemeSelect: "select.js-color-scheme",
		invertColorsChkbox: "input#js-invert-colors",
		lightCorrectionChkbox: "input#js-light-correction",
		darkenColorsBtn: "button#js-darken-colors",
		brightenColorsBtn: "button#js-brighten-colors",
		saturateColorsBtn: "button#js-saturate-colors",
		desaturateColorsBtn: "button#js-desaturate-colors",

		legendStyleRadio: "input:radio[name='legend-style']",

	},

	events: {
		"change @ui.availableAttributes": "updateSelectedAttribute",
		"change @ui.numberOfClasses":     "updateSelectedClass",
		"change @ui.colorSchemeSelect":         "updateSelectedColorScheme",
		
		"change @ui.invertColorsChkbox":    "invertColors",
		"change @ui.lightCorrectionChkbox": "lightCorrection",
		

		"click @ui.darkenColorsBtn":      "darkenColors",
		"click @ui.brightenColorsBtn":    "brightenColors",
		"click @ui.saturateColorsBtn":    "saturateColors",
		"click @ui.desaturateColorsBtn":  "desaturateColors",

		"click @ui.legendStyleRadio": "updateLegendStyle"
		
	},


	updateLegendStyle: function(e){

		this.aux.set("legendStyle", $(e.target).val());
		this.updateClasses();
	},


	darkenColors: function(e){

		//this.aux.set("colorValue", this.aux.get("colorValue") + 4);
		this.aux.set("colorValue", 4);
		this.updateClasses();
		this.aux.set("colorValue", 0);
	},

	brightenColors: function(e){

		//this.aux.set("colorValue", this.aux.get("colorValue") - 4);
		this.aux.set("colorValue", -4);
		this.updateClasses();
		this.aux.set("colorValue", 0);
	},

	saturateColors: function(e){

		//this.aux.set("colorSaturation", this.aux.get("colorSaturation") + 4);
		this.aux.set("colorSaturation", 4);
		this.updateClasses();
		this.aux.set("colorSaturation", 0);
	},

	desaturateColors: function(e){

		//this.aux.set("colorSaturation", this.aux.get("colorSaturation") - 4);
		this.aux.set("colorSaturation", -4);
		this.updateClasses();
		this.aux.set("colorSaturation", 0);
	},

	invertColors: function(e){
//debugger;
		//this.aux.set("invertColors", this.ui.invertColorsChkbox.is(':checked'));
		this.aux.set("invertColors", true);
		this.updateClasses();
		this.aux.set("invertColors", false);
	},

	lightCorrection: function(e){
//debugger;
		this.aux.set("lightCorrection", this.ui.lightCorrectionChkbox.is(':checked'));
		this.updateClasses();
	},

	invertColorsOrder: function(scale){

		var reversedScale = [];

		for(var i=0, l=scale.length; i<l; i++){
			var j = l-i;
			reversedScale.push({
				"valueClass": scale[i]["valueClass"],
				"colorHex": scale[j-1]["colorHex"]
			});
		}

		return reversedScale;
	},

	changeColors: function(scale, method, amount){

		var changedScale = [];
		for(var i=0, l=scale.length; i<l; i++){
			changedScale.push({
				"valueClass": scale[i]["valueClass"],
				"colorHex": chroma(scale[i]["colorHex"])[method](amount).hex()
			});
		}

		return changedScale;
	},

	regions: {
		colorsRegion: "#js-colors-region"
	},

	updateSelectedAttribute: function(e){
//debugger;
		this.aux.set("columnName", $(e.target).val());

		// when the attribute changes, the selected options in "number of classes"
		// and "color scheme" will always be reset (because the number of classes 
		// depends on the max and min of the attribute)
		this.ui.numberOfClasses.val(0).prop("disabled", true);
		this.aux.set("selectedClass", 0);

		this.ui.colorSchemeSelect.val("").prop("disabled", true);
		this.aux.set("colorScheme", "");

		this.aux.set("legendStyle", "vertical");

		if(!this.aux.get("columnName")){
			this.colorsRegion.empty();
			return;
		}

		var shapeM = shapesC.findWhere({ tableName: this.aux.get("tableName") });

		var attributeInfo = _.findWhere(shapeM.get("attributesInfo"), 
										{column_name: this.aux.get("columnName")});

		var gidAttributeInfo = _.findWhere(shapeM.get("attributesInfo"), 
										{column_name: "gid"});

		var pgDataType = attributeInfo.data_type;
		var isInt  = /int/.test(pgDataType);
		var isReal = /numeric/.test(pgDataType) ||  /double/.test(pgDataType) || /decimal/.test(pgDataType) || /real/.test(pgDataType);
		var isChar = /char/.test(pgDataType) || /text/.test(pgDataType);

		var dataType = isInt ? "int" : (isReal ? "real": "char");
		this.aux.set("isInt", isInt);
		this.aux.set("dataType", dataType);

		this.aux.set("count", parseInt(attributeInfo.count, 10) );
		this.aux.set("countGeometries", parseInt(gidAttributeInfo.count, 10));

		if(this.aux.get("dataType")==="int"){
			this.aux.set("min", parseInt(attributeInfo.min, 10));
			this.aux.set("max", parseInt(attributeInfo.max, 10));
		}
		else if(this.aux.get("dataType")==="real"){
			this.aux.set("min", parseFloat(attributeInfo.min));
			this.aux.set("max", parseFloat(attributeInfo.max));	
		}
		else if(this.aux.get("dataType")==="char"){

			// even if dataType is char, we might have attributeInfo.distinct_words equal to null (that happens when
			// the number of distinct word is >= 12)
			var numDistinctWords = 0;
			if(attributeInfo.distinct_words){
				numDistinctWords = attributeInfo.distinct_words.length;
			}

			this.aux.set("selectedClass", numDistinctWords);

			for(var i=0; i<numDistinctWords; i++){
				if(attributeInfo.distinct_words[i] == null){
					attributeInfo.distinct_words[i] = undefined;
				}
			}

			this.aux.set("distinctWords", attributeInfo.distinct_words);
		}
		else{
			throw new Error("Unknown data type");
		}

		this.aux.set("scale", false);
		

		// enable the the color select
		this.ui.colorSchemeSelect.prop("disabled", false);

		// enable the the number of classes select (only if the attribute is numeric)
		if(this.aux.get("dataType")==="int" || this.aux.get("dataType")==="real"){
			this.ui.numberOfClasses.prop("disabled", false);
		}
		else{
			this.ui.numberOfClasses.prop("disabled", true);
			this.ui.numberOfClasses.val(this.aux.get("selectedClass"));
		}
	

		this.showLegendColors();
	},

	updateSelectedClass: function(e){

		this.aux.set("selectedClass", parseInt($(e.target).val(), 10));
		this.aux.set("scale", false);
		
		this.updateClasses();
	},

	updateSelectedColorScheme: function(e){
//debugger;
		this.aux.set("colorScheme", $(e.target).val());

		// reset saturation and color brightness
		this.aux.set("colorSaturation", 0);
		this.aux.set("colorValue", 0);
		this.aux.set("scale", false);

		this.updateClasses();
	},

	updateClasses: function(){
//debugger;
		var selectedAttribute = this.aux.get("columnName");
		var selectedClass     = this.aux.get("selectedClass");
		var colorScheme = this.aux.get("colorScheme");

		if(!selectedAttribute){
			return;
		}

		var tableName = this.aux.get("tableName");
		var dataType = this.aux.get("dataType");
		var min = this.aux.get("min");
		var max = this.aux.get("max");
		var distinctWords = this.aux.get("distinctWords");


		if(dataType === "int" || dataType === "real"){
			if(!_.isNumber(min) || !_.isNumber(max)){
				alert("ERROR: minimum and maximum of the selected attribute are not numbers");
				return;				
			}
		}


		if(!selectedClass || !colorScheme){
			// show the legend without the colors (will show only max and min)
			this.aux.set("scale", false);
			this.showLegendColors();
			return;
		}

		if(dataType === "int"){
			var intervalLength = max - min + 1;
			if(selectedClass > intervalLength){
				alert("The number of classes must be <= " + intervalLength);
				return;					
			}
		}

		var valueClasses = Dashboard.utils.valueClasses({
		    mode: dataType,
		    min: min,
		    max: max,
		    distinctWords: distinctWords,
		    numClasses: selectedClass
		});


		if(dataType === "int" || dataType === "real"){
			if(valueClasses.length !== selectedClass){
				throw new Error("The valueClasses array has unexpected length");
			}			
		}


		// the correctLightness option gives better colors, but only works for sequential colors
		var lightCorrection = false
		var sequentialSchemes = ["Blues","Greens","Greys","Oranges","Purples","Reds","BuGn","BuPu","GnBu","OrRd","PuBu","PuBuGn","PuRd","RdPu","YlGn","YlGnBu","YlOrBr","YlOrRd"];

		if(_.contains(sequentialSchemes, colorScheme) && this.aux.get("lightCorrection")){
			lightCorrection = true;
		}

		this.aux.set("lightCorrection", lightCorrection);

		// get the actual colors (from chroma.js library)
		//var chromaScale = chroma.scale(colorScheme).correctLightness(lightCorrection).domain([0, selectedClass], selectedClass);
		// var chromaColors = chroma
		// 					.scale(colorScheme)
		// 					.correctLightness(lightCorrection)
		// 					.domain([0, selectedClass], selectedClass)
		// 					.colors();
		// 					debugger;

		var chromaColors = Clima.utils.colorBrew[colorScheme][selectedClass];
		if(chromaColors===undefined){
			var keys = _.keys(Clima.utils.colorBrew[colorScheme]);
			alert("This color schema is valid only from " + _.min(keys) + " to " + _.max(keys) + " classes.");
			return;
		}

		if(chromaColors.length !== selectedClass){
			throw new Error("The chromaColors array has unexpected length");
		}		

		// finally, create a new array of objects with the data ready to used in the template

		var scale = this.aux.get("scale");

		if(!scale){
			scale = valueClasses.map(function(valueClass, i){
				var obj = { 
					"valueClass": valueClass,
					"colorHex": chromaColors[i]
				};
				return obj;
			});
		}

		if(this.aux.get("invertColors")){
			scale = this.invertColorsOrder(scale);
		}

		if(this.aux.get("colorValue")){
			//console.log("colorValue: disabled temporarily")
			scale = this.changeColors(scale, "darken", this.aux.get("colorValue"));
		}

		if(this.aux.get("colorSaturation")){
			//console.log("colorSaturation: disabled temporarily")
			scale = this.changeColors(scale, "saturate", this.aux.get("colorSaturation"));
		}

		this.aux.set("scale", scale);

		this.showLegendColors();
	},

	showLegendColors: function(){
		var legendColorsLV = new LegendColorsLV({
			model: new Backbone.Model(this.aux.toJSON())
			
		});

		this.colorsRegion.show(legendColorsLV);
		this.bindUIElements();
	}
});

var LegendNoAvailableAttributesIV = Mn.ItemView.extend({
	template: "maps/templates/legends-no-available-attributes.html",
});

var LegendChooseShapeLV = Mn.LayoutView.extend({
	template: "maps/templates/legends-choose-shape.html",
	events: {
		"change select.js-available-shapes": "updateChooseAttributes"
	},
	regions: {
		chooseAttributeRegion: "#choose-attribute-region"
	},


	// isNumeric: function(type){

	// 	type = type.toLowerCase();
	// 	return /int/.test(type) || 
	// 			/decimal/.test(type) || 
	// 			/numeric/.test(type) || 
	// 			/real/.test(type) || 
	// 			/double/.test(type);
	// },

	updateChooseAttributes: function(e){

//debugger;
		var shapeName = $(e.target).val();
		var selectedShape = shapesC.findWhere({tableName: shapeName});

		// we only want the data attributes with numeric type; the "gid" attribute (added
		// by pgsql) is also excluded explicitely;
		var availableAttributes = selectedShape.get("attributesInfo").filter(function(obj){
			if(obj["column_name"]==="gid"){ return false; }

			// returns true except for the geometry columns
			return !(/geometry/.test(obj["data_type"].toLowerCase()));
		}, this);

		if(availableAttributes.length === 0){
			this.chooseAttributeRegion.show(new LegendNoAvailableAttributesIV());
			return;
		}

		var legendChooseAttributeLV = new LegendChooseAttributeLV({
			collection: new Backbone.Collection(availableAttributes)
		});

		var geometryTypePrimitive, geometryType = selectedShape.get("geometryType");

		// WKT can represent 18 distinct geometric objects; here we consider only the basic types;
		// https://en.wikipedia.org/wiki/Well-known_text
		// http://postgis.net/docs/using_postgis_dbmanagement.html#EWKB_EWKT
		if(/point/.test(geometryType)){
			geometryTypePrimitive = "point";
		}
		else if(/linestring/.test(geometryType)){
			geometryTypePrimitive = "linestring";
		}
		else if(/polygon/.test(geometryType)){
			geometryTypePrimitive = "polygon";
		}

		legendChooseAttributeLV.aux = new Backbone.Model({
			tableName: selectedShape.get("tableName"),
			geometryTypePrimitive: geometryTypePrimitive,
			mapName: this.get("mapName"),
			mapId: this.get("mapId")
		});

		this.chooseAttributeRegion.show(legendChooseAttributeLV);
	}
});

var LegendNoAvailableShapeIV = Mn.ItemView.extend({
	template: "maps/templates/legends-no-available-shapes.html",
});

var LegendChooseMapLV = Mn.LayoutView.extend({
	template: "maps/templates/legends-choose-map.html",
	events: {
		"change select.js-all-maps": "updateChooseShapes",
		//"change select.js-available-shapes": "updateChooseAttributes"
	},
	regions: {
		chooseShapeRegion: "#choose-shape-region",
//		ChooseAttributesRegion: "#available-attributes-region"
	},
	updateChooseShapes: function(e){
		var mapId = $(e.target).val();
		var mapM = mapsC.get(mapId);

		var availableShapesNames = [];
		mapM.get("Layer").forEach(function(mapObj){
			if(mapObj.Datasource && mapObj.Datasource.type === "postgis"){
				availableShapesNames.push(mapObj.id);
			}
		});

		var availableShapes = shapesC.filter(function(model){
			return _.contains(availableShapesNames, model.get("tableName"));
		});

		if(availableShapes.length === 0){
			this.chooseShapeRegion.show(new LegendNoAvailableShapeIV());
			return;
		}

		var legendChooseShapeLV = new LegendChooseShapeLV({
			collection: new Backbone.Collection(availableShapes),
		});
		_.defaults(legendChooseShapeLV, Backbone.Attributes);
		legendChooseShapeLV.set("mapName", mapM.get("name"));
		legendChooseShapeLV.set("mapId", mapM.get("id"));

		this.chooseShapeRegion.show(legendChooseShapeLV);

	},

});

var MapsTabLV = Mn.LayoutView.extend({

	initialize: function(){
		mapsChannel.on("show:all:shapes", function(){
			this.$("a[data-tab-separator='shapes-all']").trigger("click");
		}, this);

		mapsChannel.on("show:all:maps", function(){
			this.$("a[data-tab-separator='maps-all']").trigger("click");
		}, this);
	},

	template: "maps/templates/maps-tab.html",

	regions: {
		tabContentRegion: "#maps-region"
	},

	events: {
		"click a.js-dashboard-sep": "updateView"
	},

	// the initial view will be the list of all files
	onBeforeShow: function(){
		//this.showAllMaps();
		this.showAllShapes();
	},

	onDestroy: function(){
		mapsChannel.reset();
	},

	updateView: function(e){

		e.preventDefault();

		var $target = $(e.target);
		$target.parent().siblings().removeClass("active");
		$target.parent().addClass("active");

		switch($target.data("tab-separator")){


			// case "maps-all":
			// 	this.showAllMaps();
			// 	break;
			// case "maps-new":
			// 	this.showNewMap();
			// 	break;
			case "shapes-all":
				this.showAllShapes();
				break;
				// case "shapes-new":
				// 	this.showNewShape();
				// 	break;
			case "map-menu":
				this.showMapsMenu();
				break;
			case "map-sequential":
				this.showSequentialMaps();
				break;
			case "map-legends":
				this.showMapsLegends();
				break;
			default:
				throw new Error("unknown tab separator");
		}
	},

	// showNewShape: function(){
	// 	var shapeM = new ShapeM();
	// 	var shapeNewIV = new ShapeNewIV({
	// 		model: shapeM
	// 	});

	// 	var self = this;

	// 	// filesC will be filtered
	// 	Q(filesC.fetch())
	// 		.then(function(){ 

	// 			var zipFilesWithShapes = _.filter(filesC.toJSON(), function(obj){
	// 				return _.contains(obj.tags, "map") || 
	// 						_.contains(obj.tags, "maps") ||
	// 						_.contains(obj.tags, "mapa") ||
	// 						_.contains(obj.tags, "mapas") ||
	// 						_.contains(obj.tags, "shape") ||
	// 						_.contains(obj.tags, "shapes");
	// 			});
	// 			shapeM.set("zipFilesWithShapes", zipFilesWithShapes)

	// 			self.tabContentRegion.show(shapeNewIV); 
	// 		})
	// 		.catch(function(err){
	// 			var msg = err.responseJSON ? err.responseJSON.message : 
	// 										( err.message ? err.message : "unknown error" );

	// 			alert("ERROR: " + msg);
	// 			throw new Error(msg);
	// 		})
	// 		.done();


	// },

	showAllShapes: function(){

		var shapesTableCV = new ShapesTableCV({
			collection: shapesC
		});

		var self = this;

		Q(shapesC.fetch())
			.then(function(){ 
				self.tabContentRegion.show(shapesTableCV); 
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

/*
	showNewMap: function(){
		var mapM = new MapM();
		var mapNewLV = new MapNewLV({
			model: mapM
		});

		this.tabContentRegion.show(mapNewLV); 


		var self = this;

		// // textsC will be used to obtain the map categories (which will be shown in the template)
		// Q.all([textsC.fetch(), shapesC.fetch()])
		// 	.then(function(){ 

		// 		// add the map categories to the model (to be available in the template)
		// 		var mapCategories = _.filter(textsC.toJSON(), function(obj){
		// 			return _.contains(obj.tags, "map_category");
		// 		})
		// 		mapM.set("mapCategories", mapCategories);

		// 		// do the same with the the shapes collection
		// 		mapM.set("allShapes", shapesC.toJSON());

		// 		self.tabContentRegion.show(mapNewLV); 
		// 	})
		// 	.catch(function(err){
		// 		var msg = err.responseJSON ? err.responseJSON.message : 
		// 									( err.message ? err.message : "unknown error" );

		// 		alert("ERROR: " + msg);
		// 		throw new Error(msg);
		// 	})
		// 	.done();

	},

	showAllMaps: function(){

		var mapsTableCV = new MapsTableCV({
			collection: mapsC
		});

		var self = this;

		Q(mapsC.fetch())
			.then(function(){ 

				self.tabContentRegion.show(mapsTableCV); 
			})
			.catch(function(err){
				var msg = err.responseJSON ? err.responseJSON.message : 
											( err.message ? err.message : "unknown error" );

				alert("ERROR: " + msg);
				throw new Error(msg);
			})
			.done();
	},
*/
	showMapsMenu: function(){
		var mapsMenuOrderLV = new MapsMenuOrderLV({
			collection: mapsMenuC
		});

		var self = this;

		Q(mapsMenuC.fetch())
			.then(function(){ 
				self.tabContentRegion.show(mapsMenuOrderLV);
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

	showSequentialMaps: function(){

		var sequentialsMapsTableCV = new SequentialsMapsTableCV({
			collection: sequentialMapsC
		});


		var self = this;

		Q(sequentialMapsC.fetch())
			.then(function(){ 

				self.tabContentRegion.show(sequentialsMapsTableCV);
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

	showMapsLegends: function(){
		var legendChooseMapLV = new LegendChooseMapLV({
			collection: mapsC
		});

		var self = this;

		Q.all([mapsC.fetch(), shapesC.fetch()])
			.then(function(){ 
				self.tabContentRegion.show(legendChooseMapLV);
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
