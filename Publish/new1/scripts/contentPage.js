//------------------------------------------------------------------------------
// Copyright (c) 2005, 2017 IBM Corporation and others.
// All rights reserved. This program and the accompanying materials
// are made available under the terms of the Eclipse Public License v1.0
// which accompanies this distribution, and is available at
// http://www.eclipse.org/legal/epl-v10.html
// 
// Contributors:
// IBM Corporation - initial implementation
//------------------------------------------------------------------------------


var contentPage = {

	backPath: null,
	imgPath: null,
	defaultQueryStr: null,
	queryStr: null,
	isProcessPage: false,
	nodeInfo: null,
	
	// define resource file
	res : new ContentPageResource(),
	
	// define activity layout, need to create this as a place holder 
	// so that the dynamically generated data can be loaded
	processPage: ( typeof ProcessElementPage == "undefined" ) ? null : new ProcessElementPage(),
	
	// define section
	section: new ContentPageSection(),
	
	// define sub-section
	subSection: null,
		
	// auto wrap elements
	autoWrapElements: [],
	
	// call this method before the page is loaded
	// this is used to initialize some parameters before the page content is processed
	// for example, if the content needs to use some parameters inside the content
	// this approach is not recommented but keep here for backward compatibility
	preload: function(imgPath, backPath, nodeInfo, defaultQueryStr, hasSubSection, isProcessPage, hasTree) {

		this.isProcessPage = isProcessPage || hasTree;
		this.imgPath = imgPath;
		this.backPath = backPath;
		this.nodeInfo = nodeInfo;
		this.defaultQueryStr = defaultQueryStr;
		this.queryStr = location.search;
		
		// convert the image path to absolute path
		// otherwise the page will resolve to wrong absolute path if the browser cashed the pages
		var base = window.location.href;
		var i = base.lastIndexOf("/");
		this.imgPath = base.substring(0, i+1) + this.imgPath;
		//alert(this.imgPath);


		if ( this.queryStr == null || this.queryStr == "" )
		{
			this.queryStr = this.defaultQueryStr;
		}
				
		this.section.init(this.imgPath);
				
		if ( hasSubSection ) {
			this.subSection = new ContentPageSubSection();
		}
		
		if ( this.processPage && (isProcessPage || hasTree) ) {
			this.processPage.init(hasTree);
		}
				
	},
	
	
	// call this method when page is loaded
	onload: function() {
		this.section.createSectionLinks('div', 'sectionHeading', this.imgPath);
		if ( this.subSection != null ) {
			this.subSection.createStepLinks('div', 'stepHeading');
		}
			
		var self = this;
		var app = this.getApp();
				
		// register auto wrap element
		if ( this.autoWrapElements.length > 0 ) {
			window.onresize = function(e) {
				contentPage.resizeBlockText();
			}		
			this.resizeBlockText();
		}
		
		//alert("content on load: " + location.href);
		
		if ( this.processPage ) {
			this.processPage.onload();
		} 
		
		if ( app != null ) {		
			app.onContentLoaded(location.href);
			this.buildBreadcrumns();
		}
		
		if('ontouchstart' in window){
			this.resizePage();//resize page
		}
		//alert("content page loaded");
		
		// user can add customization code here
		// this method will be called when the page is loaded
		// this is equivalent to inserting javascript immediately before the </html> tag
		
	},
	
	buildBreadcrumns : function() {
		this._buildBreadcrumns(location.href);
	},
	
	resizeBlockText: function() {
		var newWidth = window.document.body.offsetWidth - 20;
		for ( var i = 0; i < this.autoWrapElements.length; i++ ) {
			var elem = this.autoWrapElements[i];
			elem.style.width=newWidth + "px"; // firefox does not work without specifying the unit
		}
	},
		
	resizePage : function(){
		//resize the table or div or ... not img tag,only care width
		this.resizeNotImage();
		//resize img,care width&height
		this.resizeImage();
	},
	resizeNotImage :function(){
		var ratio = window.devicePixelRatio;
		if(!ratio){
			ratio = 1;
		}
		maxWidth = window.screen.width/ratio;
		var arrays = document.getElementsByClassName("pageTitle");
		for(i=0;i<arrays.length;i++){
			var ewidth = arrays[i].offsetWidth;
			if(ewidth > maxWidth ){
				arrays[i].setAttribute("width","100%");
				arrays[i].removeAttribute("nowrap");
			}
		}
		
	},
	resizeImage: function(){
		var pic=document.getElementsByTagName('img');
		
		for(i=0;i<pic.length;i++)
		{
			if(pic[i].complete){
				contentPage.autoResizeImage(null,pic[i]);
			}else{
				pic[i].onload = contentPage.autoResizeImage;
			}
		}
	},
	
	autoResizeImage: function (event,objImg) {
		if(event){
			objImg = event.currentTarget;
		}
		var ratio = window.devicePixelRatio;
		if(!ratio){
			ratio = 1;
		}
		maxWidth = window.screen.width/ratio;
		maxHeight = window.screen.height/ratio;
	    var img = new Image();
        img.src = objImg.src;
        var hRatio;
        var wRatio;
        var Ratio = 1;
        var w = objImg.width;
        var h = objImg.height;
        wRatio = maxWidth / w;
        hRatio = maxHeight / h;
        if (maxWidth == 0 && maxHeight == 0) {
            Ratio = 1;
        } else if (maxWidth == 0) { //
            if (hRatio < 1) Ratio = hRatio;
        } else if (maxHeight == 0) {
            if (wRatio < 1) Ratio = wRatio;
        }else if (wRatio < 1 || hRatio < 1){
			Ratio = (wRatio<=hRatio?wRatio:hRatio);
		}
		if (Ratio < 1){
			w = w * Ratio;
			h = h * Ratio;
		}
		if(objImg.getAttribute("usemap")){
			contentPage.autoResizeImageArea(objImg,Ratio);
		}
		objImg.width = w;
		objImg.height = h;
    },
	
	autoResizeImageArea: function(img,ratio){
		if(img.parentNode.getElementsByTagName("map").length>0){
			var map = img.parentNode.getElementsByTagName("map")[0];
			var areas = map.getElementsByTagName("area");
			var coords = "";
			usermap = img.getAttribute("usemap");
			usermap = usermap.substring(1,usermap.length);//rep
			if(areas && usermap.toLowerCase() == map.getAttribute("name").toLowerCase()){
				for(var i=0;i<areas.length;i++){
					area = areas[i];
					coords = area.getAttribute("coords");
					if(coords){
						coordsArray = coords.split(',');
						if(coordsArray){
							for(var j=0;j<coordsArray.length;j++){
								coordsArray[j] = parseInt(coordsArray[j]) * ratio;
								coordsArray[j].toFixed(2);
							}
						}
						area.setAttribute("coords",coordsArray.join(","));
					}
				}
			}
		}
	},
	
	addAutoWrapElement: function(elem) {
		this.autoWrapElements.push(elem);
	},
	
	// utility methods
	getUrlParameters: function(queryStr)
	{
		var arr = new Array();	
		var pairs = queryStr.split("&");
	   	for (var i = 0; i < pairs.length; i++) {
	     		var pos = pairs[i].indexOf('=');
	     		if (pos == -1) continue;
	     		var argname = pairs[i].substring(0,pos);
	     		var value = pairs[i].substring(pos+1);    	
	     		arr[argname] = value;
		}
		
		return arr;
	},

	getApp : function() {
		if( typeof theApp != "undefined") {
			return theApp;
		} else if ( window.parent && typeof window.parent.theApp != "undefined") {
			return window.parent.theApp;
		}
	
		return null;
	},
	
	getViewFrame: function() {
	
		var app = this.getApp();
		if ( app != null ) {
			return app.nav;
		} else {
			return null;
		};

	},

	_buildBreadcrumns: function(url) {
		var viewFrame = this.getViewFrame();
		if ( viewFrame == null ) {
			return;
		};

		var div = document.getElementById("breadcrumbs");
		if (div != null && viewFrame != null && viewFrame.getBreadcrumbs ) {
			if ( this.getApp() == null ) {
				// don't break old code
				var bcs = viewFrame.getBreadcrumbs(url);
				if ( bcs != null && bcs.length > 0 ) {
					this.showBreadcrumns(div, bcs);
				}
			} else {
				var self = this;
					
				if (contentPage.nodeInfo != null && contentPage.nodeInfo.length > 0 ) {
					var callback = function(bcs) {
					self.showBreadcrumns(div, bcs);
					};
					viewFrame.getBreadcrumbsByPath(contentPage.nodeInfo, null, callback);
				} else {
					var callback = function(tree) {
						self.showNavbar(div,tree);
					};
					viewFrame.getNavbar(callback);
				}
				
			}
			
		}
	
	},

	loadViewFirstPage: function(viewId){
		parent.theApp.nav.defaultViewId = viewId;
		parent.theApp.nav.selectDefaultPage();
		parent.theApp.nav.defaultViewId = null;
	},

	
	showNavbar: function(div,treePane) {	
		var menuItems = treePane.getFirstLevelItems();
		var bcs = [];
		this.showNavbarAndCrumbs (div,bcs,menuItems,null);
	},	
		

	showBreadcrumns: function(div, /*array*/ bcs) {
	
		if (bcs != null && bcs.length > 0) {
			var menuItems = bcs[0].children;
			var activeURL = bcs[0].url;
			this.showNavbarAndCrumbs (div,bcs,menuItems,activeURL);
		}
	}, 	
	
	
	showNavbarAndCrumbs: function(div, /*array*/ bcs, menuItems, activeURL) {
		
	    var baseUrl = this.getApp().getBaseUrl();
		var app = this.getApp();
		var html;
		
		// Check for the showNavigationBar property in appSkinSettings.json file
		// displays the navigation bar if showNavigationBar == true
		if(app.settings.showNavigationBar==false) {
		  html = ["<nav id='navbar1' class='navbar navbar-default navbar-static-top' style='display:none'>"];
		} else {
		  html = ["<nav id='navbar1' class='navbar navbar-default navbar-static-top' style='display:block'>"];
		}
		
		html = html.concat(["<div class='container-fluid'>",
	        "  <div class='navbar-header'>",
	        "  <button type='button' class='pull-left navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>",
	        "    <span class='sr-only'>Toggle navigation</span>",
	        "    <span class='icon-bar'></span>",
	        "    <span class='icon-bar'></span>",
	        "    <span class='icon-bar'></span>",
	        "  </button>",
	        " </div>",
	        " <div id='navbar' class='navbar-collapse collapse'>"
	    ]);	

	    //create navbar
		html = html.concat([
			        "  <ul class='nav navbar-nav'>"]);

					html = html.concat([
					//"    <ul class='nav navbar-nav navbar-left'>",
					"      <li class='dropdown'><a href=''", " class='dropdown-toggle'  role='button' aria-haspopup='true' aria-expanded='false' >"]);
		html = html.concat([
					"<span class=\"glyphicon glyphicon-home\"></span></a>"]);
	    html = html.concat(["<ul class='dropdown-menu'>"]);

		var views = this.getApp().nav.getViews();
		if(views != null ){
			for (var j = 0; j < views.length; j++ ){
				var view = views[j];
				html = html.concat(["<li><a href='javascript:void(0);' onclick=\"contentPage.loadViewFirstPage('"+ view.id +"');\">" , view.title , "</a></li>"]);
			}
		html = html.concat(["</ul></li>"]);  // end of views list
		}
					
	    for (var i = 0; i < menuItems.length; i++) {
	        var child = menuItems[i];
	        var curl = child.url;
	        curl = curl.replace(/'/g, "\\'");
	        curl = curl.replace(/\"/g, "\\\"");;

	        var grandChildren = child.children;
	        if (grandChildren != null && grandChildren.length > 0) {

	            if (child.url == activeURL) {
	                html = html.concat(["<li class=\"active dropdown\">"]);
	            } else {
	                html = html.concat(["<li class='dropdown'>"]);
	            }
	            html = html.concat(["<a href='", baseUrl + curl, "' class='dropdown-toggle'  role='button' aria-haspopup='true' aria-expanded='false' >"]);
	            //				html = html.concat(["<span class=\"TreeIcon ",child.iconNode.attributes[0].value,"\"></span>"]);
	            html = html.concat([child.title, "<span class=\"caret\"></span></a>"]);

	            html = html.concat(["<ul class='dropdown-menu'>"]);
				//makes the menuItem label duplicate in dropdown
	                html = html.concat(["<li><a href=\"", baseUrl + curl, "\">"]);
	                html = html.concat([child.title]);
	                html = html.concat(["</a></li>"]);
					
	            for (var j = 0; j < grandChildren.length; j++) {
	                var grandChild = grandChildren[j];
	                var curl = grandChild.url;
	                curl = curl.replace(/'/g, "\\'");
	                curl = curl.replace(/\"/g, "\\\"");
	                html = html.concat(["<li><a href=\"", baseUrl + curl, "\">"]);
	                //					html = html.concat(["<span class=\"TreeIcon TreeIcon",grandChild.nodeDocType,"\"></span>"]);
	                html = html.concat([grandChild.title]);
	                html = html.concat(["</a></li>"]);
	            }
	            html = html.concat(["</ul>"]);

	        } else {

	            if (child.url == activeURL) {
	                html = html.concat(["<li class=\"active\">"]);
	            } else {
	                html = html.concat(["<li>"]);
	            }

	            html = html.concat(["<a href='", baseUrl + child.url, "'>"]);
	            //			html = html.concat(["<span class=\"TreeIcon ",child.iconClass, "\"></span>"]);
	            html = html.concat([child.title, "</a>"]);

	        }

	        html = html.concat(["</li>"]);


	    }
		
		// Check for the enableSearch property in appSettings.json file 
		// displays the search icon on navigation bar if enableSearch == true 
		// and perform static search or servlet search as per searchServlet property
		var app = this.getApp();
		if ( app.settings.enableSearch == true ) {
			html = html.concat([
						//"      </ul>",
						"    <ul class='nav navbar-nav navbar-right'>",
						]);
			if ( app.settings.searchServlet == null ) {
				html = html.concat([
						"      <li><a href='",baseUrl,
						"scripts/jws/SearchMain.jnlp'><span class=\"glyphicon glyphicon-search\"></span></a></li>",
						]);
			}
			if ( app.settings.searchServlet != null) {
				html = html.concat([
					"    <ul class='nav navbar-nav navbar-right'>",					
					"      <li><a href='javascript:void(0);' onclick=\"contentPage.div_show();\"><span class=\"glyphicon glyphicon-search\"></span></a></li>",					
					]);
			} 
		}
		
		// Check for the feedbackURL property in appSettings.json file 
		// displays the feedback icon on navigation bar if feedbackURL is not blank
		if ( app.settings.feedbackURL !== null) {
			html = html.concat([
					"      <li><a target = '_blank' href='",app.settings.feedbackURL,"' title = 'Send feedback'><span class=\"glyphicon glyphicon-envelope\"></span></a></li>",
					]);
		} 
		html = html.concat([
			"      </ul>",
			"  </div><!--/.nav-collapse -->",
			"<div id='popup' style='display:none'>",
			//<!-- Popup Div Starts Here -->
			"<div id='popupForm'>",
			//<!-- Search form -->
			"<form action='",baseUrl,app.settings.searchServlet,"' id='form' method='GET' name='form'>",
			"<img id='close' src='",baseUrl,"/css/images/redclose.jpg' onclick =\"contentPage.div_hide()\">",
			"<h4 id='searchServlet'>Method Search</h4>",
			//"<hr>",
			"<input id='searchString' name='searchString' placeholder='Search String' type='text'><br><br>",
			"<SELECT id='searchType' name='searchType'>",
			"<OPTION VALUE='<All>' SELECTED>All",
            "<OPTION VALUE='Role'>Role",
            "<OPTION VALUE='Task'>Task",
            "<OPTION VALUE='Work Product Type'>Work Product",
            "<OPTION VALUE='Artifact'>-Artifact",
            "<OPTION VALUE='Deliverable'>-Deliverable",
            "<OPTION VALUE='Outcome'>-Outcome",
            "<OPTION VALUE='Guidance'>Guidance",
            "<OPTION VALUE='Checklist'>-Checklist",
            "<OPTION VALUE='Concept'>-Concept",
            "<OPTION VALUE='Example'>-Example",
            "<OPTION VALUE='Guideline'>-Guideline",
            "<OPTION VALUE='Estimation Consideration'>-Estimation Consideration",
            "<OPTION VALUE='Practice'>-Practice",
            "<OPTION VALUE='Report'>-Report",
            "<OPTION VALUE='Reusable Asset'>-Reusable Asset",
            "<OPTION VALUE='RoadMap'>-RoadMap",
            "<OPTION VALUE='Supporting Material'>-Supporting Material",
            "<OPTION VALUE='Term Definition'>-Term Definition",
            "<OPTION VALUE='Template'>-Template",
            "<OPTION VALUE='Tool Mentor'>-Tool Mentor",
            "<OPTION VALUE='Whitepaper'>-Whitepaper",
            "<OPTION VALUE='Category'>Category",
            "<OPTION VALUE='Custom Category'>-Custom Category",
            "<OPTION VALUE='Domain'>-Domain",
            "<OPTION VALUE='Discipline'>-Discipline",
            "<OPTION VALUE='Role Set'>-Role Set",
            "<OPTION VALUE='Role Set Grouping'>-Role Set Grouping",
            "<OPTION VALUE='Tool'>-Tool",
            "<OPTION VALUE='Process'>Process",
            "<OPTION VALUE='Activity'>-Activity",
            "<OPTION VALUE='Capability Process'>-Capability Process",
            "<OPTION VALUE='Delivery Process'>-Delivery Process",
            "<OPTION VALUE='Iteration'>-Iteration",
            "<OPTION VALUE='Milestone'>-Milestone",
            "<OPTION VALUE='Phase'>-Phase",
            "<OPTION VALUE='Role Descriptor'>-Role Descriptor",
            "<OPTION VALUE='Task Descriptor'>-Task Descriptor",
            "<OPTION VALUE='WorkProduct Descriptor'>-WorkProduct Descriptor",
			"</SELECT><br><br>",
			"<input id='cbValue' name='cbValue' type='checkbox' value='true'> Search title only",
			"<input id='txtTags' name='txtTags' placeholder='Tags (comma separated)' type='text'><br><br>",
			"<input id='hitsPerPage' name='hitsPerPage' type='hidden' value='10000'>",
			"<input id='submit' type ='submit' value = 'Search' >",
			"</form>",
			"</div>",
			//<!-- Popup Div Ends Here -->
			"</div>",
			"   </div>",
			"   </nav>"
			]);
		
		// Check for the showBreadcrumbs property in appSkinSettings.json file
		// displays the breadcrumbs if showBreadcrumbs == true
	   if( app.settings.showBreadcrumbs == false ) {
			html = html.concat(["<div id='crumbTrail' style='display:none'>"]);
		}else {
			html = html.concat(["<div id='crumbTrail' style='display:block'>"]);
		}
		
	    for (var i = 0; i < bcs.length; i++) {
	        var bc = bcs[i]; // {url:url, title:title}

	        // escape the quotes
	        var url = bc.url;
	        url = url.replace(/'/g, "\\'");
	        url = url.replace(/\"/g, "\\\"");

			if (i < bcs.length - 1) {
				html = html.concat(["<li>"]);
				if (i > 0) {
					html = html.concat(["<span>&nbsp;/&nbsp;</span>"]);
				}
				html = html.concat(["<a href=\"", baseUrl, url, "\" class='crumb'>", bc.title, "</a>"]);
			} else {
				html = html.concat(["<li class='dropdown'>"]);
				if (i > 0) {
					html = html.concat(["<span>&nbsp;/&nbsp;</span>"]);
				}
				html = html.concat(["<span class='dropdown-toggle crumb'>", bc.title, "</span>"]);
				var children = bc.children;
				if(children != null && children.length > 0){
					html = html.concat(["<span class=\"caret\"></span><ul id= 'crumbMenu' class='dropdown-menu'>"]);
					//makes the breadcrumb title duplicate in breadcrumb drop-down
					html = html.concat(["<li><a href='", baseUrl + url , "'>" , bc.title , "</a></li>"]);
					
					for (var j = 0; j < children.length; j++ ){
						var child = children[j];
						var curl = child.url;
						curl = curl.replace(/'/g, "\\'");
						curl = curl.replace(/\"/g, "\\\"");
						html = html.concat(["<li><a href='", baseUrl + curl , "'>" , child.title , "</a></li>"]);
					}
					html = html.concat(["</ul>"]);
				}

			}
			
			html = html.concat(["</li>"]);			
	    }

	    html = html.concat(["</div>"]);


	    div.innerHTML = html.join("");
		this.navBarEventHandling(div);

	},	
	
	navBarEventHandling: function(element){
			
		var isTouchSupported = 'ontouchstart' in window;
		this.addHideEvent();
		this.addHideEventOnMouseLeave();
		var dropdowns = element.querySelectorAll('.dropdown-toggle');
		for(i=0; i<dropdowns.length; i++) {
				//if (isTouchSupported) {
					dropdowns[i].onclick =
					function(evt){			
						dropdown = this.parentElement.querySelector('.dropdown-menu');
						if (dropdown != null) {
							if (dropdown.style.display=="block") {
								dropdown.style.display="none";
							}
							else {
								contentPage.hideOtherDropDowns();
								dropdown.style.display="block"; 
								evt.preventDefault();
							}
						}
					};			
	            /* }
				else {
					dropdowns[i].onmouseover =
					function(evt){					
						dropdown = this.parentElement.querySelector('.dropdown-menu');
						if (dropdown != null) {							
								dropdown.style.display="block"; 
						};
					};
		
	            };
				theparent = dropdowns[i].parentElement;
				theparent.onmouseleave =
				function(){
						dropdown = this.querySelector('.dropdown-menu');
						if (dropdown != null) {							
								dropdown.style.display="none"; 
						};       
                 }; */
         
 
            };	
	}, 
	addHideEvent : function(){
		//click other place ,hide the menu
		var body = document.getElementsByTagName('body')[0];
		for(var c = 0;c<body.children.length;c++){
			if(body.children[c].id != 'breadcrumbs'){
				body.children[c].onclick = function(){
					links = document.getElementById('breadcrumbs').querySelectorAll('.dropdown-toggle');
					linksTable = links[0].parentNode.querySelector('.dropdown-menu').style.display="none";//hide home icon table
					for(j=1;j<links.length-1;j++){
						linksTable = links[j].parentNode.querySelector('.dropdown-menu');
						if(linksTable != null){//the last one has on table,escape
							linksTable.style.display="none";
						}
					}  
				};
			}
		}
	},
	
	addHideEventOnMouseLeave : function(){
		$('.dropdown-menu').mouseleave(function ()
    {
       dropdown.style.display="none";
    });
	},
	
	hideOtherDropDowns : function(){
		var lis = document.getElementById('breadcrumbs').querySelectorAll('.dropdown-menu');
		for(j=0;j<lis.length;j++){
			if(lis[j].style.display != "none"){
				lis[j].style.display = "none";
			}
		}
	},
	
	include_css : function(path)   
	{       
	    var fileref=document.createElement("link")   
	    fileref.rel = "stylesheet";  
	    fileref.type = "text/css";  
	    fileref.href = path;   
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(fileref);
	},	
	
	resolveUrl: function(url) {

		// use the window's url directly
		if ( url.indexOf("./") == 0 ) {			
				var base = window.location.href;
				//alert("base:" + base);
				var i = base.lastIndexOf("/");
				url = base.substring(0, i) + url.substring(1);
		} 
		
		return url;
	},
	
	/* get the page guid, it's the guid of the element or page*/
	getPageId : function() {
		var e = document.getElementById("page-guid");
		if ( e != null ) {
			return e.getAttribute("value");
		}
		
		return null;
	},
	
	
	isFileUrl: function(url) {
		return (url != null) && (url.toLowerCase().indexOf("file://") == 0);
	},
	
	//Function To Display Popup
	div_show: function() {
		document.getElementById('popup').style.display = "block";
	},
	
	//Function to Hide Popup
	div_hide: function(){
		document.getElementById('popup').style.display = "none";
	}

};
