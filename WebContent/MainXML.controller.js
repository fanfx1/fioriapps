
sap.ui.controller("WebContent.MainXML", { 
    /**
     * Callback for hash changes, this is registered with the navigation framework
     */

    /**
    * Called when a controller is instantiated and its View controls (if available) are already created.
    * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
    * @memberOf MainXML
    */
	onInit: function() {

	    // obtain the navigator instance created in the controller
        this.oAppNavigator = this.getNav();
        
        //init navigation with the app, - it needs to know the app to navigate from pages to other pages, parses the initial hash
        this.oAppNavigator.init(this.byId("app"));

	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf MainXML
*/
	onExit: function() {
	    if (this.oAppNavigator) {
	    	//Destroy the navigation again
	        this.oAppNavigator.destroy();
	    }
	    //Temporary workaround
	    //PATCH UI5, there is no sap.m.SplitContainer.exit function ?
	    if (!sap.m.SplitContainer.exit)
	        sap.m.SplitContainer.exit = function() {};
		}
});