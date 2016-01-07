
var LayerM = Backbone.Model.extend({
    initialize: function(){

        // apply the backbone.select mixin (must also be done in the respective collection)
        Backbone.Select.Me.applyTo(this);

        this.on("change:opacity", this.changeOpacity);
        this.on("change:zindex", this.changeZIndex);

        // if this is a sequential map, construct the respective control (ready to be added to the map when 
            // the sequential map is selected)
//         var sequence = this.get("tileJson").sequence;
//         if(sequence){

//             // var mapIndex = this.get("mapIndex");
//             // sequence.forEach(function(seqObj){
//             //     seqObj.mapIndex = mapIndex;
//             // });
// debugger;
//             var sequenceIV = new SequenceIV({
//                 collection: new Backbone.Collection(sequence)
//             });
//             sequenceIV.render();
    
//             // create the control instance and add to the map
//             this.sequenceControl = new L.Control.BackboneView({
//                 view: sequenceIV,
//                 position: "topright"
//             });



//         }

    },

    changeOpacity: function(model, newOpacity){

        this.get("tileLayer").setOpacity(newOpacity/100);
        //setTimeout(Cartografia.updateUrl, 1000);
        Cartografia.updateUrlDebounce();
        
    },

    changeZIndex: function(model, newZIndex){

        this.get("tileLayer").setZIndex(newZIndex);
        //setTimeout(Cartografia.updateUrl, 1000);
        Cartografia.updateUrlDebounce();
    },

    addSequentialControl: function(){

        // for sequential maps, the tileLayer property is a collection
        if(this.get("tileLayer") instanceof Backbone.Collection){

            this.sequenceControlIV = new SequenceControlIV({
                collection: this.get("tileLayer")
            });
            this.sequenceControlIV.render();
    
            // create the control instance and add to the map
            this.sequenceControl = new L.Control.BackboneView({
                view: this.sequenceControlIV,
                position: "topright"
            });

            var leafletMap = this.collection.parent.get("leafletMap");
            leafletMap.addControl(this.sequenceControl);

           this.sequenceControlIV.selectFirst();
           
        }
    },

    removeSequentialControl: function(){

        if(this.sequenceControl){
            this.sequenceControlIV.stopSequence();
            this.sequenceControlIV.deselectAllMaps();
            var leafletMap = this.collection.parent.get("leafletMap");
            leafletMap.removeControl(this.sequenceControl);
            this.sequenceControlIV.destroy();
            this.sequenceControlIV = undefined;
        }

    }
});


