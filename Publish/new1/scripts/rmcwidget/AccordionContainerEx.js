//------------------------------------------------------------------------------
// Copyright (c) 2004, 2016 IBM Corporation.  All Rights Reserved.
//------------------------------------------------------------------------------
// Extends the dojo.widget.AccordionContainer so that can add additional UI elements in future.
// For example, in future could add:
//   1. Expand/Collapse indicators
//   2. Close buttons
//


define([
    "dojo/_base/declare",
    "dijit/layout/AccordionContainer"
], function(declare, AccordionContainer) {

    return declare("AccordionContainerEx",[AccordionContainer], {		
		
		postCreate: function() {
			this.inherited(arguments);
			this.duration = 10;

		},
		

		
	__END: true
	}
);
}	
);
