//------------------------------------------------------------------------------
// Copyright (c) 2004, 2017 IBM Corporation.  All Rights Reserved.
//------------------------------------------------------------------------------
// 
//


define([
    "dojo/_base/declare",
    "dijit/Tree",
	"dojo/hash",
    "dojo/domReady!"	
	
], function(declare, Tree,hash) {

    declare("DojoTreePane",[Tree], {
	
		currentNode: null,
	
		onOpenClick: true,
		
		getIconClass: function(item, opened) {  //this over-rides the default getIconClass provided by the tree
			var iconclass = "TreeIcon" + item.nodeDocType;
			return iconclass;
		},

		
        onLoad: function(){
		
        },
		
       onClick: function(item){
			var url =item.url;
			this.currentNode = item;
			var el=document.getElementById('contentContainer');
			el.src=url;
			location.hash = "#"+ url; // Used to call "hash(url)" but that stopped working from 1.10.4 to 1.10.5  

		},
		

		
	// tree navigation APIs
	selectFirstNode: function() {
		var self = this;
			
		// select the first view
		var viewNode = self.getChildren()[0];
					
		// select the first node
		var node = viewNode.getChildren()[0];
		//alert("selecting node: " + node);
				
		// save the current node for synchronization
		self.currentNode = node;
		
		self.focusNode(node);
        self.onClick(node.item); 
	},
		
		

	_constructBreadcrumb: function(node, parent) {
			if(node.url == null){
                node.url = node.children[0].url;
				}
			return {id: node.objectId, url: node.url, title: node.title, nodeDocType: node.nodeDocType, children: node.children, parent: parent};
	},
		
	_internalGetBreadcrumbs: function(nodeInfoList) {
	
			var bcs = [];
		
			if (nodeInfoList.length == 0) {
				return bcs;
			}
			
			var count = 0;
			for (var i = 0; i< nodeInfoList.length; i++) {
				if (this._isTreeNode(nodeInfoList[i].theNode) && nodeInfoList[i].theNode.url != null) {
					bcs[count++] = this._constructBreadcrumb(nodeInfoList[i].theNode,nodeInfoList[i].theParent);
				}
			}
			return bcs;
	
		},	
		
	_isTreeNode: function(node) {
			return (node != null);
		},

	_saveNode: function(node) {
		// save the current node for synchronization
		this.currentNode = node;
	},
		
	
	_findChildNode: function(parentNode, id) {
			//alert("id, nodes: " + id + ", " + parentNode.children);
			var children = parentNode.children;
			for (var i in children) {
				var childNode = children[i];
				//alert("child: " + childNode.widgetId);
				
				if (childNode.objectId == id) {
					return childNode;
				}
			}
			
			return null;
		},

				
		
		// get an array of breadcrumb {url:url, title:title}, 
		// call the callback function with the breadcrumbs
		getBreadcrumbs: function(url, callback) {
			var self = this;
			var fun = function(url) {
				//alert("getBreadcrumbs: " + url);
				var bookmark = theApp.getBookmarkUrl(url);
				if (bookmark == null || bookmark == "") {
					bookmark = theApp.getRelativeUrl(url);
				}
				
				self._disableContentLoading();
				
				var node = self._getSelectedNode();
				if (node == null || !self._sameUrl(bookmark, node.url)) {
					// find the page
					//alert("find node for: " + bookmark);
					node = self._findNode(bookmark);
				}
				
				var bcs = [];
				
				if (node != null) {
					bcs = self._internalGetBreadcrumbs(node);
				}
				
				self._enableContentLoading();
				
				return bcs;
			};
			
			if (this.isTreeLoaded()) {
				var ret = fun(url);
				callback(ret);
			} else {
				this.deferredCalls.push([fun, url, callback]);
				this.loadTree();
			}
		},


	_findNodeByPathBC: function(/*Array*/path, /*int*/startIndex) {
			// reset the node
			this._saveNode(null);						
							
			var found = true;
			var matchedNodes = [];
				
			var tree = this.rootNode.item;
			var node = tree;
			var parent = null;

		//The first path element should match the tree node
			if 	(node.objectId == path[startIndex]) {
				matchedNodes.push({theNode:node, theParent:parent});

				for (var p = startIndex+1; p < path.length; p++) {
					parent = node;
					node = this._findChildNode(node, path[p]);
					if (node == null) {
						found = false;
						//alert("not found: " + path[p]);
						break; // not in this tree, try the next if any
					};
				// save the node matched
				matchedNodes.push({theNode:node, theParent:parent});
				};
			};				
			if (matchedNodes.length == 0) {
				return null;
			}
			
			var bcs = this._internalGetBreadcrumbs(matchedNodes);
			var nodeInfo = matchedNodes.pop();
			this._saveNode(nodeInfo.theNode);
			return bcs;
		},
		
		
		getBreadcrumbsByPath: function(/*Array*/path, callback) {
			// note the first item in the path is the view's guid
			// if showTreeRootNode is false, we need to skip that one
			var startIndex = 0;
			
				
				var bcs = this._findNodeByPathBC(path, startIndex);
				callback(bcs);
		},
		
	
		getSelectedNodePath: function() {
			
			var path = [];
						
			for (var i in this.tree.path) {
				path.push(this.tree.path[i].objectId);
			}
				
			return path;
		},
	
		getFirstLevelItems: function() {			
			return this.rootNode.item.children;
		}
	
		
})});
		


