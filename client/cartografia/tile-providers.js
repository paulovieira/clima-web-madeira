Cartografia.tileProviders = {

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
        subdomains: '1234',
        opacity: 0.9
    }),

};
