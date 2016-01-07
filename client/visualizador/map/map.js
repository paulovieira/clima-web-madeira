

var tabChannel = Backbone.Radio.channel('tabChannel');

L.mapbox.config.HTTP_URL = "http://clima.dev/api/v1/maps";
L.mapbox.accessToken = 'dummyAccessToken';

var tileProviders = {

    // base
    "Hydda.Base": L.tileLayer.provider('Hydda.Base'), // maxZoom: 18
    "Esri.WorldShadedRelief": L.tileLayer.provider('Esri.WorldShadedRelief'), // maxZoom: 13
    "OpenMapSurfer.Grayscale": L.tileLayer.provider('OpenMapSurfer.Grayscale'),

    // rivers
    "Esri.WorldGrayCanvas": L.tileLayer.provider('Esri.WorldGrayCanvas'), // maxZoom: 16
    "Esri.WorldTopoMap": L.tileLayer.provider('Esri.WorldTopoMap'),

    // streets
    "Esri.WorldStreetMap": L.tileLayer.provider('Esri.WorldStreetMap'),
    "MapQuestOpen.OSM": L.tileLayer.provider('MapQuestOpen.OSM', {
        maxZoom: 19
    }),
    "HERE.normalDayGrey": L.tileLayer.provider('HERE.normalDayGrey', {
        'app_id': 'Y8m9dK2brESDPGJPdrvs',
        'app_code': 'dq2MYIvjAotR8tHvY8Q_Dg',
        maxZoom: 19
    }),

    // terrain
    // "Mapbox.Emerald": L.tileLayer('https://{s}.tiles.mapbox.com/v4/examples.map-i87786ca/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    //     maxZoom: 18,
    //     id: 'paulosantosvieira.l4h4omm9'
    // }),
    "Esri.DeLorme": L.tileLayer.provider('Esri.DeLorme'), // maxZoom: 11
    "Acetate.hillshading": L.tileLayer.provider('Acetate.hillshading'),
    "Thunderforest.Outdoors": L.tileLayer.provider('Thunderforest.Outdoors'),
    "HERE.terrainDay": L.tileLayer.provider('HERE.terrainDay', {
        'app_id': 'Y8m9dK2brESDPGJPdrvs',
        'app_code': 'dq2MYIvjAotR8tHvY8Q_Dg'
    }),

    // satellite
    "MapQuestOpen.Aerial": L.tileLayer.provider('MapQuestOpen.Aerial'), // maxZoom: 11
    "Esri.WorldImagery": L.tileLayer.provider('Esri.WorldImagery'), // maxZoom: 13
    "HERE.satelliteDay": L.tileLayer.provider('HERE.satelliteDay', {
        'app_id': 'Y8m9dK2brESDPGJPdrvs',
        'app_code': 'dq2MYIvjAotR8tHvY8Q_Dg',
        maxZoom: 19
    }), // maxZoom: 19


    // names of places
    "MapQuestOpen_HybridOverlay": L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
        type: 'hyb',
        ext: 'png',
        //attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: '1234',
        opacity: 0.9
    }),

    // BGRI borders
    "BGRIBordersOnly": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_brgi_borders/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    // rivers
    "rios": L.tileLayer(Clima.tilesBaseUrl + '/v2/rios/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),


    // risk lisbon
    "cirac_risk_lx_T500": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_risk_lx_T500/{z}/{x}/{y}.png', {
        maxZoom: 20,
        opacity: 0.7
    }),
    "cirac_risk_lx_structure": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_risk_lx_structure/{z}/{x}/{y}.png', {
        maxZoom: 20,
        opacity: 0.8
    }),

    // risk coimbra
    "cirac_risk_cmbr_bx_T500": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_risk_cmbr_bx_T500/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_risk_cmbr_sul_structure": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_risk_cmbr_sul_structure/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    // risk alges
    "cirac_risk_algs_T500": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_risk_algs_T500/{z}/{x}/{y}.png', {
        maxZoom: 20,
        opacity: 0.7
    }),

    "cirac_risk_algs_structure": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_risk_algs_structure/{z}/{x}/{y}.png', {
        maxZoom: 20,
        opacity: 0.8
    }),

    // FVI
    "cirac_vul_bgri_FVI_N": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_bgri_FVI_N/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_vul_bgri_FVI_75": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_bgri_FVI_75/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_vul_CP4_FVI": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_CP4_FVI/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),

    "cirac_vul_CP4_FVI75": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_CP4_FVI75/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),

    // CFVI
    "cirac_vul_bgri_cfvi": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_bgri_cfvi/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_vul_bgri_cfvi75": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_bgri_cfvi75/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_vul_cp4_cfvi_mode": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_cp4_cfvi_mode/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),

    "cirac_vul_cp4_cfvi_75": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_cp4_cfvi_75/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),

    // EXPOSURE
    "cirac_vul_bgri_E": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_bgri_E/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_vul_bgri_E75": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_bgri_E75/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_vul_CP4_E": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_CP4_E/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),

    "cirac_vul_CP4_E75": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_CP4_E75/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),

    // PHYSICAL SUSCEPTIBILITY
    "cirac_vul_bgri_SF": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_bgri_SF/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_vul_bgri_SF75": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_bgri_SF75/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_vul_CP4_SF": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_CP4_SF/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),

    "cirac_vul_CP4_SF75": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_CP4_SF75/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),

    // SOCIAL SUSCEPTIBILITY

    "cirac_vul_bgri_SSI": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_bgri_SSI/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_vul_bgri_SSI75": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_bgri_SSI75/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_vul_CP4_SSI": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_CP4_SSI/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),

    "cirac_vul_CP4_SSI75": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_CP4_SSI75/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),

    // PRECIPITATION

    "cirac_vul_bgri_TF": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_bgri_TF/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_vul_bgri_TF75": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_bgri_TF75/{z}/{x}/{y}.png', {
        maxZoom: 16
    }),

    "cirac_vul_CP4_TF": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_CP4_TF/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),

    "cirac_vul_CP4_TF75": L.tileLayer(Clima.tilesBaseUrl + '/v2/cirac_vul_CP4_TF75/{z}/{x}/{y}.png', {
        maxZoom: 15
    }),

    // maps produced with tilemill

    "new-map-3": L.mapbox.tileLayer('new-map-3'),
    "new-map-4": L.mapbox.tileLayer('new-map-4')
};


var gridLayerProviders = {
    "new-map-3": L.mapbox.gridLayer('new-map-3'),
    "new-map-4": L.mapbox.gridLayer('new-map-4')
}

var gridControlProviders = {
    "new-map-3": L.mapbox.gridControl(gridLayerProviders['new-map-3']),
    "new-map-4": L.mapbox.gridControl(gridLayerProviders['new-map-4'])
}






