//------------------------------------------------------------------------------
// Copyright (c) 1987, 2008 IBM Corporation.  All Rights Reserved.
//------------------------------------------------------------------------------
// this file define the localizable resource entries 
// the strings defined here should be localized
define([], function(){
return {

// translate the strings below

/* Unneeded resources have been commented out, but leaving in place in case we put some back in after a further upgrade.
Note that non-English versions of this file  have not been revised.  The extra resource strings are unused and don't cause a problem.

// these are labels of the drawers
drawer_searchResult:"Search Result",
drawer_glossary:"Glossary",
drawer_index:"Index",
drawer_profiling:"Profiling",
*/

/*
// these labels of buttons
closeButton_text:"Close",
collapseButton_text:"Collapse",
expandButton_text:"Expand",
*/

DojoTreePane2_error_load_tree:"error loading tree",
DojoTreePane_error_load_tree:"error loading tree",

/* 

// the icon tooltips in the toolbar
toolbar_tooltip_display_dropdown_menu:"Display the drop-down menu",
toolbar_tooltip_display_glossary:"Display Glossary",
toolbar_tooltip_display_index:"Display Index",
toolbar_tooltip_sync:"Synchronizes the view tree with the current content page",
toolbar_tooltip_email:"Send feedback",
toolbar_tooltip_info:"Show version and copyright information",
//workitem41170
toolbar_tooltip_collapse:"Collapse All Tree Items",

// the drop down menus
toolbar_menu_showall:"Show All",
toolbar_menu_closeall:"Close All",
toolbar_menu_glossary:"Glossary",
toolbar_menu_index:"Index",
toolbar_menu_search:"Search",
toolbar_menu_sync:"Link view with content page",
toolbar_menu_feedback:"Feedback",
toolbar_menu_about:"About",
//workitem41170
toolbar_menu_collapseTreeItem:"Collapse All Tree Item",
*/

/*
// search scope text
searchScope_title:"Search Scope",
searchScope_type_text:"Type of page to search:",
searchScope_rpp:"Results per page:",
searchScope_mc:"Method Content",
searchScope_role:"Role",
searchScope_task:"Task",
searchScope_wp:"Work Product",
searchScope_guidance:"Guidance",
searchScope_process:"Process",
searchScope_activity:"Activity",
searchScope_general:"general Content",
*/
/*
// search widget
searchWidget_inprogress:"Search in progress...",
searchWidget_errorMessage : "Problems calling search engine",
searchWidget_searchText : "Search this Site:",	//This line needs to be re-translated by ITA
searchWidget_initiaStart : "Search applet initializing...",
searchWidget_initiaEnd : "Initialization done",
searchWidget_searchStart : "Search started to run...",
searchWidget_searchRnning : "Querying,please wait with patience...",
searchWidget_searchEnd : "Generating search results...",
searchWidget_noResults : "No Results found!",
*/
/*
// the pop up window title for the about box
about_box_title:"Rational Method Composer",
*/

// feedback email subject text
feedback_email_subject:"About page: ",

// end of strings 
// :::::::::::::::::::: no translation below this point :::::::::::::::::::::::::::::::::::
	searchResultPaneLabel : this.drawer_searchResult,
	glossaryPaneLabel :  this.drawer_glossary ,
	indexPaneLabel : this.drawer_index ,
	profilingPaneLabel : this.drawer_profiling
}	
	
});