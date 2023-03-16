//------------------------------------------------------------------------------
// Copyright (c) 2004, 2016 IBM Corporation.  All Rights Reserved.
//------------------------------------------------------------------------------
// Displays a banner at the top of a website.
//
define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!rmcwidget/templates/BannerWidget.html"
], function(declare, _WidgetBase, _TemplatedMixin, template) {

    declare("BannerWidget",[_WidgetBase, _TemplatedMixin], {
        templateString: template,		
		imgUrlBase: "images/",
		
		// If true, download the image every time, rather than using cached version in browser
		preventCache: false,
		img1: null,

       postCreate: function(){    
			this.inherited(arguments);
			this.img1.src = this.imgUrlBase + theApp.settings.bannerFileName;
			this._getUrlSuffix();			
			this.img1.style.height = theApp.settings.bannerHeight;
		},
		
		_getUrlSuffix: function() {
			if (this.preventCache) {
				return "?ts=" + (new Date()).getTime();
			} else {
				return "";
			}
		}
		
	}
);
}
);