var scales = {
    FVINormalColors: function (value) {
        var color = "#FFF";

        if(value >= 3 && value <= 5){        color = "#38A800"; }
        else if(value >= 6 && value <= 7){   color = "#FFFF00"; }
        else if(value >= 8 && value <= 10){  color = "#FF9500"; }
        else if(value >= 11 && value <= 12){ color = "#FF0000"; }

        return color;
    },

    FVICombinedColors: function(value) {
        var color = "#FFF";

        if(value == 1){      color = "#38A800"; }
        else if(value == 2){ color = "#66BF00"; }
        else if(value == 3){ color = "#9BD900"; }
        else if(value == 4){ color = "#DEF200"; }
        else if(value == 5){ color = "#FFDD00"; }
        else if(value == 6){ color = "#FF9100"; }
        else if(value == 7){ color = "#FF4800"; }
        else if(value == 8){ color = "#FF0000"; }

        return color;
    },

    exposureColors: function(value) {
        var color = "#FFF";

        value = value.toLowerCase();
        if(value == "low"){      color = "#38A800"; }
        else if(value == "moderate"){ color = "#FFFF00"; }
        else if(value == "high"){ color = "#FF9500"; }
        else if(value == "very high"){ color = "#FF0000"; }

        return color;
    },

    physicalSusceptibilityColors: function(value) {
        var color = this.exposureColors(value);
        return color;
    },

    socialSusceptibilityColors: function(value) {
        var color = this.exposureColors(value);
        return color;
    },

    precipitationColors: function(value) {
        var color = this.exposureColors(value);
        return color;
    }
};

var util = {
    getPopupMessage: function(value, locationName){

        var message = "",
            layerKey = optionsMenuM.get("activeLayerKey").toLowerCase();

        if(layerKey == "cirac_vul_bgri_fvi_n"){
            message += "<h5>Normal FVI (mode)</h5>";

            if(locationName){
                message += "<div><b>Location:</b> " + locationName + "</div>";
            }

            message += "<div><b>Vulnerability:</b> " + value + " (" + util.getNormalFVIDescription(value, true) + ")</div>";

            message += "<div><b>Description:</b> " + util.getNormalFVIDescription(value) + "</div>";
        }
        else if(layerKey == "cirac_vul_bgri_fvi_75"){
            message += "<h5>Normal FVI (75 percentile)</h5>";

            if(locationName){
                message += "<div><b>Location:</b> " + locationName + "</div>";
            }

            message += "<div><b>Vulnerability:</b> " + value + " (" + util.getNormalFVIDescription(value, true) + ")</div>";

            message += "<div><b>Description:</b> " + util.getNormalFVIDescription(value) + "</div>";
        }
        else if(layerKey == "cirac_vul_bgri_cfvi"){
            message += "<h5>Combined FVI (mode)</h5>";

            if(locationName){
                message += "<div><b>Location:</b> " + locationName + "</div>";
            }

            message += "<div><b>Vulnerability:</b> " + value + "</div>";

            message += "<div><b>Description:</b> " + util.getCombinedFVIDescription(value) + "</div>";
        }
        else if(layerKey == "cirac_vul_bgri_cfvi75"){
            message += "<h5>Combined FVI (75 percentile)</h5>";

            if(locationName){
                message += "<div><b>Location:</b> " + locationName + "</div>";
            }

            message += "<div><b>Vulnerability:</b> " + value + "</div>";

            message += "<div><b>Description:</b> " + util.getCombinedFVIDescription(value) + "</div>";
        }
        else if(layerKey == "cirac_vul_bgri_e"){
            message += "<h5>Exposure (mode)</h5>";

            if(locationName){
                message += "<div><b>Location:</b> " + locationName + "</div>";
            }

            message += "<div><b>Vulnerability:</b> " + value + "</div>";

            message += "<div><b>Description:</b> " + util.getExposureDescription(value) + "</div>";
        }
        else if(layerKey == "cirac_vul_bgri_e75"){
            message += "<h5>Exposure (75 percentile)</h5>";

            if(locationName){
                message += "<div><b>Location:</b> " + locationName + "</div>";
            }

            message += "<div><b>Vulnerability:</b> " + value + "</div>";

            message += "<div><b>Description:</b> " + util.getExposureDescription(value) + "</div>";
        }
        else if(layerKey == "cirac_vul_bgri_sf"){
            message += "<h5>Physical Susceptibility (mode)</h5>";

            if(locationName){
                message += "<div><b>Location:</b> " + locationName + "</div>";
            }

            message += "<div><b>Vulnerability:</b> " + value + "</div>";

            message += "<div><b>Description:</b> " + util.getPhysicalSusceptibilityDescription(value) + "</div>";
        }
        else if(layerKey == "cirac_vul_bgri_sf75"){
            message += "<h5>Physical Susceptibility (75 percentile)</h5>";

            if(locationName){
                message += "<div><b>Location:</b> " + locationName + "</div>";
            }

            message += "<div><b>Vulnerability:</b> " + value + "</div>";

            message += "<div><b>Description:</b> " + util.getPhysicalSusceptibilityDescription(value) + "</div>";
        }

        else{
            if(locationName){
                message += "<div><b>Location:</b> " + locationName + "</div>";
            }
        }
        return message;
    },

    getNormalFVIDescription: function(value, shortDescription){
        var message = "";
        if(value >= 3 && value <= 5){        
            message = shortDescription ? 
                "Low" : 
                "Areas unlikely to have flood events (E, PSI), and where communities are less susceptible (SSI).";

        }
        else if(value >= 6 && value <= 7){  
            message =  shortDescription ? 
                "Moderate":
                "Areas unlikely to suffer damage during flood events (E, PSI), and where communities tend to be less susceptib­le (SSI).";
        }
        else if(value >= 8 && value <= 10){  
            message = shortDescription ? 
                "High" :
                "Areas likely to suffer damage during flood events (E, PSI) and with susceptible communities (SSI).";
        }
        else if(value >= 11 && value <= 12){ 
            message = shortDescription ? 
                "Very high" :
                "Areas very likely to suffer damage during flood events (E, PSI), with highly susceptible communities (SSI).";
        }

        return message;
    },

    getCombinedFVIDescription: function(value, shortDescription){
        var message = "";
        if(value == 1){        
            message = shortDescription ? 
                "" : 
                "Low Physical Susceptibility, Exposure and Precipitation.";
        }
        if(value == 2){
            message = shortDescription ? 
                "" : 
                "Low Physical Susceptibility and Precipitation, High Exposure.";
        }
        if(value == 3){
            message = shortDescription ? 
                "" : 
                "Low Physical Susceptibility and Exposure and High Precipitation.";
        }
        if(value == 4){
            message = shortDescription ? 
                "" : 
                "Low Physical Susceptibility and High Exposure and Precipitation.";
        }
        if(value == 5){
            message = shortDescription ? 
                "" : 
                "High Physical Susceptibility and Low Exposure and Precipitation.";
        }
        if(value == 6){
            message = shortDescription ? 
                "" : 
                "High Physical Susceptibility and Exposure and Low Precipitation.";
        }
        if(value == 7){
            message = shortDescription ? 
                "" : 
                "High Physical Susceptibility and Precipitation and Low Exposure.";
        }
        if(value == 8){
            message = shortDescription ? 
                "" : 
                "High Physical Susceptibility, Exposure and Precipitation.";
        }

        return message;
    },

    getExposureDescription: function(value, shortDescription){
        var message = "";
        if(value == 1){        
            message = shortDescription ? 
                "" : 
                "Areas with scarce structures";
        }
        if(value == 2){
            message = shortDescription ? 
                "" : 
                "Areas with sparse buildings usually in rural areas";
        }
        if(value == 3){
            message = shortDescription ? 
                "" : 
                "Areas with medium buildings density usually villages and regions close to urban areas";
        }
        if(value == 4){
            message = shortDescription ? 
                "" : 
                "Areas with high buildings density mainly representing urban areas";
        }

        return message;
    },

    getPhysicalSusceptibilityDescription: function(value, shortDescription){
        var message = "";
        if(value == 1){        
            message = shortDescription ? 
                "" : 
                "<ul><li>Regions with no water accumulation potential</li><li>Regions with higher soil permeability</li><li>Regions with very high water transport cost distance values</li></ul>";
        }
        if(value == 2){
            message = shortDescription ? 
                "" : 
                "<ul><li>Regions of medium/low water accumulation</li><li>Regions with significant water transport cost distance values</li><li>Regions of permeable soil</li></ul>";
        }
        if(value == 3){
            message = shortDescription ? 
                "" : 
                "<ul><li>Flooding regions associated with large rivers</li><li>Regions of permeable soil + Regions with high water accumulation potential.</li></ul>";
        }
        if(value == 4){
            message = shortDescription ? 
                "" : 
                "<ul><li>Water Lines and contiguous regions</li><li>Regions of impervious soil (e.g. cities)</li></ul>";
        }

        return message;
    },
}

