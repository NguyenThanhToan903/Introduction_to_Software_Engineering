//------------------------------------------------------------------------------
// Copyright (c) 2004, 2005 IBM Corporation.  All Rights Reserved.
//------------------------------------------------------------------------------
// This class handles the brower related tasks such as bookmarking and history.
// Author: Jinhua Xi
// Author: Bruce MacIsaac

define([
	"dojo"
], function(
dojo){
	
	return {
		
	initialized: false,
	lastBookmark: null,
	urlInfo : null,
	
	// save the current processing history url to acoid adding into history again
	currentHistoryBookmark : null,
	
	inBackFowardOperation : false,
	
	// need to check the location changes for back/forward button
	locationTimer : null,

		
init : function() {
	this.urlInfo = this.processUrlSegments(location.href);
	this.lastBookmark = this.urlInfo.bookmarkUrl;
	if ( !dojo.isIE ) {
		this.locationTimer = setInterval("theApp.browser._checkLocation();", 200);
	}

},
		
// call this method when url is changed
processUrlSegments : function(url) {
	
	var urlInfo = {
		url: url,
		baseUrl: url,
		bookmarkUrl: null,
		queryString: ""
	};

	// bookmark may contains /
	var i = url.indexOf("#");
	if ( i >=0 ) {
		urlInfo.bookmarkUrl = url.substring(i+1);		
		urlInfo.baseUrl = url.substring(0, i);			
	}

	// check if there is parameters, parameters will be in the url part, not the bookmark part
	// we need to append it to the end of the bookmark url
	// what about if the bookmark url contains bookmark itself???
	// handle later, TODO
	i = urlInfo.baseUrl.indexOf("?");
	if ( i > 0 ) {		
		urlInfo.queryString = urlInfo.baseUrl.substring(i);
		urlInfo.baseUrl = urlInfo.baseUrl.substring(0, i);
	}

	if ( urlInfo.queryString != null && urlInfo.bookmarkUrl != null ) {
		urlInfo.bookmarkUrl += urlInfo.queryString;
	}	

	i = urlInfo.baseUrl.lastIndexOf("/");
	if ( i > 0 ) {
		urlInfo.baseUrl = urlInfo.baseUrl.substring(0, i+1);
	}

	if ( urlInfo.bookmarkUrl != null ) {
		// the bookmark url should be relative to the base
		i = urlInfo.bookmarkUrl.indexOf(urlInfo.baseUrl);
		if ( i >=0 ) {
			urlInfo.bookmarkUrl = urlInfo.bookmarkUrl.substring(i+urlInfo.baseUrl.length);
		}
	}

	return urlInfo;
},
	
addToHistory : function(bookmarkValue) {

	//alert("histry.length before: " + window.history.length);
	// don't add cuplicate ones repeatedly
	if ( this.lastBookmark == bookmarkValue ) {
		return;
	}
	
	this.lastBookmark = bookmarkValue;
	
	// if in the back/forward operation, don't change the url any more
	if ( !this.inBackFowardOperation && 
		(dojo.isIE || theApp.settings.enableBookmark) ) {
		this._setHash();
	} 
	
	
	this.processUrlSegments(location.href);

	//	alert("histry.length after: " + window.history.length);
	//	alert("histry.length before: " + window.history.length);
		
	this.inBackFowardOperation = false;

},

_setHash : function() {

	this.inBackFowardOperation = true;
	
		//window.location.hash = "#" + this.lastBookmark;
	var newUrl = window.location.href;
	var i = newUrl.indexOf("#");
	if ( i > 0 ) {
		newUrl = newUrl.substring(0, i);
	}

	newUrl += "#" + this.lastBookmark;
		
	window.location.replace(newUrl);
	
},

_checkLocation : function() {

	if ( dojo.isIE || this.inBackFowardOperation ) {
		return;
	}
	
	var bookmark = theApp.getBookmarkUrl(window.location.href);

	if ( bookmark != this.lastBookmark ) {
		//alert(bookmark + "\n" + this.lastBookmark );
		this.inBackFowardOperation = true;
		theApp.setContentUrl(bookmark, true);
	}
},



back : function() {
	window.history.back();
},

forward : function() {
	window.history.forward();
}


}
});
	