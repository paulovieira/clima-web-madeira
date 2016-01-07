window.tileJson = {};

tileJson["cirac_vul_CP4_FVI_18fae2" ]= {
    "bounds": [-9.5691, 36.8928, -6.1194, 42.2244],
    "format": "png8",
    "interactivity": {
        "layer": "cirac_vul_CP4_FVI",
        "template_full": "The value is: {{{value}}}\n<br>\nThe zip code is: {{{zipcode}}}",
        "fields": ["value", "zipcode", "gid"]
    },
    "minzoom": 6,
    "maxzoom": 15,
    "srs": "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over",
    "Stylesheet": [{
        "data": "/*\nMap {\n  background-color: #99CDFE;\n}\n\n\n#countries {\n  ::outline {\n    line-color: #85c5d3;\n    line-width: 2;\n    line-join: round;\n  }\n  polygon-fill: #fff;\n}\n\n\n*/\n\n\n\n/*\nSettings to use when rendering to mbtiles:\n\nZoom: 8-15 (not 16!)\nCenter: -9.1296,38.7198,10\nBounds (whole country): -9.5691,36.8928,-6.1194,42.2244\nBounds (only lisbon): -9.3988,38.5632,-8.877,38.9712\nMetatile size: 8\n\n*/\n\n\n/* set border of the CP according to the zoom */\n\n#cirac_vul_CP4_FVI[zoom<=10] {\n  line-color: black;\n  line-width:0.3;\n}\n\n#cirac_vul_CP4_FVI[zoom=11] {\n  line-color: black;\n  line-width:0.4;\n}\n\n#cirac_vul_CP4_FVI[zoom=12] {\n  line-color: black;\n  line-width:0.5;\n}\n\n#cirac_vul_CP4_FVI[zoom>=13] {\n  line-color: black;\n  line-width:0.6;\n}\n\n/* \n \nSet fill color of the CP according to the vulnerability value. The scale has 4 values:\n\nbaixo 3-5 #38A800\nmoderado 6-7 #FFFF00\nelevado 8-10 #FF9500\nmuito elevado 11-12 #FF0000\n \n*/\n\n#cirac_vul_CP4_FVI[value>=3][value<=5] {\n  polygon-opacity:1;\n  polygon-fill:#38A800;\n}\n\n#cirac_vul_CP4_FVI[value>=6][value<=7] {\n  polygon-opacity:1;\n  polygon-fill:#FFFF00;\n}\n\n#cirac_vul_CP4_FVI[value>=8][value<=10] {\n  polygon-opacity:1;\n  polygon-fill:#FF9500;\n}\n\n#cirac_vul_CP4_FVI[value>=11][value<=12] {\n  polygon-opacity:1;\n  polygon-fill:#FF0000;\n}\n\n",
        "id": "style.mss"
    }],
    "Layer": [{
        "id": "countries",
        "name": "countries",
        "srs": "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over",
        "geometry": "polygon",
        "Datasource": {
            "file": "/home/pvieira/Documents/MapBox/project/cirac_vul_CP4_FVI/layers/countries/82945364-10m-admin-0-countries.shp",
            "type": "shape"
        }
    }, {
        "geometry": "polygon",
        "extent": [-9.51701572399998, 36.9617245920001, -6.18912292999994, 42.154351234],
        "Datasource": {
            "type": "postgis",
            "table": "cirac_vul_CP4_FVI\n",
            "key_field": "gid",
            "geometry_field": "geom",
            "extent_cache": "auto",
            "extent": "-9.51701572399998,36.9617245920001,-6.18912292999994,42.154351234",
            "user": "pvieira",
            "password": "budapeste",
            "dbname": "aps_150504",
            "id": "cirac_vul_CP4_FVI",
            "project": "cirac_vul_CP4_FVI",
            "srs": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
            "max_size": 8
        },
        "id": "cirac_vul_CP4_FVI",
        "class": "",
        "srs-name": "WGS84",
        "srs": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
        "advanced": {},
        "name": "cirac_vul_CP4_FVI"
    }],
    "scale": 1,
    "metatile": 8,
    "id": "cirac_vul_CP4_FVI",
    "_updated": 1432735737000,
    "name": "cirac_vul_CP4_FVI",
    "description": "",
    "legend": "<div class='my-legend'>\n<div class='legend-title'>The Title or Explanation of your Map</div>\n<div class='legend-scale'>\n  <ul class='legend-labels'>\n    <li><span style='background:#8DD3C7;'></span>One</li>\n    <li><span style='background:#FFFFB3;'></span>Two</li>\n    <li><span style='background:#BEBADA;'></span>Three</li>\n    <li><span style='background:#FB8072;'></span>Four</li>\n    <li><span style='background:#80B1D3;'></span>etc</li>\n  </ul>\n</div>\n<div class='legend-source'>Source: <a href=\"#link to source\">Name of source</a></div>\n</div>\n\n<style type='text/css'>\n  .my-legend .legend-title {\n    text-align: left;\n    margin-bottom: 5px;\n    font-weight: bold;\n    font-size: 90%;\n    }\n  .my-legend .legend-scale ul {\n    margin: 0;\n    margin-bottom: 5px;\n    padding: 0;\n    float: left;\n    list-style: none;\n    }\n  .my-legend .legend-scale ul li {\n    font-size: 80%;\n    list-style: none;\n    margin-left: 0;\n    line-height: 18px;\n    margin-bottom: 2px;\n    }\n  .my-legend ul.legend-labels li span {\n    display: block;\n    float: left;\n    height: 16px;\n    width: 30px;\n    margin-right: 5px;\n    margin-left: 0;\n    border: 1px solid #999;\n    }\n  .my-legend .legend-source {\n    font-size: 70%;\n    color: #999;\n    clear: both;\n    }\n  .my-legend a {\n    color: #777;\n    }\n</style>",
    "tilejson": "2.0.0",
    "scheme": "xyz",
    "tiles": ["http://cirac.dev/tiles/v2/cirac_vul_CP4_FVI_18fae2/{z}/{x}/{y}.png"],
    "grids": ["http://cirac.dev/tiles/v2/cirac_vul_CP4_FVI_18fae2/{z}/{x}/{y}.grid.json"],
    "template": "{{#__location__}}{{/__location__}}{{#__teaser__}}{{/__teaser__}}{{#__full__}}The value is: {{{value}}}\n<br>\nThe zip code is: {{{zipcode}}}{{/__full__}}",
    "version": "1.0.0"
};