// create an instance of a backbone model
var OptionsMenuM = Backbone.Model.extend({
    initialize: function(){
        this.on("change:activeLayerKey", function(){
            var mapKey = this.get("activeLayerKey").toLowerCase();

            // TODO: missing exposure and physican susceptibility
            var isCiracMap = mapKey.indexOf("cirac_vul_bgri") !== -1;
/*
                        mapKey.indexOf("cirac_vul_bgri_fvi") !== -1 ||
                        mapKey.indexOf("cirac_vul_bgri_fvi") !== -1 ||
                        mapKey.indexOf("cirac_vul_bgri_fvi") !== -1;
*/
            this.set("activeMapIsCirac", isCiracMap);
        });
    }
})
var optionsMenuM = new OptionsMenuM({
    activeTabId: "tile-switcher",
    activeLayerKey: "MapQuestOpen.OSM",
    activeMapIsCirac: false,
    //BGRIBorders: false
});

window.pointCollection = undefined;

var PointRowIV = Mn.ItemView.extend({
    template: "map/templates/point-row.html",
    tagName: "tr",
});

var PointsListCV = Mn.CompositeView.extend({

    template: "map/templates/points-table.html",
    childView: PointRowIV,
    childViewContainer: "tbody",
    attributes: {
        style: "overflow: scroll; height: 400px;"
    },
    events: {
        "click #new-upload": function(){
debugger;
            // remove all layer that are markers and GeoJSON (circle markers)
            this.map.eachLayer(function(layer){
                if(layer instanceof L.GeoJSON || layer instanceof L.Marker){
                    this.map.removeLayer(layer)
                }
            }, this);

            window.pointCollection = undefined;

            tabChannel.command("show:my:maps");
        }
    },

    onBeforeAttach: function(){
        //debugger;
        //var mapHeight = $("#map").height();
        //this.$el.height(mapHeight - 100);
    },

    // after the list is shown, show the markers as well
    onShow: function(){

        var geoJson = [], xlsArray = [];


        xlsArray.push(window.pointCollection.first().keys());

        // create an array of geoJson feature objects
        window.pointCollection.each(function(model){
            geoJson.push({
                "type": "Feature",
                "properties": {
                    "description": model.get("description") || "",
                    "value": model.get("value") || 0,
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [model.get("lon"), model.get("lat")]
                }
            });

            xlsArray.push(model.values());
        });


        $("#vuln").val(JSON.stringify(xlsArray));


/*        
debugger;
var xgeoJson = [
{
    "type": "Feature",
    "properties": {
        "description": "xxx",
        "value": 9
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-9.15, 38.75]
    }
},

{
    "type": "Feature",
    "properties": {
        "description": "yyy",
        "value": 4
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-9.15, 38.54]
    }
}

]
*/
        function getColor(value){

            var color,
                layerKey = optionsMenuM.get("activeLayerKey").toLowerCase();

            if(layerKey.indexOf("cirac_vul_bgri_fvi_n")!=-1   || 
                layerKey.indexOf("cirac_vul_bgri_fvi_75")!=-1 ||
                layerKey.indexOf("cirac_vul_cp4_fvi")!=-1     ||
                layerKey.indexOf("cirac_vul_cp4_fvi75")!=-1){

                color = scales.FVINormalColors(value);    
            }
            else if(layerKey.indexOf("cirac_vul_bgri_cfvi")!=-1   || 
                layerKey.indexOf("cirac_vul_bgri_cfvi75")!=-1     ||
                layerKey.indexOf("cirac_vul_cp4_cfvi_mode")!=-1   ||
                layerKey.indexOf("cirac_vul_cp4_cfvi_75")!=-1){

                color = scales.FVICombinedColors(value);    
            }
            else if(layerKey.indexOf("cirac_vul_bgri_e")!=-1 || 
                layerKey.indexOf("cirac_vul_bgri_e75")!=-1    ||
                layerKey.indexOf("cirac_vul_cp4_e")!=-1      ||
                layerKey.indexOf("cirac_vul_cp4_e75")!=-1){

                color = scales.exposureColors(value);    
            }
            else if(layerKey.indexOf("cirac_vul_bgri_sf")!=-1 || 
                layerKey.indexOf("cirac_vul_bgri_sf75")!=-1   ||
                layerKey.indexOf("cirac_vul_cp4_sf")!=-1      ||
                layerKey.indexOf("cirac_vul_cp4_sf75")!=-1){

                color = scales.physicalSusceptibilityColors(value);    
            }
            else if(layerKey.indexOf("cirac_vul_bgri_ssi")!=-1 || 
                layerKey.indexOf("cirac_vul_bgri_ssi75")!=-1   ||
                layerKey.indexOf("cirac_vul_cp4_ssi")!=-1      ||
                layerKey.indexOf("cirac_vul_cp4_ssi75")!=-1){

                color = scales.socialSusceptibilityColors(value);    
            }
            else if(layerKey.indexOf("cirac_vul_bgri_tf")!=-1 || 
                layerKey.indexOf("cirac_vul_bgri_tf75")!=-1   ||
                layerKey.indexOf("cirac_vul_cp4_tf")!=-1      ||
                layerKey.indexOf("cirac_vul_cp4_tf75")!=-1){

                color = scales.precipitationColors(value);    
            }            return color;
        };

        L.geoJson(geoJson, {
                pointToLayer: function (feature, latlng) {
                    var markerOptions = {
                        radius: 8,
                        fillColor: getColor(feature.properties.value),
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    };
                    return L.circleMarker(latlng, markerOptions);
                },

                onEachFeature: function(feature, layer){
                    layer.bindPopup(util.getPopupMessage(feature.properties.value, feature.properties.description))
                }
           }).addTo(this.map);


        // draw the chart
                

        Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%=value%> (<%= (circumference*100/6.283).toFixed(1) %> %)";

        var ctx = document.getElementById("myChart").getContext("2d");

        var data = [], countObj = {}, colorMapping;
        if(this.map.hasLayer(tileProviders["cirac_vul_bgri_cfvi"])  ||
            this.map.hasLayer(tileProviders["cirac_vul_bgri_cfvi75"])){

            countObj = window.pointCollection.countBy("value");

            colorMapping = {
                "1": "#38A800",
                "2": "#66BF00",
                "3": "#9BD900",
                "4": "#DEF200",
                "5": "#FFDD00",
                "6": "#FF9100",
                "7": "#FF4800",
                "8": "#FF0000"
            }

            for(var key in countObj){

                data.push({
                    value: countObj[key],
                    label: "value " + key,
                    color: colorMapping[key],
                    highlight: colorMapping[key]
                });
            }

        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_bgri_FVI_N"])  ||
            this.map.hasLayer(tileProviders["cirac_vul_bgri_FVI_75"])){

            window.pointCollection.each(function(model){
                var value = model.get("value");
                if(value >= 3 && value <= 5){
                    countObj["3-5"] = _.isNumber(countObj["3-5"]) ? countObj["3-5"]+1 : 1;
                }
                else if(value >= 6 && value <= 7){
                    countObj["6-7"] = _.isNumber(countObj["6-7"]) ? countObj["6-7"]+1 : 1;
                }
                else if(value >= 8 && value <= 10){
                    countObj["8-10"] = _.isNumber(countObj["8-10"]) ? countObj["8-10"]+1 : 1;
                }
                else if(value >= 11 && value <= 12){
                    countObj["11-12"] = _.isNumber(countObj["11-12"]) ? countObj["11-12"]+1 : 1;
                }
            });

            colorMapping = {
                "3-5": "#38A800",
                "6-7": "#FFFF00",
                "8-10": "#FF9500",
                "11-12": "#FF0000"
            }

            for(var key in countObj){

                data.push({
                    value: countObj[key],
                    label: "value " + key,
                    color: colorMapping[key],
                    highlight: colorMapping[key]
                });
            }

        }
        else{
            return;            
        }

        var myPieChart = new Chart(ctx).Pie(data, {});


    }
});

