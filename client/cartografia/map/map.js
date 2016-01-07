

var MapIV = Mn.ItemView.extend({
    attributes: {
        style: "height: 100%; xborder: solid green 1px; "
    },
    template: "map/templates/map-container.html",

    initialize: function(){
        //this.leaflet = {}
    },

    initializeMap: function(){

        // create the leafmap map
        var mapIndex = this.model.get("mapIndex");
        var center = this.model.get("center");
        var initialZoom = this.model.get("initialZoom");
        var maxZoom = this.model.get("maxZoom");
        var minZoom = this.model.get("minZoom");

        var div = this.$("div.mn-leaflet-map").get(mapIndex);

        // crate the leaflet map in the correct div
        this.map = L.mapbox.map(div, undefined, {
            zoomControl: false,
            attributionControl: false,
            zoom: initialZoom,
            maxZoom: maxZoom,
            minZoom: minZoom,
            center: [center.lat, center.lng],
        });

        this.map.on("moveend", Cartografia.updateUrlDebounce);
        this.map.on("layeradd", Cartografia.updateUrlDebounce);
        // this.map.on("layeradd", function(e){
        //     var tileJson = e.layer.getTileJSON();
        //     debugger;
        // });
        this.map.on("layerremove", Cartografia.updateUrlDebounce);

        this.model.set("active", true);
        this.model.set("leafletMap", this.map);

        // add the initial tilelayer
        //this.map.addLayer(Cartografia.tileProviders["MapQuestOpen.OSM"]);
        
        //this.map.addLayer(this.model.get("layersC").get("mapa-base-freguesias").get("tileLayer"));
        cartografiaChannel.request("selectLayer", 0, "mapa-base-freguesias");
        //cartografiaChannel.request("selectLayer", 0, "hydda-base");
        

        // add initial layers (given in the query params)
        // NOTE: can now make the request to "selectLayer", because at this point
        // the leaflet map has been created
        _.each(Cartografia.queryParams, function(value, layerId){

            // TODO: the map index is hardcoded
            cartografiaChannel.request("selectLayer", 0, layerId);

        });

        delete Cartografia.queryParams;

    },



    initializeMapMenu: function(){

        // instantiate and render the menu view
        this.menuLV = new MenuLV({
            model: this.model
        });
        this.menuLV.render();

        // add a reference to the parent view
        //this.menuLV.mapIV = this;

        // create the control instance and add to the map
        this.menuControl = new L.Control.BackboneView({
            view: this.menuLV,
            position: "topleft"
        });
//debugger;
        // map.addControl will add the html element of the menuLV view to the DOM
        // in the right place
        this.map.addControl(this.menuControl);

        // note:the following assertion is true
        //this.map === this.menuLV._map;

        //this.$el.css("height", "100%")

        // we must have the parent with the correct height
        this.menuLV.$el.parent().css("height", "100%");
        this.menuLV.$el.parent().parent().css("height", "100%");

    },

    // add the zoom control
    initializeZoom: function(options) {

        var defaultOptions = {
            position: "topright"
            //position: "bottomright",
        };

        var zoomControl = L.control.zoom(_.extend(defaultOptions, options));
        this.map.addControl(zoomControl);
    },

    // add the scale control
    initializeScale: function(options) {

        var defaultOptions = {
            position: "bottomright",
            //position: "topright",
            imperial: false,
            maxWidth: 130
        };

        var scaleControl = L.control.scale(_.extend(defaultOptions, options));
        window.scaleControl = scaleControl;
        this.map.addControl(scaleControl);
    },

    initializeMiniMap: function(options) {

        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osm2 = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 13});
        //var osm2 = Cartografia.tileProviders["MapQuestOpen.OSM"];
        var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(this.map);
//debugger;
        miniMap._toggleDisplayButtonClicked();

        // var layler = Cartografia.tileProviders["MapQuestOpen.OSM"];
        // var miniMapControl = new L.Control.MiniMap(layler);
        // this.map.addControl(miniMapControl);
    },

    onAttach: function(){

        this.initializeMap();
        this.initializeMapMenu();
        this.initializeZoom();
        this.initializeScale();
        //this.initializeMiniMap();

        // show the menu already open at the beggining
        map0M.set("menuOpen", true); 
    }
});