var LayersBaseC = Backbone.Collection.extend({

    addTileLayer: function(layerM){
//debugger;
        var leafletMap = layerM.collection.parent.get("leafletMap");

        if(!leafletMap || leafletMap.hasLayer(layerM.get("tileLayer"))){
            return;
        }

        // 1. add the tile layer

        leafletMap.addLayer(layerM.get("tileLayer"));
        if(layerM.get("tileJson").isExclusive){
            layerM.get("tileLayer").setZIndex(-1);    
        }
        

        // 2. add the grid layer (UTF tiles) + the respective grid control

        if(layerM.has("gridLayer")){
            leafletMap.addLayer(layerM.get("gridLayer"));
            leafletMap.addControl(layerM.get("gridControl"));                

            layerM.get("gridLayer").on('click', function(e) {
                var x = 1;
                //debugger;
            });

        }


        // 3. add the legend (if defined in the project in tilemill)

        var legend = layerM.get("tileJson").legend;
        if(legend){
            leafletMap.legendControl.addLegend(legend);
        }

/*
        // update the "active" property in the mapsMenu array
        var mapsMenu = layerM.collection.parent.get("mapsMenu");
        _.each(mapsMenu, function(groupObj){
            _.each(groupObj.maps, function(mapObj){

                if(mapObj.mapId === layerM.get("id")){
                    debugger;
                    mapObj.active = true;
                }

            }, this);
        }, this);
*/
    },

    removeTileLayer: function(layerM){

        var leafletMap = layerM.collection.parent.get("leafletMap");

        if(!leafletMap || !leafletMap.hasLayer(layerM.get("tileLayer"))){
            return;
        }

        // 1. remove the tile layer
        leafletMap.removeLayer(layerM.get("tileLayer"));

        // 2. remove the grid layer (UTF tiles) + the respective grid control
        if(layerM.has("gridLayer")){
            leafletMap.removeLayer(layerM.get("gridLayer"));
            leafletMap.removeControl(layerM.get("gridControl"));                
        }


        // 3. remove the legend (if defined in the project in tilemill)

        var legend = layerM.get("tileJson").legend;
        if(legend){
            leafletMap.legendControl.removeLegend(legend);
        }


        // update the "active" property in the mapsMenu array
        var mapsMenu = layerM.collection.parent.get("mapsMenu");
        _.each(mapsMenu, function(groupObj){
            _.each(groupObj.maps, function(mapObj){

                if(mapObj.mapId === layerM.get("id")){
                    mapObj.active = false;
                }

            }, this);
        }, this);
    },

    updateMenuEntry: function(layerM, status){

        var mapsMenu = layerM.collection.parent.get("mapsMenu");
        _.each(mapsMenu, function(groupObj){
            _.each(groupObj.maps, function(mapObj){

                if(mapObj.mapId === layerM.get("id")){
                    mapObj.active = status;
                }

            }, this);
        }, this);

    },

    // update the layers in the underlying leaflet map (tileLayer, gridlayer, etc)
    addLayer: function(layerM){
//debugger;

        var tileLayer = layerM.get("tileLayer");

        // if it is a regular map, the tileLayer property will be an instance of L.TileLayer...
        if(tileLayer && tileLayer instanceof L.TileLayer){

            this.addTileLayer(layerM);
            this.updateMenuEntry(layerM, true)
        }
        // if it is a sequential map, it will be a Backbone collection
        else if(tileLayer instanceof Backbone.Collection){

            // this is a sequential map
            layerM.addSequentialControl();
            this.updateMenuEntry(layerM, true)
        }
        else{
            throw new Error("invalid Tilelayer");
        }
    },

    removeLayer: function(layerM){
//debugger;

        var tileLayer = layerM.get("tileLayer");

        if(tileLayer && tileLayer instanceof L.TileLayer){

            this.removeTileLayer(layerM);
            this.updateMenuEntry(layerM, false)
        }
        else if(tileLayer instanceof Backbone.Collection){

            layerM.removeSequentialControl();
            this.updateMenuEntry(layerM, false)
        }
        else{
            throw new Error("invalid Tilelayer");
        }
    }



});

var LayersC = LayersBaseC.extend({
    model: LayerM,
    initialize: function(models) {

        // apply the backbone.select mixin (must also be done in the respective model)
        Backbone.Select.Many.applyTo(this, models);


        // listen for the events triggered by the select plugin

        // NOTE: we have to listen to select:all and select:none as well;
        // if there is only 2 models selected and we deselect 1, the event that fires
        // is "select:some";
        // but if there is only 1 model selected and we deselect it, the event that fires
        // is "select:none" ("select:some" is not fired in this case)
        this.on("select:some select:all select:none", this.updateLayers);

    },    

    // update the layers in the underlying leaflet map (tileLayer, gridlayer, etc)
    updateLayers: function(diff){

        var selected = diff.selected;
        var deselected = diff.deselected;

        // the selected array holds models which have been newly selected ;
        // likewise, models in the deselected array have changed their status from 
        // selected to deselected
        var i,l;
        for(i=0, l=selected.length; i<l; i++){
            this.addLayer(selected[i]);
        }

        // repeat for models that have been deselected
        for(i=0, l=deselected.length; i<l; i++){
            this.removeLayer(deselected[i]);
        }
    }
});


var ExclusiveLayersC = LayersBaseC.extend({
    model: LayerM,
    initialize: function(models) {

        // apply the backbone.select mixin (must also be done in the respective model)
        Backbone.Select.One.applyTo(this, models);


        // listen for the events triggered by the select plugin
        this.on("select:one", this.addLayer);
        this.on("deselect:one", this.removeLayer);
    },
});



var MapM = Backbone.Model.extend({
    initialize: function(){
    }
});

var map0M = new MapM({
    mapIndex: 0,
    active: false,
    menuOpen: false,
    layersC: new LayersC(),
    exclusiveLayersC: new ExclusiveLayersC(),
    center: { lat: 32.75, lng: -17.15 },
    initialZoom: 10,
    maxZoom: 13,
    minZoom: 7
});
map0M.get("layersC").parent = map0M;
map0M.get("exclusiveLayersC").parent = map0M;

var map1M = new MapM({
    mapIndex: 1,
    active: false,
    menuOpen: false,
    layersC: new LayersC(),
    exclusiveLayersC: new ExclusiveLayersC(),
    center: { lat: 32.75, lng: -17.15 },
    initialZoom: 10,
    maxZoom: 13,
    minZoom: 7
});
map1M.get("layersC").parent = map1M;
map1M.get("exclusiveLayersC").parent = map1M;





