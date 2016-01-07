var Cartografia = new Mn.Application();

Cartografia.addRegions({
    mapOneRegion: "#mn-r-map-1",
    mapTwoRegion: "#mn-r-map-2",
    modalOneRegion: "#mn-r-modal-contents-1"
});


L.Browser.retina = false;
//L.mapbox.config.HTTP_URL = Clima.publicUri + "/api/v1/maps";
L.mapbox.accessToken = 'dummyAccessToken';




Cartografia.updateUrl = function(){

    var url = "?";
    var leafletMap, center, zoom;
    if(map0M.get("active")){

        leafletMap = map0M.get("leafletMap");

        // 1. the map index to which the following properties refer to
        url += "mapindex=0";

        // 2. center
        center = leafletMap.getCenter();
        url += "&lat=" + center.lat.toFixed(4);
        url += "&lng=" + center.lng.toFixed(4);

        // 3. zoom level
        url += "&zoom=" + leafletMap.getZoom();

        // 4. opacity and z-index of the selected layers
        //debugger;
        var selectedLayers = map0M.get("layersC").selected;
        _.each(selectedLayers, function(layerM){
            var id = layerM.get("id");
            var opacity = layerM.get("opacity");
            var zindex = layerM.get("zindex");

            url += "&" + id + "=" + opacity + "," + zindex;
        });

    }

    //setTimeout(function(){
        router.navigate(url, {replace: true});
    //}, 1000)
    
};

Cartografia.updateUrlDebounce = _.debounce(Cartografia.updateUrl, 500);

Cartografia.getMapModel = function(mapIndex){

    if(mapIndex===0){
        return map0M;
    }
    else if(mapIndex===1){
        return map1M;
    }
    else{
        throw new Error("wrong map index");
    }
};

Cartografia.hasUTFGrid = function(tileJson){

    return !!tileJson.interactivity && !!$.trim(tileJson.interactivity.template_teaser);
};

Cartografia.init = function(){
    var map0IV = new MapIV({
        model: map0M
    });

    this.mapOneRegion.show(map0IV);
};

var Router = Backbone.BaseRouter.extend({

    onNavigate: function(routeData) {
//debugger;
        var routeObj = routeData.linked;
        routeObj.updateModels(routeData.query);
    },

    routes: {
        '*any': {

            updateModels: function(query) {

                delete query.mapindex;

                var updateAttrs = {}
                if(query.lat && query.lng){
                    updateAttrs.center = { lat: query.lat, lng: query.lng };
                    delete query.lat;
                    delete query.lng;
                }

                if(query.zoom){
                    updateAttrs.initialZoom = parseInt(query.zoom, 10);
                    delete query.zoom;
                }

                // TODO: menuOpen
               


                // the remaining query params must be layers ids

                // HACK: add a reference in the main namespace; the query obj has the ids of the 
                // layers to be added at startime; however at this point we don't have yet the
                // leaflet map, so we can't make the "selectLayer" request
                Cartografia.queryParams = query;


                var layersC = map0M.get("layersC");
                _.each(query, function(value, layerId){

                    var layerM = layersC.get(layerId);
                    //debugger;
                    if(layerM && layerM.get("tileLayer") instanceof L.TileLayer){
                        var array = value.split(",");
                        var layerAttrs = {
                            opacity: parseInt(array[0], 10),
                            zindex: parseInt(array[1], 10)
                        };

                        // we pass silent:true because otherwise the models would change
                        // try to the url, which we don't want at this point
                        layerM.set(layerAttrs, {silent: true});

                        // because of that we have to set these manually
                        layerM.get("tileLayer").setOpacity(layerAttrs.opacity/100);
                        layerM.get("tileLayer").setZIndex(layerAttrs.zindex);

                        
                    }
                });

                map0M.set(updateAttrs);
            }
        }
    }
});







var cartografiaChannel = Backbone.Radio.channel('cartografia');

cartografiaChannel.reply("selectLayer", function(mapIndex, layerId){
//debugger;
    var mapM = Cartografia.getMapModel(mapIndex);

    // try to find the layerM in either collection
    var layerM = mapM.get("layersC").get(layerId) || mapM.get("exclusiveLayersC").get(layerId);

    if(layerM){
        layerM.select();
    }
    else{
        throw new Error("Unknown layerId: ", layerId);
    }


    // if(layerM instanceof L.TileLayer){
    //     layerM.select();
    //     return;
    // }
    // else if(layerM instanceof Backbone.Collection){
    //     var x = 1;
    //     return;
    // }
    // else{
    //     throw new Error("Unknown layerId: ", layerId);
    // }
    
});

cartografiaChannel.reply("deselectLayer", function(mapIndex, layerId){
//debugger;
    var mapM = Cartografia.getMapModel(mapIndex);
    var layerM = mapM.get("layersC").get(layerId);

    if(layerM){
        layerM.deselect();
    }
    else{
        throw new Error("Unknown layerId: ", layerId);
    }


    // if(layerM instanceof L.TileLayer){
    //     layerM.deselect();
    //     return;
    // }
    // else if(layerM instanceof Backbone.Collection){
    //     var x = 1;
    //     return;
    // }
    // else{
    //     throw new Error("Unknown layerId: ", layerId);
    // }
    // NOTE: here we don't have to worry about checking if the layer is in the exclusiveLayersC
    // because it is not possible to "deselect a radio"
});


cartografiaChannel.reply("openFullscreen", function(selector){

    if(!$.fullscreen.isFullScreen()){
        $("#navbar-container").css("display", "none")
        $(selector).css("top", "0px")
        $(selector).fullscreen();
    }
});

cartografiaChannel.reply("closeFullscreen", function(selector){

    $("#navbar-container").css("display", "block")
    $(selector).css("top", "52px")

    // this request shoudl be called in the handler for the "fscreenclose", so at this point
    // we might be outside of fullscreen (in case the user has exited the fullscreen via the
    // esc key)
    if($.fullscreen.isFullScreen()){
        $.fullscreen.exit();
    }
});



// cartografiaChannel.reply("openFullscreen", function(){

//     $("#navbar-container").css("display", "none")
//     $("#map-container").css("top", "0px")
//     $('#map-container').fullscreen();
// });


$('#map-container').on("fscreenclose", function(e){

    cartografiaChannel.request("closeFullscreen", "#map-container")
});





Clima.width = {};
Clima.width.document = $(document).width();
Clima.width.window = $(window).width();
Clima.width.body = $("body").width();
Clima.width.mapContainer = $("#map-container").width();

Clima.width2 = {};
Clima.width2.document = $.documentWidth();
Clima.width2.window = $.windowWidth();
Clima.width2.visualViewport = $.windowWidth( "visual" );
Clima.width2.layoutViewport = $.windowWidth( "layout" );
Clima.width2.pinchZoomFactor = $.pinchZoomFactor();
Clima.width2.scrollbarWidth = $.scrollbarWidth();



