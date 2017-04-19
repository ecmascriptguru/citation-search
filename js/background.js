'use strict';

var Citation = (function() {
	var _data = [],
		_savedData = JSON.parse(localStorage._saved_data || "[]"),
		setSavedData = function(data) {
			localStorage._saved_data = JSON.stringify(data || []);
		},
		getSavedData = function() {
			return JSON.parse(localStorage._saved_data || "[]");
		},
		setData = function(data) {
			_data = data;
		},
		copy = function(title, text) {
			var curSavedData = getSavedData();
			curSavedData.push({
				title: title,
				citation: text,
				copied_at: new Date().toISOString().slice(0, 10)
			});
			setSavedData(curSavedData);
		},
		getData = function() {
			return _data;
		},
		init = function() {
			//
		};

	return {
		init: init,
		setData: setData,
		getData: getData,
		setSavedData: setSavedData,
		getSavedData: getSavedData,
		copy: copy
	};
})();

(function(window, jQuery) {
	console.log("Background is working...");
})(window, $);

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    var url = info.url || tab.url;
    if(url && (url.indexOf('https://1.next.westlaw.com/') == 0 || url.indexOf('https://advance.lexis.com') == 0))
        chrome.pageAction.show(tabId);
    else
        chrome.pageAction.hide(tabId);
});

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.from) {
		case "popup":
			if (message.action == "get_data") {
				sendResponse({data: Citation.getData()});
			} else if (message.action == "copy") {
				Citation.copy(message.title, message.data);
				sendResponse({});
			}
			break;

		case "cs":
			if (message.action == "feed_data") {
				Citation.setData(message.data);
			}
			break;

		default:
			console.log("Unkown...");
			break;
	}
})