// remove the "not published" group from the mapsMenu array
// Clima.mapsMenu = _.filter(Clima.mapsMenu, function(groupObj){ 
//     return groupObj.groupName !== "not published" 
// });


// add a new group to the menu (hard-coded)
Clima.mapsMenu.unshift({
    groupName: "Mapas base",
    maps: [
        { mapId: "mapa-base-freguesias", radio: true },
        { mapId: "mapquest", radio: true  },
        { mapId: "esri-world-imagery", radio: true  },
        { mapId: "esri-world-shaded-relief", radio: true  },
        { mapId: "esri-world-gray-canvas", radio: true  },        
        { mapId: "mapquest-places", radio: false  }
        //{ mapId: "hydda-base", radio: true  },
        //{ mapId: "open-topo-map", radio: true  },
        //{ mapId: "esri-world-street-map", radio: true  },
        //{ mapId: "here-satellite-day", radio: true  },
    ]
});

// add the hardcoded tileJson objects in Clima.exclusiveLayers to the main Clima.maps array (before the ones that come from the server)
_.each(Clima.exclusiveLayers, function(tileJson){

    Clima.maps.unshift(tileJson);
});

// deep clone the mapsMenu array for each leaflet map
map0M.set("mapsMenu", JSON.parse(JSON.stringify(Clima.mapsMenu)));
map1M.set("mapsMenu", JSON.parse(JSON.stringify(Clima.mapsMenu)));


// populate the layersC in map0M (using the mapIds in the mapMenu)

_.each(map0M.get("mapsMenu"), function(groupObj){

    _.each(groupObj.maps, function(mapObj){

        var tileJson = _.findWhere(Clima.maps, {id: mapObj.mapId});
        if(!tileJson){
            return;
        }

        var mapIndex = 0;

        // add the map index directly to the objects in the mapMenu array
        mapObj.mapIndex = mapIndex;

        // add some properties from the tileJson to the object in the mapsMenu (useful
        // to render the menu)
        mapObj.name = tileJson.name;
        mapObj.hasInfo = $.trim(tileJson.description).length > 0;
        

        // TO BE REVERTED: we are hardcodng the maxzoom to be 13 (intended for the madeira
        // maps); this line should be removed later;
        tileJson.maxzoom = 13;

        var layerM = new LayerM({
            id: tileJson.id,
            zindex: tileJson.zIndex || 0,
            opacity: 100,
            tileJson: tileJson,
            mapIndex: mapIndex
        });


        // these are the 3 required fields in the tileJson to create a L.mapbox.tileLayer object
        // NOTE: the sequential maps don't have these fields, so the tileLayer property won't be set 
        if(tileJson.tiles && tileJson.minzoom && tileJson.maxzoom){
            layerM.set("tileLayer", L.mapbox.tileLayer(tileJson));

            // the gridLayer + gridControl is only added if the teaser has been
            // defined in tilemill (otherwise it makes no sense to add )
            if(Cartografia.hasUTFGrid(tileJson)){
                layerM.set("gridLayer", L.mapbox.gridLayer(tileJson));

                var gridControlOptions = {
                    sanitizer: function(data){
                        //debugger;
                        var separator = "--code--";
                        if(data.indexOf(separator)===-1){
                            return data;
                        }

                        var code = data.substring(separator.length, data.length);
                        var fnDefinition = "(function temp(){" + $.trim(code) + "})";

                        var output;
                        try{
                            output = (eval(fnDefinition))();
                            return output;
                        }
                        catch(e){
                            return "Error in the popup definition: " + e.message;
                        }

                    }
                };

                layerM.set("gridControl", L.mapbox.gridControl(layerM.get("gridLayer"), gridControlOptions));
            }
        }
        else if(tileJson.sequence){
            //debugger;
            layerM.set("tileLayer", new Backbone.Collection(tileJson.sequence));

            layerM.get("tileLayer").each(function(model){
                model.set("mapIndex", mapIndex);
            });
        }


        // NOTE: the above calls to the L.mapbox method are syncronous because we are passing 
        // the actual tileJson object (it would be asyncronous if we passed a string with the
        // id of the map, in which case the respective tileJson would be fetched with an ajax call)

        if(tileJson.isExclusive){
            map0M.get("exclusiveLayersC").push(layerM);    
        }
        else{
            map0M.get("layersC").push(layerM);    
        }
        // TODO: repeat for the 2nd collection
    });
});
