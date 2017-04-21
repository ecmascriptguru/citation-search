'use strict';

var globalTimer = null,
	counter = 0;

var ContentScript = (function() {
	var _data = [],
		returndata = function() {
			chrome.extension.sendMessage({
				from: "cs",
				action: "feed_data",
				data: getData()
			}, function(response) {
				console.log(response);
			});
		},
		lexis = function() {
			var $dataContainer = $("div#shepListView"),
				citation = null;

			if ($dataContainer.length == 0) {
				// alert("Please open the correct url to get data.");
				return false;
			}
			var $dataRecords = $dataContainer.find("ol li div.tabrow div.indent");

			_data = [];
			for (var i = 0; i < $dataRecords.length; i++) {
				if ($dataRecords.eq(i).find("a.citedby").text().toLowerCase().indexOf("cited by") > -1) {
					var $tempCitation = $dataRecords.eq(i).find("span.hit"),
						$title = $dataRecords.eq(i).find("h2.doc-title");
					if (_data.indexOf($tempCitation.text()) == -1) {
						citation = $tempCitation.text().trim();
						break;
						// _data.push({
						// 	title: $title.find("span").eq(0).text(),
						// 	citation: $tempCitation.text().trim()
						// });
					}
				}
			}
			// returndata();
			// return _data;
			chrome.extension.sendMessage({
				from: "cs",
				action: "citation",
				source: "lexis",
				data: citation
			});
		},
		westlaw = function() {
			var $dataContainer = $("table#co_relatedInfo_table_citingRefs");

			if ($dataContainer.length == 0 && counter < 50) {
				counter++;
				return false;
			}

			clearInterval(globalTimer);
			counter = 0;

			var $records = $dataContainer.find("tbody tr td.co_detailsTable_content"),
				citation = null;
			_data = [];

			for (var i = 0; i < $records.length; i ++) {
				var $tempCitation = $records.eq(i).find("div.co_snippet a.co_snippet_link span.co_searchTerm"),
					$name = $records.eq(i).find("a.co_relatedInfo_grid_documentLink");
				if (_data.indexOf($tempCitation.text()) == -1) {
					citation =  $tempCitation.text().trim();
					break;
					// _data.push({
					// 	title: $name.text().trim(),
					// 	citation: $tempCitation.text().trim()
					// });
				}
			}

			// returndata();
			// return _data;
			chrome.extension.sendMessage({
				from: "cs",
				action: "citation",
				source: "westlaw",
				data: citation
			});
		},
		init = function() {
			console.log("init");
			$(document).mouseup(function() {
				var txt = window.getSelection().toString();

				if (txt) {
					chrome.extension.sendMessage({
						from: "cs",
						action: "selectedText",
						data: txt
					});
				}
			});
			return this;
		},
		getData = function() {
			return _data;
		},
		analyze = function() {
			if (window.location.host.indexOf("advance.lexis.com") === 0) {
				lexis();
			} else if (window.location.host.indexOf("1.next.westlaw.com") === 0) {
				globalTimer = setInterval(westlaw, 500);
				// return westlaw();
			}

			// var selectedText = window.getSelection().toString();
			// // console.log(document.getSelection());
			// return selectedText;
		};
		
	return {
		init: init,
		analyze: analyze,
		data: getData
	};
})();

(function(window, jQuery) {
	ContentScript.init();
	ContentScript.analyze();

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.action === "get_data") {
			var text = ContentScript.analyze(),
				highlighted = null;

			// if (text == "") {
			// 	alert("Please select text.");
			// } else {
				
			// }

			// if (window.location.host.indexOf("advance.lexis.com") === 0) {
			// 	highlighted = $($("span.sentence")[0]).find("span.hit").text();// span.SS_un").text();
			// } else if (window.location.host.indexOf("1.next.westlaw.com") === 0) {
			// 	highlighted = $($("span.co_searchTerm")[0]).text();
			// }
			sendResponse({
				selectedText: window.getSelection().toString()
			});
		}
	})
})(window, $);