var MyMapsIV = Mn.ItemView.extend({
    template: "map/templates/my-maps.html",

    onAttach: function(){

        var dropZoneTitle = this.model.get("activeMapIsCirac") ? 
                                "Drag & drop an excel file here (or click the Browse button)" : 
                                "To upload file you must select one of the vulnerability maps";
        
        // self is the view       
        var self = this;
        $("#new_file").fileinput({
            uploadUrl: '/api/vulnerabilities',
            maxFileSize: 1000*200,  // in Kb
            showUpload: true,
            initialCaption: "Choose file",
            dropZoneTitle: dropZoneTitle,
            showRemove: false,
            maxFileCount: 1,

//            slugCallback: self.slugFilename,

            ajaxSettings: {
                error: function(jqxhr, status, err){
                    var msg = jqxhr.responseJSON.message;

                    alert("ERROR: " + jqxhr.responseJSON.message);
                    throw new Error(msg);
                },

                success: function(data, y, z){
                    //debugger;
                    tabChannel.command("show:point:list", data);
                }
            },

            uploadExtraData: function(){
                return { 
                    //tags: $("#new_file_tags").val(),
                    // shapeDescription: JSON.stringify({
                    //     "pt": $("#js-new-shape-desc-pt").val() || "",
                    //     "en": $("#js-new-shape-desc-en").val() || ""
                    // }),
                    filename:  self.model.get("filename"),
                    mapTable: optionsMenuM.get("activeLayerKey").toLowerCase()
                    //shapeCode: (self.model.get("isShape") ? self.model.get("shapeCode") : "")
                }
            }

        });


        //this callback will execute after the file is selected (and before the upload button is clicked)
        $('#new_file').on('fileloaded', function(e, file, previewId, index, reader) {
            self.model.set("filename", file.name);
        });


    },
});

