var Popup = (function() {
	var $_updateButton = $("button#btn_copy"),
		copyClickHandler = function() {
			var $item = $(this).parents("tr.item"),
				$citation = $item.find("textarea.citation"),
				$copyBtn = $(this);

			$citation.select();
			$("tr.item button.copied").removeClass("copied").text("Copy");
			document.execCommand('copy');
			chrome.extension.sendMessage({
				from: "popup",
				action: "copy",
				title: $(this).attr('data-title'),
				data: $citation.text()
			}, function(response) {
				$copyBtn.addClass("copied").text("Copied");
			});
		},
		displayData = function(data) {
			$("textarea#selected_text").text("\"searches conducted outside the judicial process, without prior approval by judge or magistrate, are per se unreasonable under the Fourth Amendment.\"\n" + data);
		},
		init = function() {
			chrome.runtime.sendMessage({
				from: "popup",
				action: "get_data"
			}, function(response) {
				console.log(response);
				// displayData(response.data);
			});

			chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
				if (message.action === "get_data_completed") {
					displayData(message.data);
				}
			});

			$_updateButton.click(function() {
				var _btn = $(this);
				$("textarea#selected_text").select();
				document.execCommand('copy');
				_btn.text("Copied to Clipboard");
				window.setTimeout(function() {
					_btn.text("Copy");
				}, 3000);
			});
		};

	return {
		init: init
	};
})();

(function(window, jQuery) {
	Popup.init();
})(window, $);