'use strict';

var Citation = (function() {
	var _data = [],
		setData = function(data) {
			_data = data;
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
		getData: getData
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