var TileSwitcherIV = Mn.ItemView.extend({
    className: "infox tile-switcher",
    attributes: {
        //style: "margin-top: 10px;"
        style: "padding: 10px 10px; overflow-y: auto;"
    },
    template: "map/templates/tile-switcher.html",

    onBeforeShow: function(){
        this.updateForm();
    },


    initialize: function(){
        var self = this;
        $( window ).resize(function() {
            //var mapHeight = ($("#map").height() - 120) + "px";
            //var x = this;
            //debugger;
            self.setHeight();
        });
    },

    events: {
        "click input[type='radio']": "changeTileLayer",
        "click input[type='checkbox']": "toggleOverlay",
//        "dblclick": "stopPropagation"
        //"mousedown": "temp"
    },

    setHeight: function(){
        var mapHeight = ($("#map").height() - 140) + "px";
        this.$el.height(mapHeight);
    },

    onAttach: function(){
        //debugger;
//        var mapHeight = ($("#map").height() - 12340) + "px";
        //console.log("mapHeight: ", mapHeight);
        //this.$el.attr("style", "padding: 10px 10px; overflow-y: auto; height: " + mapHeight + ";")
  //      this.$el.height(mapHeight);
        this.setHeight();
    },

    updateForm: function(){
        // update the radio button relative to the base layer
        //var layerKey = util.getCurrentBaseLayerKey(this.map);
        var layerKey = this.model.get("activeLayerKey");

        var selector = "input[type='radio'][value='" + layerKey + "']";
        this.$(selector).prop("checked", true);

        // update the checkbox (overlays)
        layerKey = "BGRIBordersOnly";
        if(this.map.hasLayer(tileProviders[layerKey])){
            selector = "input[type='checkbox'][value='" + layerKey + "']";
            this.$(selector).prop("checked", true);
        }

        // update the checkbox (overlays)
        layerKey = "rios";
        if(this.map.hasLayer(tileProviders[layerKey])){
            selector = "input[type='checkbox'][value='" + layerKey + "']";
            this.$(selector).prop("checked", true);
        }


        // update the checkbox (overlays)
        layerKey = "MapQuestOpen_HybridOverlay";
        if(this.map.hasLayer(tileProviders[layerKey])){
            selector = "input[type='checkbox'][value='" + layerKey + "']";
            this.$(selector).prop("checked", true);
        }

        // update the checkbox (overlays)
        layerKey = "cirac_risk_lx_T500";
        if(this.map.hasLayer(tileProviders[layerKey])){
            selector = "input[type='checkbox'][value='" + layerKey + "']";
            this.$(selector).prop("checked", true);
        }

        // update the checkbox (overlays)
        layerKey = "cirac_risk_lx_structure";
        if(this.map.hasLayer(tileProviders[layerKey])){
            selector = "input[type='checkbox'][value='" + layerKey + "']";
            this.$(selector).prop("checked", true);
        }

        layerKey = "cirac_risk_cmbr_bx_T500";
        if(this.map.hasLayer(tileProviders[layerKey])){
            selector = "input[type='checkbox'][value='" + layerKey + "']";
            this.$(selector).prop("checked", true);
        }

        layerKey = "cirac_risk_cmbr_sul_structure";
        if(this.map.hasLayer(tileProviders[layerKey])){
            selector = "input[type='checkbox'][value='" + layerKey + "']";
            this.$(selector).prop("checked", true);
        }

        layerKey = "cirac_risk_algs_structure";
        if(this.map.hasLayer(tileProviders[layerKey])){
            selector = "input[type='checkbox'][value='" + layerKey + "']";
            this.$(selector).prop("checked", true);
        }

        layerKey = "cirac_risk_algs_T500";
        if(this.map.hasLayer(tileProviders[layerKey])){
            selector = "input[type='checkbox'][value='" + layerKey + "']";
            this.$(selector).prop("checked", true);
        }
    },

    changeTileLayer: function(e){
        var newLayerKey = $(e.target).val(),
            newLayer = tileProviders[newLayerKey],
            //activeLayerKey = util.getCurrentBaseLayerKey(this.map),
            activeLayerKey = this.model.get("activeLayerKey"),
            activeLayer = tileProviders[activeLayerKey],
            overlay;

        if(newLayerKey === activeLayerKey){ return; }

        if(!this.map.hasLayer(newLayer)){
            this.map.addLayer(newLayer);
        }

        if(this.map.hasLayer(activeLayer)){
            this.map.removeLayer(activeLayer);            
        }

        // make sure the overlays are in the top
        overlay = tileProviders["cirac_risk_lx_T500"]
        if(this.map.hasLayer(overlay)){
            overlay.bringToFront();
        }

        overlay = tileProviders["cirac_risk_lx_structure"]
        if(this.map.hasLayer(overlay)){
            overlay.bringToFront();
        }

        overlay = tileProviders["cirac_risk_algs_T500"]
        if(this.map.hasLayer(overlay)){
            overlay.bringToFront();
        }

        overlay = tileProviders["cirac_risk_algs_structure"]
        if(this.map.hasLayer(overlay)){
            overlay.bringToFront();
        }

        overlay = tileProviders["MapQuestOpen_HybridOverlay"]
        if(this.map.hasLayer(overlay)){
            overlay.bringToFront();
        }

        this.model.set("activeLayerKey", newLayerKey);

//debugger;
/*
        if(!this.model.get("activeMapIsCirac")){
            this.map.removeLayer(namesLayer);
        }
        else{
            if(!this.map.hasLayer(namesLayer)){
                this.map.addLayer(namesLayer);    
            }
            namesLayer.bringToFront();
        }
*/

    },

    toggleOverlay: function(e){
        var layer, layerKey = $(e.target).val(), 
            checked = $(e.target).prop("checked");

        if(layerKey === "new-map-3"){

            layer = tileProviders[layerKey];

            if(checked && !this.map.hasLayer(layer)){
                this.map.addLayer(layer);
                this.map.legendControl.addLegend(layer.getTileJSON().legend);
                this.map.addLayer(gridLayerProviders[layerKey]);
                this.map.addControl(gridControlProviders[layerKey]);
            }
            else if(!checked && this.map.hasLayer(layer)){
                this.map.removeLayer(layer);
                this.map.legendControl.removeLegend(layer.getTileJSON().legend);
                this.map.removeLayer(gridLayerProviders[layerKey]);
                this.map.removeControl(gridControlProviders[layerKey]);
            }
        }

        if(layerKey === "new-map-4"){

            layer = tileProviders[layerKey];

            if(checked && !this.map.hasLayer(layer)){
                this.map.addLayer(layer);
                this.map.legendControl.addLegend(layer.getTileJSON().legend);
                this.map.addLayer(gridLayerProviders[layerKey]);
                this.map.addControl(gridControlProviders[layerKey]);
            }
            else if(!checked && this.map.hasLayer(layer)){
                this.map.removeLayer(layer);
                this.map.legendControl.removeLegend(layer.getTileJSON().legend);
                this.map.removeLayer(gridLayerProviders[layerKey]);
                this.map.removeControl(gridControlProviders[layerKey]);
            }
        }

            
        if(layerKey === "BGRIBordersOnly"){
            layer = tileProviders[layerKey];

            if(checked && !this.map.hasLayer(layer)){
                this.map.addLayer(layer);
            }
            else if(!checked && this.map.hasLayer(layer)){
                this.map.removeLayer(layer);
            }
        }

        else if(layerKey === "rios"){
            layer = tileProviders[layerKey];

            if(checked && !this.map.hasLayer(layer)){
                this.map.addLayer(layer);
            }
            else if(!checked && this.map.hasLayer(layer)){
                this.map.removeLayer(layer);
            }
        }

        else if(layerKey === "MapQuestOpen_HybridOverlay"){
            layer = tileProviders[layerKey];

            if(checked && !this.map.hasLayer(layer)){
                this.map.addLayer(layer);
            }
            else if(!checked && this.map.hasLayer(layer)){
                this.map.removeLayer(layer);
            }
        }

        else if(layerKey === "cirac_risk_lx_T500"){
            layer = tileProviders[layerKey];

            if(checked && !this.map.hasLayer(layer)){
                this.map.addLayer(layer);
            }
            else if(!checked && this.map.hasLayer(layer)){
                this.map.removeLayer(layer);
            }
        }

        else if(layerKey === "cirac_risk_lx_structure"){
            layer = tileProviders[layerKey];

            if(checked && !this.map.hasLayer(layer)){
                this.map.addLayer(layer);
            }
            else if(!checked && this.map.hasLayer(layer)){
                this.map.removeLayer(layer);
            }
        }

        else if(layerKey === "cirac_risk_cmbr_bx_T500"){
            layer = tileProviders[layerKey];

            if(checked && !this.map.hasLayer(layer)){
                this.map.addLayer(layer);
            }
            else if(!checked && this.map.hasLayer(layer)){
                this.map.removeLayer(layer);
            }
        }

        else if(layerKey === "cirac_risk_cmbr_sul_structure"){
            layer = tileProviders[layerKey];

            if(checked && !this.map.hasLayer(layer)){
                this.map.addLayer(layer);
            }
            else if(!checked && this.map.hasLayer(layer)){
                this.map.removeLayer(layer);
            }
        }

        else if(layerKey === "cirac_risk_algs_structure"){
            layer = tileProviders[layerKey];

            if(checked && !this.map.hasLayer(layer)){
                this.map.addLayer(layer);
            }
            else if(!checked && this.map.hasLayer(layer)){
                this.map.removeLayer(layer);
            }
        }

        else if(layerKey === "cirac_risk_algs_T500"){
            layer = tileProviders[layerKey];

            if(checked && !this.map.hasLayer(layer)){
                this.map.addLayer(layer);
            }
            else if(!checked && this.map.hasLayer(layer)){
                this.map.removeLayer(layer);
            }
        }
        
    },
/*
    stopPropagation: function(e){
        e.stopPropagation();
    },
*/    
});


