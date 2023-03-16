//------------------------------------------------------------------------------
// Copyright (c) 2004, 2017 IBM Corporation.  All Rights Reserved.
//------------------------------------------------------------------------------

define(['dojo/json',"dojo/text!theme/appSettings.json","dojo/text!theme/appSkinSettings.json"],function(JSON, appSettingsData, appSkinSettingsData){

	var jsonStringSettings = JSON.stringify(eval("(" + appSettingsData + ")"));	
	var jsonStringSkinSettings = JSON.stringify(eval("(" + appSkinSettingsData + ")"));	
	var parsedSettings = JSON.parse(jsonStringSettings);
	var parsedSkinSettings = JSON.parse(jsonStringSkinSettings);
 
 // Fix for failure of IE to support Object.assign
 
 if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}
 // End of IE Fix
 
	Object.assign(parsedSettings, parsedSkinSettings);
	return parsedSettings;
});

