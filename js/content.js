var globalTimer = null,
	counter = 0;

var ContentScript = (function() {
	var _data = [],
		lexis = function() {
			var $dataContainer = $("div#shepListView");

			if ($dataContainer.length == 0) {
				alert("Please open the correct url to get data.");
				return false;
			}
			var $dataRecords = $dataContainer.find("ol li div.tabrow div.indent");

			_data = [];
			for (var i = 0; i < $dataRecords.length; i++) {
				if ($dataRecords.eq(i).find("a.citedby").text().toLowerCase().indexOf("cited by") > -1) {
					var temp = $dataRecords.eq(i).find("span.hit");
					if (_data.indexOf(temp.text()) == -1) {
						_data.push(temp.text());
					}
				}
			}
			return _data;
		},
		westlaw = function() {
			var $dataContainer = $("table#co_relatedInfo_table_citingRefs");

			if ($dataContainer.length == 0 && counter < 50) {
				counter++;
				return false;
			}

			clearInterval(globalTimer);
			counter = 0;
			
			var $records = $dataContainer.find("tbody tr td.co_detailsTable_content");
			_data = [];

			for (var i = 0; i < $records.length; i ++) {
				var temp = $records.eq(i).find("div.co_snippet a.co_snippet_link span.co_searchTerm");
				if (_data.indexOf(temp.text()) == -1) {
					_data.push(temp.text());
				}
			}

			return _data;
		},
		init = function() {
			console.log("init");
			return this;
		},
		analyze = function() {
			if (window.location.host.indexOf("advance.lexis.com") === 0) {
				lexis();
			} else if (window.location.host.indexOf("1.next.westlaw.com") === 0) {
				globalTimer = setInterval(westlaw, 500);
			}
		};
		
	return {
		init: init,
		analyze: analyze
	};
})();

(function(window, jQuery) {
	ContentScript.init();
	ContentScript.analyze();
})(window, $);