 window.Behaviors = window.Behaviors || {};

 // NOTE: this is the view where the behavior is defined
 window.Behaviors.ShowModal = Marionette.Behavior.extend({

     events: function(){
        var eventsHash = {};
        
        // default event type is "click"
        var eventType = this.options.eventType || "click";

        eventsHash[eventType + " @ui." + this.options.uiKey] = "showModal";

        return eventsHash;
     },

     showModal: function(e){
debugger;
        // IMPORTANT: we should use e.currentTarget instead of e.target, otherwise we 
        // get a <i> element (instead of <a>) when the click is done in the middle of 
        // the button
        var $anchor = $(e.currentTarget);

        // call preventDefault to avoid having the hash fragment changed
        e.preventDefault();
                
        // NOTE: this.view is the view where the behaviour was declared (that is, menuBodyIV)
        var mapIndex = this.view.model.get("mapIndex");
        var mapM = Cartografia.getMapModel(mapIndex);

        var layerId = $anchor.data("mapId");
        var layerM = mapM.get("layersC").get(layerId);
        if(!layerM){
            layerM = mapM.get("exclusiveLayersC").get(layerId);
        }
        
        var modalView = new this.options.viewClass({
            model: layerM
        });

         var $modal = $("#modal-1");
         var region = Cartografia.modalOneRegion;

         // first set the content of the modal
         region.show(modalView);

         // then show the modal 
         $modal.modal("show");
     },
 });


 // close the modal and destroy the view
 window.Behaviors.CloseModal = Marionette.Behavior.extend({

     // behaviors have events that are bound to the views DOM
     events: {
         "click @ui.closeBtn": "closeModal",
     },

     closeModal: function(){

        var $modal = $("#modal-1");
        $modal.modal("hide");
        this.view.destroy();
     },

 });


