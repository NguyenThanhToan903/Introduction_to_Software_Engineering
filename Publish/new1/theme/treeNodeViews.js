//------------------------------------------------------------------------------
// Copyright (c) 2004, 2017 IBM Corporation.  All Rights Reserved.
//------------------------------------------------------------------------------
define(['dojo/json',"dojo/text!theme/treeNodes.json"],function(JSON, data){

  
   var jsonString = JSON.stringify(eval("(" + data + ")"));	
   var parsed = JSON.parse(jsonString);

  
  return parsed;
});

