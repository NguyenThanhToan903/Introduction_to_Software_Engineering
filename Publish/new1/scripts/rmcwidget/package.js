var profile = (function(){
	var testResourceRe = /^rmcwidget\/tests\//,

		copyOnly = function(filename, mid){
			var list = {
				"rmcwidget/package.js":1,
				"rmcwidget/package.json":1
			};
			return (mid in list) ||
				(/^rmcwidget\/images\//.test(mid) && !/\.css$/.test(filename)) ||
				/(png|jpg|jpeg|gif|tiff)$/.test(filename);
		};

	return {
		resourceTags:{
			test: function(filename, mid){
				return testResourceRe.test(mid) || mid=="rmcwidget/tests";
			},

			copyOnly: function(filename, mid){
				return copyOnly(filename, mid);
			},

			amd: function(filename, mid){
				return !testResourceRe.test(mid) && !copyOnly(filename, mid) && /\.js$/.test(filename);
			}
		}
	};
})();

