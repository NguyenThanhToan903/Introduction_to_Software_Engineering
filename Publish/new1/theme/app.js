//------------------------------------------------------------------------------
// Copyright (c) 2004, 20016 IBM Corporation.  All Rights Reserved.
//------------------------------------------------------------------------------
// This is the main application singleton instance for the dojo navigation frame work.
// Author: Bruce MacIsaac

define([
	"dojo/_base/lang",
	"rmcwidget/BannerWidget","rmcwidget/IFrameContentPane",
	"theme/appSettings2",
	"theme/AppResource",
	"theme/AppNavigation",
	"theme/AppBrowser","dojo/domReady!"
], function(lang,BannerWidget,IFrameContentPane,
appSettings,AppResource,AppNavigation,AppBrowser){

	return {
	
	initialized: false,
				
	contentContainer : null,
	
	feedbackURL : null,
	bannerFileName : null,
		
	settings : null,

	res : null,

	
	browser: null,

	nav : null,

	init : function() {		
		//alert("initializing dojo ...");
				
		this.contentContainer = window.IFrameContentPane;
		this.browser = AppBrowser;
		this.nav = AppNavigation;
		this.settings = appSettings;
		this.res = AppResource;
		
		window.theApp = this;	
		AppBrowser.init();		
		
		// create the tree views
						
		AppNavigation.createViews();
								
		this.initialized = true;
		//alert("dojo app initialized");

		var isTouchSupported = 'ontouchstart' in window;

//		if(isTouchSupported){				
//			this.splitContainer.hidePane(this.nav.navigationContainer);
//		    }	
				
	},   



	isInitialized: function() {
		return this.initialized;
	},
	
	// onload of the content pane
	onContentLoaded:  function(url) {
		if ( this.contentContainer != null ) {
		
			url = this.getRelativeUrl(url);
			
			//alert("onload page: " + this.contentContainer.getUrl());
			//alert("onload page: " + url);
			// set the history
			//var url = this.contentContainer.getUrl();
			if ( url != null ) {
				AppBrowser.addToHistory(url);	
				
				this.contentContainer.prototype.saveUrl(url);	
						
			}
		}
	},	

	setContentUrl: function(url, replace) {
		//alert("setContentUrl: " + url);
	
		var i = url.indexOf(AppBrowser.urlInfo.baseUrl);
		if ( i >=0 ) {
			url = url.substring(i+AppBrowser.urlInfo.baseUrl.length);
		}
			
		// set the history before the page is loaded
		// this will allow the onLoad method to get the correct url bookmark
		// do it in the onload event for iframe content pane since this method will not be called
		// since iframe maintains it's own url location so the delayed bookmark is ok
		//AppBrowser.addToHistory(url);	
		this.contentContainer.setUrl(url, replace);
		
								

	},
	
	getBaseUrl: function() {
		return AppBrowser.urlInfo.baseUrl;
	},
	

	getContentUrl: function() {

		var base = this.getBaseUrl();
		var url = this.contentContainer.getUrl();
		if (url.indexOf("javascript") < 0 && url.indexOf(base) < 0 ) {;
			url = base + url;
		} 
		return url;
	},
		
	
	getBookmarkUrl : function(url) { 
		if ( url == null || url == "" || !lang.exists(url) ) {
			return AppBrowser.lastBookmark;
		}
		
		var info = AppBrowser.processUrlSegments(url);
		if ( info != null ) {
			return info.bookmarkUrl;
		}
		
		return null;
	},

	getRelativeUrl: function(url) {
		
		// remove bookmark
		var i = url.indexOf("#");
		if ( i >=0 ) {
			url = url.substring(0, i);
		}
		
		// remove base
		i = url.indexOf(AppBrowser.urlInfo.baseUrl);
		if ( i >=0 ) {
			url = url.substring(i+AppBrowser.urlInfo.baseUrl.length);
		}
		
		return url;
	},
	
	
	
	resolveContentUrl: function(url) {
		
		if ( url.indexOf("./") == 0 ) {
		
			var base = this.getContentUrl();
			//alert("base:" + base);
			var i = base.lastIndexOf("/");
			url = base.substring(0, i) + url.substring(1);
		}
		
		return url;
		
	},

	setContentUrl: function(url, replace) {
		//alert("setContentUrl: " + url);
	
		var i = url.indexOf(AppBrowser.urlInfo.baseUrl);
		if ( i >=0 ) {
			url = url.substring(i+AppBrowser.urlInfo.baseUrl.length);
		}
			
		// set the history before the page is loaded
		// this will allow the onLoad method to get the correct url bookmark
		// do it in the onload event for iframe content pane since this method will not be called
		// since iframe maintains it's own url location so the delayed bookmark is ok
		//AppBrowser.addToHistory(url);	
		this.contentContainer.prototype.setUrl(url, replace);
		
								
	},


	getBookmarkUrl : function(url) { 
		if ( url == null || url == "" 
		//|| dojo.lang.isUndefined(url) 
		) {
			return AppBrowser.lastBookmark;
		}
		
		var info = AppBrowser.processUrlSegments(url);
		if ( info != null ) {
			return info.bookmarkUrl;
		}
		
		return null;
	},
	
	getBaseUrl : function() {
		return AppBrowser.urlInfo.baseUrl;
	}
	

	
}
}	
);
