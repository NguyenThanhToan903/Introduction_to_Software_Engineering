//------------------------------------------------------------------------------
// Copyright (c) 2004, 2016 IBM Corporation.  All Rights Reserved.
//------------------------------------------------------------------------------
// This class is responsible for the application tree navigation. 
// It creates and maintains a lazyloading DojoTreePane widget and handles 
// the tree node selection, breadcrumbs, etc.
//
// Author: Jinhua Xi
// Author: Kelvin Low
// Author: Bruce MacIsaac

define([
	"theme/treeNodeViews", "rmcwidget/DojoTreePane",
	"dojo/json","dojo/store/Memory",
	"dijit/tree/TreeStoreModel",
	"rmcwidget/AccordionContainerEx",
	"dijit/layout/AccordionPane",
	"dojo/data/ObjectStore",
	"dojo/ready",
	"dojo/_base/lang"
	
], function(
treeNodeViews, RMCDojoTreePane, json,Memory, TreeStoreModel,
AccordionContainerEx, AccordionPane,ObjectStore,ready,lang){
 	
	
	// tree node path for processes
	// this allows descriptors to find their tree node 
	treeNodePaths = [];

	// UI
	
	navigationContainerWidget = null;

	
	// true if the pane is selected by user's keyboard or mouse click
	isUserSelect = true;
	lastAccordionPane = null;
	
	// flag to indicate that load content is allowed.
	// find node will trigger select node event, 
	// that will then trigger a load content operation. this operation should be avoided
	// don't load content when this flag is true
	allowLoadContent = true;
	previousAllowLoadContent = true;
	
	return {
	
	defaultViewId: null,
	
	_getSelectedPane : function() {

		if ( navigationContainerWidget == null ) {	
			return null;
		}
		var children = navigationContainerWidget.getChildren();
		for ( var i in children ) {
		  if (children[i].selected) {
			return children[i];
		  }
		}
	
		return null;
	},

	
	getPane : function(objectId) {

		if ( navigationContainerWidget == null ) {	
			return null;
		}
		var children = navigationContainerWidget.getChildren();
		for ( var i in children ) {
		  if (children[i].id == objectId) {
			return children[i];
		  }
		}
	
		return null;
	},
	
	getViews : function() {

		var container = navigationContainerWidget;

		if ( container == null ) {	
			return null;
		}
	
		return container.getChildren();

	},
	
	
	
	createView: function(viewData) {
		
		var url = "dojo/text!" + viewData.src;
		require( [ 'dojo/json', url ], 
		function( JSON, data ) {

		var jsonString = JSON.stringify(eval("(" + data + ")"));	
		
		var objectStore=new Memory({data: json.parse(jsonString) });
		var dataStore = new dojo.data.ObjectStore({objectStore:objectStore});
		
		var treeModel = new TreeStoreModel({store: dataStore,
			getLabel:function(item){
					return item.title
				}
			});
		
		
		//Create the accordion pane
	
	
		var accordionPane = new AccordionPane({ title: viewData.label, id: viewData.id });


		// Create the Tree.
		var tree = new DojoTreePane({
			model: treeModel, showRoot: false
			});

		accordionPane.addChild(tree);
		navigationContainerWidget.addChild(accordionPane);


		});
	
	},

	createViews: function() {
	
	navigationContainerWidget = new AccordionContainerEx({ region: 'left', splitter: true },"navigationContainer");

	for ( var i in treeNodeViews.treeViews ) {
		this.createView(treeNodeViews.treeViews[i]);
	}

	
	for ( var i in treeNodeViews.treeViews ) {
		var view = treeNodeViews.treeViews[i];
		
		if (this.defaultViewId == null || view.isDefault ) {
			this.defaultViewId = view.id;
		}


	//navigationContainerWidget.connect(this, 'onShow', this.selectDefaultPage);
	ready (lang.hitch(this,this.selectDefaultPage));
	
	/* Starting the container widget starts all the child widgets as well */
	
	navigationContainerWidget.startup();

	/*
	if ( treeViews == null 
		|| navigationContainer == null ) {
		return;
	}
	*/
//	if (theApp.settings.enableProfiling) {
//		dojo.profile.start("AppNavigation.createViews");
//	}
	
			
	
	//	var w = dojo.widget.createWidget("rmc:DojoTreePane", {id: //view.id, objectId: view.objectId, src: view.src, label: //view.label});
		
	//	this.navigationContainer.addChild(w);
	
	
	}	



	// hook up the navigation events
//	this._handleNavigation();
	
//	if (theApp.settings.enableProfiling) {
//		dojo.profile.end("AppNavigation.createViews");
//	}
},


selectDefaultPage: function() {

	// initialize the selection
	// select the first
//	var treeContainer = null;
//	if (this.defaultViewId == null ) {
//		var children = navigationContainerWidget.getChildren();
//		if ( children.length > 0 ) {
//			treeContainer = children[0];
//			navigationContainerWidget.selectChild(treeContainer);
//		}
//	} else {
	
		navigationContainerWidget.selectChild(this.defaultViewId);
		var defaultPane = this.getPane(this.defaultViewId);
		var treeContainer = defaultPane._singleChild;
//	}
	
	if ( treeContainer != null ) {
		treeContainer.selectFirstNode();
	}
	
},

selectPage: function(bookmarkUrl) {
	
	// always show the page
	theApp.setContentUrl(bookmarkUrl);	
	
},

/* return an array of breadcrumb {url:url, title:title} as parameter of the callback function*/
getBreadcrumbs : function(url, callback) {
//alert("before, url=" + url);


	var bookmark = theApp.getBookmarkUrl(url);
	if ( bookmark == null || bookmark == "" ) {
		bookmark = theApp.getRelativeUrl(url);
	}
	
	// if the node is already selected
	var pane = this._getSelectedPane();
	if ( pane != null && pane.isCurrentSelection(bookmark) ) {
		//alert("is current: " + bookmark);
		pane.getBreadcrumbs(bookmark, callback);
	} else {	
		// check if the path is defined.
		// if more than one path, use the first one
		var paths = this.getBreadcrumbPaths(bookmark);
		if ( paths != null && paths.length > 0 ) {
			var path = paths[0];
			pane = this.selectPane(path.view);
			if ( pane != null ) {
				pane.getBreadcrumbsByPath(path.path, callback);
			}
		}
	}
	

},

/* compare path up to the specified length*/
_isSamePath : function(path1, path2, length) {
	if ( path1 == null || path2 == null ) {
		return false;
	}
	
	if ( path1.length < length || path2.length < length) {
		return false;
	}
	
	for (var i = 0; i < length; i++ ) {
		if ( path1[i] != path2[i] ) {
			return false;
		}
	}
	
	return true;
},

getNavbar: function(callback) {
	var selPane = this._getSelectedPane();
	if (selPane != null )  {
		callback(selPane._singleChild);
	}
},



syncTreeNode : function() {
	if (theApp.settings.autoSyncContentWithView == false) {
		this.isUserSelect = false;
		this.navigationContainerWidget.selectChild(this.lastAccordionPane);
		this.isUserSelect = true;
	}
	var selPane = this._getSelectedPane();
	if (selPane != null )  {
		selPane.syncTreeNode();
	} else {
		// TODO: with with getBreadcrumbsByPath to find the node and sync to the node
		// this is usually the case when the page is validated from an index page
		
	}
},


/* return an array of breadcrumb {url:url, title:title} as parameter of the callback function
	paths is an array of nodeInfo {view:viewId, path:[]} object
	appendPath is an array of additional path that should be added to the end of each nodeInfo.path.
*/
getBreadcrumbsByPath : function(paths, appendPath, callback) {

	if ( paths == null || paths.length == 0 ) {
		return;
	}

	var pane, path;
	var pathInfo;
	var selPane = this._getSelectedPane()._singleChild;
	var selPath = null;
	var goodIndex = 0;
	
		
		// TODO: if you want to show the breadcrumbs 
		// or use the sync node icon to sync to the node in the view,
		// save the parameters and then process it in the syncTreeNode call
		// for now, we just ignore this case
		

	if ( selPane != null ) {
	
		selPath = selPane.getSelectedNodePath();
		//alert("selcted node: " + selPath);
		
		if (selPath != null) {
			for ( var i = 0; i < paths.length; i++ ) {
				pathInfo = paths[i];
				var viewString = "view:"+selPane.rootNode.item.objectId;
				if ( pathInfo.view != viewString ) {
					continue;
				}
						
				goodIndex = i;
				if ( !this._isSamePath(selPath, pathInfo.path, pathInfo.path.length) ) {
					continue;
				}
				
				//alert("path found");
				// it's the same path, save it and compare with appendPath later
				path = pathInfo.path;
				if ( appendPath != null ) {
					path = path.concat(appendPath);
				}
				/*
				if (theApp.settings.autoSyncContentWithView == false) {
					var ap = selPane;
					if (  this._isAccordionContainer(this.navigationContainer) && 
						 !this._isAccordionPane(ap) ) {
						ap = selPane.parent;
					}
					this.lastAccordionPane = ap;
				}
				*/
				selPane.getBreadcrumbsByPath(path, callback);
				
				return;
				
			}
		}
		
	}

	pathInfo = paths[goodIndex];
	
	/*
	if (theApp.settings.autoSyncContentWithView == false) {
		pane = this.loadPane(pathInfo.view);

		if ( pane != null ) {
			var ap = pane;
			if (  this._isAccordionContainer(this.navigationContainer) && 
				 !this._isAccordionPane(ap) ) {
				ap = pane.parent;
			}
			this.lastAccordionPane = ap;
		}
	} else {
		pane = this.selectPane(pathInfo.view);
	}
	*/
	pane = selPane;
	path = pathInfo.path;
	if ( pane == null ) {
		return;
	}
		if ( appendPath != null && appendPath.length > 0 ) {
		path = path.concat(appendPath);
	}

	pane.getBreadcrumbsByPath(path, callback);
	
}











}
});
	