var TabMenuLV = Mn.LayoutView.extend({

    template: "map/templates/tab-menu.html",

    className: "info",
    attributes: {
        style: "margin-top: 10px; width: 500px;"
    },

    initialize: function(){
        tabChannel.comply("show:point:list", function(data){
            this.showPointList(data);
        }, this);

        tabChannel.comply("show:my:maps", function(){
            this.showMyMaps();
        }, this);
    },

    regions: {
        contentRegion: "#tab-content-region"
    },

    events: {
        "click li#tile-switcher": function(){
            this.model.set("activeTabId", "tile-switcher");
        },
        "click li#my-maps": function(){
            this.model.set("activeTabId", "my-maps");
        },
    },

    modelEvents: {
        "change:activeTabId": "updateContents"
    },

    updateContents: function(){

        this.$("li").removeClass("active");

        var newActiveTab = this.model.get("activeTabId");
        this.$("#" + newActiveTab).addClass("active")

        if(newActiveTab=="tile-switcher"){
            this.showTileSwitcher()
        }
        else if(newActiveTab=="my-maps"){
            // if we already have a point collection (from an upload already done), show it
            if(window.pointCollection){
                this.showPointList()
            }
            else{
                this.showMyMaps()    
            }
            
        }
    },

    onBeforeShow: function(){
        this.updateContents();
    },

    onBeforeDestroy: function(){
        tabChannel.stopComplying("show:point:list");
    },

    showTileSwitcher: function(e){
        var tileSwitcherIV = new TileSwitcherIV({
            model: optionsMenuM
        });
        tileSwitcherIV.map = this.map;

        this.contentRegion.show(tileSwitcherIV);
    },

    showMyMaps: function(){
        var myMapsIV = new MyMapsIV({
            model: optionsMenuM
        });
        myMapsIV.map = this.map;

        this.contentRegion.show(myMapsIV);
    },

    showPointList: function(data){

        // update the point collection
        if(data){
            window.pointCollection = new Backbone.Collection(data);    
        }
        
        var pointsListCV = new PointsListCV({
            collection: pointCollection
        });
        pointsListCV.map = this.map;


        this.contentRegion.show(pointsListCV);
    }


});



var MainControlLV = Mn.LayoutView.extend({

    className: "main-control",
    template: "map/templates/main-control.html",

    initialize: function(){
        // var x = $(this.el).find(".glyphicon-menu-hamburger");
        // debugger;

    },

    // NOTE: we wire up the events here instead of the events hash to avoid using event delegation (which 
    // don't seem to work well with stopPropagation)
    onRender: function(){
        var self = this;

        $(this.el).find(".glyphicon-menu-hamburger").on("click", function(e){
            self.toggleMenu(e);
        });

        // NOTE: to work in firefox we must add "DOMMouseScroll MozMousePixelScroll" (!???)
        // http://stackoverflow.com/questions/13274326/firefoxjquery-mousewheel-scroll-event-bug
        $(this.el).on("mousewheel DOMMouseScroll MozMousePixelScroll dblclick", function(e){
            e.stopPropagation();
        });

        // check the correct event name (from modernizr)
        var eventName = "mousedown";
        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            eventName = "touchstart";
        }

        $(this.el).on(eventName, function(e){
            console.log(eventName)
            e.stopPropagation();
        });

        // NOTE: for non-touch browsers, "click" and "dblclick" are not necessary ("mousedown" is sufficient); but they are for
        // touch devices (where "touchstart" will be used insteadof "mousedown")
        $(this.el).on("dblclick", function(e){
            e.stopPropagation();
        });

        $(this.el).on("click", function(e){
            e.stopPropagation();
        });

    },

    events: {
       
        //"click .glyphicon-menu-hamburger": "toggleMenu",
        //"click": "stopPropagation", // avoid showing the popup on the map
        //"click": "temp",
        //"dblclick": "stopPropagation", // avoid zoom on the map
        //"mousedown": "stopPropagation",  // avoid dragging on the map
        //"mousewheel": "stopPropagation" // avoid dragging on the map
        //"mousewheel": "temp"
        

    },

    regions: {
        controlMainRegion: "#control-main-region"
    },

    temp: function(e){
        console.log("mousewheel");
        e.stopPropagation();
        debugger;
    },

    stopPropagation: function(e){
//debugger;
        e.stopPropagation();
    },

    toggleMenu: function(e){
//debugger;
        e.stopPropagation();

//debugger;
        var menuIsOpen = this.controlMainRegion.hasView()
        menuIsOpen ? this.closeMenu() : this.openMenu();
    },

    openMenu: function(){
        window.map = this.map;
        //var tileSwitcherIV = new TileSwitcherIV({
        var tabMenuLV = new TabMenuLV({
            model: optionsMenuM
        });

        // the nested view must have a reference to the map
        tabMenuLV.map = this.map;

        this.controlMainRegion.show(tabMenuLV);
    },

    closeMenu: function(){
//        debugger;
        this.controlMainRegion.reset();
    }
});

var mainControlLV = new MainControlLV({
    model: optionsMenuM
});
mainControlLV.render();

// mainControlLV.$(".glyphicon-menu-hamburger").on("click", function(e){
//     debugger;
//     mainControlLV.toggleMenu(e);
// });

// mainControlLV.$(".glyphicon-menu-hamburger").on("dblclick", function(e){
//     debugger;
// });

// mainControlLV.$el.on("mousedown", function(e){
//     debugger;
//     //e.stopPropagation();
//     //mainControlLV.toggleMenu(e);
// });

// $("body").on("mousedown", "#control-main-region", function(e){
//     debugger;
    //e.stopPropagation();
    //mainControlLV.toggleMenu(e);
// });


