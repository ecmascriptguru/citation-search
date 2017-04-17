(function(window, jQuery) {
	console.log("Background is working...");
})(window, $);

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
    var url = info.url || tab.url;
    if(url && (url.indexOf('https://1.next.westlaw.com/') == 0 ||url.indexOf('https://advance.lexis.com') == 0))
        chrome.pageAction.show(tabId);
    else
        chrome.pageAction.hide(tabId);
});