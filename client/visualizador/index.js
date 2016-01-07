var leftMenuChannel = Backbone.Radio.channel('leftMenu');

var Cirac = new Mn.Application();

Cirac.$modal1 = $("#modal-1");
Cirac.$modal2 = $("#modal-2");


Cirac.addRegions({
    mainRegion: "#main-region",
    modal1Region: "#modal1-content-region",
    modal2Region: "#modal2-content-region"
});

// var TestIV = Mn.ItemView.extend({
//     template: "map/templates/test.html"
// });

// var myModel = new Backbone.Model({
//     name: "paulo"
// });

// var testIV = new TestIV({
//     model: myModel
// });

var mapIV = new MapIV();
Cirac.mainRegion.show(mapIV);