var MapIV = Mn.ItemView.extend({
    template: "map/templates/map.html",
    attributes: {
        "style": "height: 100%;"
    },

    initialize: function() {
    },

    onAttach: function() {

        this.initializeMap();
        this.addBasicControls();
        this.addGeocoderControl();
        this.initializeVulnLegend();
        this.registerMapEvents();

    },

    initializeMap: function() {
                
        //this.map = L.map('map', {
        this.map = L.mapbox.map('map', undefined, {
            center: [38.75, -9.15],
            zoomControl: false,
            attributionControl: false,
            zoom: 8,
            //maxZoom: 16,
            minZoom: 6,
            //layers: [overlays["Mapa base"]["Ruas"]]
            
            // contextmenu: true,

            // contextmenuWidth: 180,
            // contextmenuItems: [{
            //     text: 'Normal layout',
            //     //icon: <span class="glyphicon glyphicon-th-large"></span>
            //     callback: this.mapLayoutNormal
            // }, {
            //     text: 'Splitted layout (2 maps)',
            //     //icon: <span class="glyphicon glyphicon-th-large"></span>
            //     callback: this.mapLayout2
            // }, {
            //     text: 'Splitted layout (3 maps)',
            //     //icon: 'images/zoom-in.png',
            //     callback: this.mapLayout3
            // }]
        });

        this.map.addLayer(tileProviders["MapQuestOpen.OSM"]);
        /*
        this.map2 = L.map('map2', {
            center: [38.75, -9.15],
            zoomControl: false,
            attributionControl: false,
            zoom: 10,
            maxZoom: 16,
            minZoom: 6,
            //layers: [overlays["Mapa base"]["Ruas"]]
            
            // contextmenu: true,

            // contextmenuWidth: 180,
            // contextmenuItems: [{
            //     text: 'Normal layout',
            //     //icon: <span class="glyphicon glyphicon-th-large"></span>
            //     callback: this.mapLayoutNormal
            // }, {
            //     text: 'Splitted layout (2 maps)',
            //     //icon: <span class="glyphicon glyphicon-th-large"></span>
            //     callback: this.mapLayout2
            // }, {
            //     text: 'Splitted layout (3 maps)',
            //     //icon: 'images/zoom-in.png',
            //     callback: this.mapLayout3

            // }]
        });

        this.map2.addLayer(tileProviders["MapQuestOpen.OSM"]);
*/
        // start sync
        //this.map.sync(this.map2);
        //this.map2.sync(this.map);


    },

    mapLayoutNormal: function(dividers){
        debugger;
    },

    mapLayout2: function(dividers){
        debugger;
    },

    mapLayout3:function(dividers){
        debugger;
    },

    addBasicControls: function() {

        // add the zoom control manually
        var zoomControl = L.control.zoom({
            position: "topright"
        });
        this.map.addControl(zoomControl);


        // add the scale control
        var scaleControl = L.control.scale({
            position: "bottomright",
            imperial: false,
            maxWidth: 130
        });
        this.map.addControl(scaleControl);


        // add the main control
        var mainControl = new L.Control.BackboneView({
            view: mainControlLV,
            position: "topleft"
        });
        this.map.addControl(mainControl);

    },

    addGeocoderControl: function(){
        var geocoderOptions = {
            placeholder: "Search address...",
            errorMessage: "Morada desconhecida",
            geocoder: L.Control.Geocoder.bing('AoArA0sD6eBGZyt5PluxhuN7N7X1vloSEIhzaKVkBBGL37akEVbrr0wn17hoYAMy'),
            //geocoder: L.Control.Geocoder.google('AIzaSyBoM_J6Ysno6znvigDm3MYja829lAeVupM'),
            
            collapsed: "true",
        };

        var geocoder = L.Control.geocoder(geocoderOptions).addTo(this.map);
        var view = this;

        geocoder.markGeocode = function(result) {

            var promise;

            if(view.hasVulnMap()){
                promise = $.ajax({
                    url: "/api/vulnerabilities/" + result.center.lat + "," + result.center.lng + "?map=" + view.getCurrentMapTable()
                });
            }


            Q(promise)
                .then(function(data) {

                    if(!data){
                        data = [{value: undefined}];
                    }

                    view.map.fitBounds(result.bbox);

                    if (view._geocodeMarker) {
                        view.map.removeLayer(view._geocodeMarker);
                    }

                    view._geocodeMarker = new L.Marker(result.center)
                        //.bindPopup(result.name + " <br><br> Vulnerabilidade: " + data[0].value)
                        .bindPopup(util.getPopupMessage(data[0].value, result.name))
                        .addTo(view.map)
                        .openPopup();

                    //console.log("TODO: in the markGeocode callback, get the vulnerability of the point. Result: ", result);

                })
                .catch(function(err) {
                    throw err;
                });

            return this;
        };
    },

    hasVulnMap: function(){

        if(
            this.map.hasLayer(tileProviders["cirac_vul_bgri_FVI_N"])  ||
            this.map.hasLayer(tileProviders["cirac_vul_bgri_FVI_75"]) || 
            this.map.hasLayer(tileProviders["cirac_vul_bgri_cfvi"])   ||
            this.map.hasLayer(tileProviders["cirac_vul_bgri_cfvi75"]) ||
            this.map.hasLayer(tileProviders["cirac_vul_bgri_E"]) ||
            this.map.hasLayer(tileProviders["cirac_vul_bgri_E75"]) ||
            this.map.hasLayer(tileProviders["cirac_vul_bgri_SF"]) ||
            this.map.hasLayer(tileProviders["cirac_vul_bgri_SF75"])

        ){
            return true;
        }

        return false;
    },

    getCurrentMapTable: function(){
        var mapTable = "";
        if(this.map.hasLayer(tileProviders["cirac_vul_bgri_FVI_N"])){
            mapTable = "cirac_vul_bgri_fvi_n";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_bgri_FVI_75"])){
            mapTable = "cirac_vul_bgri_fvi_75";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_cp4_fvi"])){
            mapTable = "cirac_vul_cp4_fvi";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_cp4_fvi75"])){
            mapTable = "cirac_vul_cp4_fvi75";
        }


        else if(this.map.hasLayer(tileProviders["cirac_vul_bgri_cfvi"])){
            mapTable = "cirac_vul_bgri_cfvi";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_bgri_cfvi75"])){
            mapTable = "cirac_vul_bgri_cfvi75";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_cp4_cfvi_mode"])){
            mapTable = "cirac_vul_cp4_cfvi_mode";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_cp4_cfvi_75"])){
            mapTable = "cirac_vul_cp4_cfvi_75";
        }


        else if(this.map.hasLayer(tileProviders["cirac_vul_bgri_E"])){
            mapTable = "cirac_vul_bgri_e";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_bgri_E75"])){
            mapTable = "cirac_vul_bgri_e75";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_cp4_e"])){
            mapTable = "cirac_vul_cp4_e";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_cp4_e75"])){
            mapTable = "cirac_vul_cp4_e75";
        }


        else if(this.map.hasLayer(tileProviders["cirac_vul_bgri_SF"])){
            mapTable = "cirac_vul_bgri_sf";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_bgri_SF75"])){
            mapTable = "cirac_vul_bgri_sf75";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_cp4_sf"])){
            mapTable = "cirac_vul_cp4_sf";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_cp4_sf75"])){
            mapTable = "cirac_vul_cp4_sf75";
        }


        else if(this.map.hasLayer(tileProviders["cirac_vul_bgri_ssi"])){
            mapTable = "cirac_vul_bgri_ssi";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_bgri_ssi75"])){
            mapTable = "cirac_vul_bgri_ssi75";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_cp4_ssi"])){
            mapTable = "cirac_vul_cp4_ssi";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_cp4_ssi75"])){
            mapTable = "cirac_vul_cp4_ssi75";
        }


        else if(this.map.hasLayer(tileProviders["cirac_vul_bgri_tf"])){
            mapTable = "cirac_vul_bgri_tf";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_bgri_tf75"])){
            mapTable = "cirac_vul_bgri_tf75";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_cp4_tf"])){
            mapTable = "cirac_vul_cp4_tf";
        }
        else if(this.map.hasLayer(tileProviders["cirac_vul_cp4_tf75"])){
            mapTable = "cirac_vul_cp4_tf75";
        }

        else{
            throw new Error("ERROR: the selected vulnerability map is unknown");
        }

        return mapTable;
    },



    initializeVulnLegend: function() {

        // legend control for normal FVI

        var FVINormalLegendControl = L.Control.extend({

            options: {
                position: 'bottomright'
            },

            onAdd: function(map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    vuln = [3, 6, 8, 11, 13];

                div.innerHTML = '<div style="margin-bottom: 5px; font-weight: 700;">FVI (normal)</div>';

                for (var i = 0; i < vuln.length-1; i++) {

                    div.innerHTML +=
                        '<div style="margin-bottom: 2px;"><i style="background:' + scales.FVINormalColors(vuln[i]) + '"></i>&nbsp;' +
                        vuln[i] + '-' + (vuln[i+1]-1) +  '&nbsp;<div>';
                }

                return div;
            }
        });

        this.fviNormalLegendControl = new FVINormalLegendControl();


        // legend control for combined FVI
        var FVICombinedLegendControl = L.Control.extend({

            options: {
                position: 'bottomright'
            },

            onAdd: function(map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    vuln = [1, 2, 3, 4, 5, 6, 7, 8];

                div.innerHTML = '<div style="margin-bottom: 5px; font-weight: 700;">FVI (combined)</div>';

                for (var i = 0; i < vuln.length; i++) {

                    div.innerHTML +=
                        '<div style="margin-bottom: 2px;"><i style="background:' + scales.FVICombinedColors(vuln[i]) + '"></i>&nbsp;' +
                        vuln[i] +  '&nbsp;<div>';
                }

                return div;
            }
        });

        this.fviCombinedLegendControl = new FVICombinedLegendControl();


        // legend control for exposure 
        var ExposureLegendControl = L.Control.extend({

            options: {
                position: 'bottomright'
            },

            onAdd: function(map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    vuln = ["Low", "Moderate", "High", "Very high"];


                div.innerHTML = '<div style="margin-bottom: 5px; font-weight: 700;">Exposure</div>';

                for (var i = 0; i < vuln.length; i++) {

                    div.innerHTML +=
                        '<div style="margin-bottom: 2px;"><i style="background:' + scales.exposureColors(vuln[i]) + '"></i>&nbsp;' +
                        vuln[i] +  '&nbsp;<div>';
                }

                return div;
            }
        });

        this.exposureLegendControl = new ExposureLegendControl();


        // legend control for physical susceptibility
        var PhysicalSusceptibilityLegendControl = L.Control.extend({

            options: {
                position: 'bottomright'
            },

            onAdd: function(map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    vuln = ["Low", "Moderate", "High", "Very high"];

                div.innerHTML = '<div style="margin-bottom: 5px; font-weight: 700;">Physical Susceptibility</div>';

                for (var i = 0; i < vuln.length; i++) {

                    div.innerHTML +=
                        '<div style="margin-bottom: 2px;"><i style="background:' + scales.physicalSusceptibilityColors(vuln[i]) + '"></i>&nbsp;' +
                        vuln[i] +  '&nbsp;<div>';
                }

                return div;
            }
        });

        this.physicalSusceptibilityLegendControl = new PhysicalSusceptibilityLegendControl();


        // legend control for social susceptibility
        var SocialSusceptibilityLegendControl = L.Control.extend({

            options: {
                position: 'bottomright'
            },

            onAdd: function(map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    vuln = ["Low", "Moderate", "High", "Very high"];

                div.innerHTML = '<div style="margin-bottom: 5px; font-weight: 700;">Social Susceptibility</div>';

                for (var i = 0; i < vuln.length; i++) {

                    div.innerHTML +=
                        '<div style="margin-bottom: 2px;"><i style="background:' + scales.socialSusceptibilityColors(vuln[i]) + '"></i>&nbsp;' +
                        vuln[i] +  '&nbsp;<div>';
                }

                return div;
            }
        });

        this.socialSusceptibilityLegendControl = new SocialSusceptibilityLegendControl();

        // legend control for precipitation index
        var PrecipitationLegendControl = L.Control.extend({

            options: {
                position: 'bottomright'
            },

            onAdd: function(map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    vuln = ["Low", "Moderate", "High", "Very high"];

                div.innerHTML = '<div style="margin-bottom: 5px; font-weight: 700;">Precipitation Index</div>';

                for (var i = 0; i < vuln.length; i++) {

                    div.innerHTML +=
                        '<div style="margin-bottom: 2px;"><i style="background:' + scales.precipitationColors(vuln[i]) + '"></i>&nbsp;' +
                        vuln[i] +  '&nbsp;<div>';
                }

                return div;
            }
        });

        this.precipitationLegendControl = new PrecipitationLegendControl();
    },



    registerMapEvents: function() {

        var view = this;


        this.map.on('click', function getVulnerability(e) {

            if(!view.hasVulnMap()){
                return;
            }

            var promise = $.ajax({
                url: "/api/vulnerabilities/" + e.latlng.lat + "," + e.latlng.lng + "?map=" + view.getCurrentMapTable()
            });


            Q(promise)
                .then(function(data) {
//                    console.log(data[0])

                    if (view._geocodeMarker) {
                        view.map.removeLayer(view._geocodeMarker);
                    }

                    view._geocodeMarker = new L.Marker([e.latlng.lat, e.latlng.lng])
                        //.bindPopup("Vulnerabilidade: " + data[0].value)
                        .bindPopup(util.getPopupMessage(data[0].value))
                        .addTo(view.map)
                        .openPopup();
                })
                .catch(function(err) {
                    throw err;
                });
        });

        // callback to update the legend 
        this.map.on("layeradd", function(e){
//debugger;
            // we only care if the layer that was added is a TileLayer
            if(!(e.layer instanceof L.TileLayer)){ return; }

            var tilesUrl = "";
            if(e.layer._url){
                tilesUrl = e.layer._url.toLowerCase();
            }

            // if the bgri borders was added, return early too
            if(tilesUrl.indexOf("borders") != -1){ return; }

            // if there is a geoJson layer, return early too (that is, don't remove the legend)
            var hasGeoJSON = false;
            this.map.eachLayer(function(l){
                if(l instanceof L.GeoJSON){
                    hasGeoJSON = true;
                }
            });

            //debugger;
            if(hasGeoJSON){ return; }


            if(view.currentLegendControl){
                view.map.removeControl(view.currentLegendControl);
            }
//debugger;
            // normal FVI - show the corresponding legend control
            if(tilesUrl.indexOf("cirac_vul_bgri_fvi_n/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_bgri_fvi_75/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_cp4_fvi/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_cp4_fvi75/{z}/{x}/{y}.png") > 0){

                view.currentLegendControl = view.fviNormalLegendControl;
                
            }

            // combined FVI - show the corresponding legend control
            else if(tilesUrl.indexOf("cirac_vul_bgri_cfvi/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_bgri_cfvi75/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_cp4_cfvi_mode/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_cp4_cfvi_75/{z}/{x}/{y}.png") > 0){

                view.currentLegendControl = view.fviCombinedLegendControl;
            }

            // exposure - show the corresponding legend control
            else if(tilesUrl.indexOf("cirac_vul_bgri_e/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_bgri_e75/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_cp4_e/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_cp4_e75/{z}/{x}/{y}.png") > 0
                ){

                view.currentLegendControl = view.exposureLegendControl;
            }

            // physical susc - show the corresponding legend control
            else if(tilesUrl.indexOf("cirac_vul_bgri_sf/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_bgri_sf75/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_cp4_sf/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_cp4_sf75/{z}/{x}/{y}.png") > 0
                ){

                view.currentLegendControl = view.physicalSusceptibilityLegendControl;
            }

            // social susc - show the corresponding legend control
            else if(tilesUrl.indexOf("cirac_vul_bgri_ssi/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_bgri_ssi75/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_cp4_ssi/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_cp4_ssi75/{z}/{x}/{y}.png") > 0
                ){

                view.currentLegendControl = view.physicalSusceptibilityLegendControl;
            }

            // precipitation - show the corresponding legend control
            else if(tilesUrl.indexOf("cirac_vul_bgri_tf/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_bgri_tf75/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_cp4_tf/{z}/{x}/{y}.png") > 0 ||
                tilesUrl.indexOf("cirac_vul_cp4_tf75/{z}/{x}/{y}.png") > 0
                ){

                view.currentLegendControl = view.physicalSusceptibilityLegendControl;
            }

            else{
                view.currentLegendControl = undefined;
            }

            // update the legend control (if not undefined)
            if(view.currentLegendControl){
                view.map.addControl(view.currentLegendControl);
            }


        }, this);
    },


});
