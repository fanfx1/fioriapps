jQuery.sap.require("sap.ui.model.Sorter");
jQuery.sap.require("newstile.NewsTileUtils");
jQuery.sap.require("sap.suite.ui.commons.FeedTile");
jQuery.sap.require("sap.suite.ui.commons.FeedItem");
jQuery.sap.require("sap.suite.ui.commons.util.FeedAggregator");

sap.ui.jsview("newstile.NewsTile", {

    getControllerName : function() {

        return "newstile.NewsTile";
    },

    createContent : function(oController) {
        var that=this;
        this.setHeight('100%');
        var oChipApi = this.getViewData().chip;
        jQuery.sap.includeStyleSheet(oChipApi.url.toAbsoluteUrl("newstile/news_tile.css"));

    /*  var oFeedItemTemplate = new sap.suite.ui.commons.FeedItem({
            title : "{title}",
            image : "{image}",
            link : "{link}",
            source : "{source}",
            publicationDate : "{pubDate}"
        });*/

        this.oDefaultImages = [];
        var sTooltip = "";
        if (!oChipApi.preview.isEnabled()) {
            var oDefaultImage = newstile.NewsTileUtils.getDefaultImageConfig(oChipApi);
            if (!oDefaultImage) {
                this.oDefaultImages = newstile.NewsTileUtils.getFinalDefaultImages(oChipApi);
            } else {
                this.oDefaultImages.push(oDefaultImage);
            }

            sTooltip = oController.getNewsTileTooltip();
        }

    /*  this._newsTile = new sap.suite.ui.commons.FeedTile(oController.createId("feedTile"), {
            defaultImages : oDefaultImages,

            displayArticleImage : newstile.NewsTileUtils.getUseDefaultImageConfig(oChipApi),
            tooltip : sTooltip,
            displayDuration : parseInt(newstile.NewsTileUtils.getCycleIntervalConfig(oChipApi), 10),
            press : function(evt) {

                oController.select(evt);
            },
            items : {
                path : "/items",
                template : oFeedItemTemplate
            }
        });*/
 
        //-----------------------------------------------******------------------------------------------\\
          var oNewsTileContent = new sap.suite.ui.commons.TileContent({
              footer : {
                  path : "pubDate", 
  		// 		  type: 'sap.ui.model.type.Date',
				//   formatOptions: {
				//     style: 'medium',
				// 	source: {
				// 	    pattern: 'yyyyMMdd'
				// 	  }
				// }
                  formatter: function(date){
                      return  newstile.NewsTileUtils.calculateFeedItemAge(date);
                  }
              },
               content: new sap.suite.ui.commons.NewsContent({
                      contentText: "{title}",
                  /* contentText:{
                       path : "title",
                       formatter: function(title){
                           if(!title){
                               console.log(title);
                               return "No Articles to display";
                           }
                           else{
                               console.log(title);
                           return  title;
                           }
                       }
                   },*/
                       subheader: "{source}"
              })
       });

      this.oNewsTile = new sap.suite.ui.commons.GenericTile({
               frameType: "TwoByOne",
               header: "{header}",
               size: "{size}",
              backgroundImage : "{image}",
         /*     backgroundImage :  {
                  path : "image",
                  formatter: function(image){
                      if(!image){
                         return newstile.NewsTileUtils.getDefaultImage(that.oDefaultImages,-1);
                      }
                      else{
                          return image;
                      }
                  }
              },*/
              tileContent: [
                  oNewsTileContent
               ],
               press : function(evt) {

                   oController.select(evt);
               },
      });

      this._newsTile = new sap.suite.ui.commons.DynamicContainer(oController.createId("feedTile"), {
              displayTime:  parseInt(newstile.NewsTileUtils.getCycleIntervalConfig(oChipApi)),
              transitionTime: 500,
               tiles: {
                      template: that.oNewsTile,
                      path: "/items"
              },

       });
      this.oNewsTile.attachPress(function(evt){
          oController.select(evt);
      });
        //------------------------------------------------*****---------------------------------------------\\
        if (!oChipApi.preview.isEnabled()) {
            var aFeedConfiguration = newstile.NewsTileUtils.getFeedConfiguration(oChipApi);
            var aInclusionFiltersConfiguration = newstile.NewsTileUtils.getInclusionFiltersConfiguration(oChipApi);
            var aExclusionFiltersConfiguration = newstile.NewsTileUtils.getExclusionFiltersConfiguration(oChipApi);

            var that = this;
            this.oFeeds = sap.suite.ui.commons.util.FeedAggregator.getFeeds(aFeedConfiguration, aInclusionFiltersConfiguration, aExclusionFiltersConfiguration, function() {
                 that._newsTile.setModel(that.oFeeds);
                 that.getViewData().newsModel = that.oFeeds;
                 if(!newstile.NewsTileUtils.getUseDefaultImageConfig(oChipApi)){
                     for( var i=0;i<that._newsTile.getModel().getData().items.length;i++){
                         that._newsTile.getModel().getData().items[i].image =  newstile.NewsTileUtils.getDefaultImage(that.oDefaultImages,i % that.oDefaultImages.length);
                     }
                     that._newsTile.getModel().updateBindings();
                 }

                that._newsTile.rerender();
        });
                var data = this.oFeeds.getData();
                 this._newsTile.setModel(this.oFeeds);
                 this.getViewData().newsModel = this.oFeeds;
                 if(Object.getOwnPropertyNames(data).length == 0){
                     this._newsTile.getModel().setData( oController.getPreviewData());
                     this._newsTile.getModel().updateBindings();
                   //  this._newsTile.rerender();
                 }
        }
        else{
            var previewModel = new sap.ui.model.json.JSONModel();
            previewModel.setData(oController.getPreviewData());
            this._newsTile.setModel(previewModel);
        }

        this._newsTile.addStyleClass("newsTileStyle");
        return this._newsTile;

    }
});