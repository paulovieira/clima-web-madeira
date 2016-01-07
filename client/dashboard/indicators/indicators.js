var indicatorsChannel = Backbone.Radio.channel('indicators');

var IndicatorsProcessoIV = Mn.ItemView.extend({

    template: "indicators/templates/indicators-processo.html",
});

var IndicatorsConteudoIV = Mn.ItemView.extend({

    template: "indicators/templates/indicators-conteudo.html",
});

var IndicatorsTabLV = Mn.LayoutView.extend({

    initialize: function(){

        indicatorsChannel.reply("show:indicators:processo", function(){

            //this.$("a[data-tab-separator='indicators-processo']").trigger("click");
            this.ui.tabIndicatorsProcesso.trigger("click");
        }, this);

        indicatorsChannel.reply("show:indicators:conteudo", function(){

            //this.$("a[data-tab-separator='indicators-conteudo']").trigger("click");
            this.ui.tabIndicatorsConteudo.trigger("click");
        }, this);
    },

    template: "indicators/templates/indicators-tab.html",

    regions: {
        contentsRegion: ".mn-r-content"
    },

    ui: {
        "tabSeparator": "a.js-dashboard-sep",
        "tabIndicatorsProcesso": "a[data-tab-separator='indicators-processo']",
        "tabIndicatorsConteudo": "a[data-tab-separator='indicators-conteudo']"
    },

    events: {
        "click @ui.tabSeparator": "updateView"
    },

    // the initial view will be the list of all files
    onBeforeShow: function(){

        indicatorsChannel.request("show:indicators:processo")
    },


    onDestroy: function(){

        indicatorsChannel.reset();
    },

    updateView: function(e){

        e.preventDefault();

        var $target = $(e.target);
        $target.parent().siblings().removeClass("active");
        $target.parent().addClass("active");

        switch($target.data("tabSeparator")){

            case "indicators-processo":
                this.showindicatorsProcesso();
                break;
            case "indicators-conteudo":
                this.showindicatorsConteudo();
                break;
            default:
                throw new Error("unknown tab separator");
        }
    },

    showindicatorsProcesso: function(){

        var indicatorsProcessoIV = new IndicatorsProcessoIV({
            model: indicatorsProcessoM
        });

        this.contentsRegion.show(indicatorsProcessoIV);
    },

    showindicatorsConteudo: function(){

        var indicatorsConteudoIV = new IndicatorsConteudoIV({
            model: indicatorsConteudoM
        });
        this.contentsRegion.show(indicatorsConteudoIV);
    },

});


