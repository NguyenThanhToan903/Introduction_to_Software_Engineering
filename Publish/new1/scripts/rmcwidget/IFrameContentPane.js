//------------------------------------------------------------------------------
// Copyright (c) 2004, 2016 IBM Corporation.  All Rights Reserved.
//------------------------------------------------------------------------------
// A content pane that uses an embedded iframe to display the HTML content.
//
// Author: Bruce MacIsaac
// Author: Jinhua Xi
define([
	"dojo",
    "dojo/_base/declare",
	"dojox/layout/ContentPane" 

], function(dojo, declare, ContentPane) {

    declare("IFrameContentPane",[ContentPane], {	

		// parameters
		title: "IFrameContentPane",		
		src: "",  // src url to show in the pane
		
		frame: null,
		//location: null,
		
		currentUrl: null,
		
		postCreate: function() {
			this.inherited(arguments);
		
			//alert("post create content frame");
			this.frame = dojo.byId("contentContainer");
			if ( this.frame == null ) {
				//alert("error: no frame");
				return;
			}
					
						
			//alert("name: " + this.frame.name);
			//alert("id: " + this.widgetId);
			
			// note: can't use this.frame.location, it does not work
			//alert(this.frame.name);
			//this.location = frames[this.frame.name].location;
			//alert("location: " + this.location);
			
			//alert("created: " + this.frame);			

			if (this.frame.addEventListener) {
				// for mozilla
				this.frame.addEventListener("load", this.onLoad, false);
				//this.frame.addEventListener("click", this.onClick, false);
			}
			else if (this.frame.attachEvent){
				// for IE
				this.frame.detachEvent("onload", this.onLoad); 
				this.frame.attachEvent("onload", this.onLoad);
			
				//this.frame.attachEvent("onclick", this.onClick);
			}
			
			
			// catch the onclick event and navigate the url with replace to avoid history change
			//dojo.event.connect(this.frame, "onclick", function(evt){
			//var win = frames[this.frame.name];
			
				
			if ( this.src != null && this.src != "" ) {
				this.setUrl(this.src);
			}
			
			if ( this.resizeIframe ) {
				this.resizeIframe();
			}
		},
			
		destroy: function(){
			this.inherited(arguments);
		},
		
		onLoad: function(e){
			//alert("IFrameContentPane: loaded: ");
		
			//alert("loaded: " + this.location.href);
			//rmc.widget.IFrameContentPane.superclass.onLoad.apply(this, arguments);
			//alert("home: " + location.href); 
			//alert("hash: " + location.hash); 
			//this.onResized();
			if ( this.resizeIframe ) {
				this.resizeIframe();
			}
		},
		
		
		resizeSoon: function(){
			// summary
			//	schedule onResized() to be called soon, after browser has had
			//	a little more time to calculate the sizes
		//	if(this.isShowing()){
		//		dojo.lang.setTimeout(this, this.onResized, 0);
		//	}
			
			//alert("resize soon");
		},
		
		onResized: function(){
			this.inherited(arguments);
					
		//	var wh = dojo.html.getMarginBox(this.domNode);
			
			//alert("onResized size: " + wh.width + ", " + wh.height);
			//this.frame.width= wh.width;
			//this.frame.height= wh.height;
			//this.resizeIframe();
		},
		
		beginSizing: function() {
			this.frame.style.display = "none";
		},
		
		endSizing: function() {
			this.frame.style.display = "block";
		},
		
		_sameUrl: function(url1, url2) {
			if (url1 == url2) {
				return true;
			}
			return this._trimUrl(url1) == this._trimUrl(url2);
		},

		_trimUrl: function(url) {
			if (url == null) {
				return "";
			}

			var i;
			i = url.indexOf("#");
			if (i >= 0) {
				url = url.substring(0, i);
			}

			return url;
		},
		
		saveUrl: function(url) {
			if ( !this._sameUrl(this.currentUrl,url) ) {
				this.currentUrl = url;
			}
		},
		
		_isExternalUrl: function (url) {
			return  url.indexOf("http") == 0 || url.indexOf("file:") == 0; 
		},
		
		setUrl:  function(url, replace) {
			//this.frame.src = url;
						
			// if the url is a local file which does not exist
			// the location object will be invalid
			// so save the url in a seperate variable
			if ( !this._sameUrl(this.currentUrl,url) ) {
				//alert("url set: new url: " + url + "\nold url: " + this.currentUrl);
				this.currentUrl = url;
				
				// this will cause a new history
				// we don't want the iframe load to generate new history
				// since this will mess up the history management system
				// so use location.replace instead
				// works for IE though
				var win = frames[0];
				if ( win != null ) {
				
					// this strategy is not perfact since the url navigation within the frame 
					// will cause a new history any way, so fir firefox there will be two history entry for each page
					// we should avoid adding new history in the history handling system
					// so always create history when the url is set
					
					if ( !this._isExternalUrl(url) ) {
						url = theApp.getBaseUrl() + url;
					}
					
					if( replace == true) {
						win.location.replace(url);
					} else {
						win.location.href = url;
					}
				}
			}
		},
		
		getUrl: function() {
		
			return this.currentUrl;
		
			/*
			// this will cause access error if the location object is invalid 
			//alert("getUrl: " + this.location);
			if ( location ) {
				return theApp.getRelativeUrl(location.href);
			} else {
				return "";
			}
			*/
			
			
		}
		/*
		
		resizeIframe: function() {
			if ( this.getUrl() == null ) {
				return;
			}
			
			if (this.frame.contentDocument && this.frame.contentDocument.body.offsetHeight) { 
				this.frame.height = this.frame.contentDocument.body.offsetHeight+FFextraHeight;
			}
			else if (this.frame.Document && this.frame.Document.body.scrollHeight) { 
				this.frame.height = this.frame.Document.body.scrollHeight;
			}
			
			
			/*
			//alert("resizing ...  ");
			var getFFVersion=navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox")).split("/")[1];
			var FFextraHeight=0; //parseFloat(getFFVersion)>=0.1? 16 : 0; //extra height in px to add to iframe in FireFox 1.0+ browsers
		
			if (!window.opera){
			}
			*/
			
		/*	
		},
		
	
		_END_: true
		*/
	}
)
}	
);