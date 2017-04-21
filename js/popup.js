var Popup = (function() {
	var $_copyButton = $("button#btn_copy"),
		copyClickHandler = function() {
			var $item = $(this).parents("tr.item"),
				$citation = $item.find("textarea.selected_text"),
				$copyBtn = $(this);

			$citation.select();
			$("tr.item button.copied").removeClass("copied").text("Copy");
			document.execCommand('copy');
			chrome.extension.sendMessage({
				from: "popup",
				action: "copy",
				data: $citation.text()
			}, function(response) {
				$copyBtn.addClass("copied").text("Copied");
			});
		},
		displayData = function(data, citation) {
			data = data.trim();
			citation = citation.trim();
			if (data.indexOf("\"") != 0) {
				data = "\"" + data;
			}
			if (data.slice(data.length - 1).indexOf("\"") != 0) {
				data += "\"";
			}
			$("textarea#selected_text").text(data + " " + citation);
		},
		init = function() {
			chrome.runtime.sendMessage({
				from: "popup",
				action: "get_data"
			}, function(response) {
				console.log(response);
				displayData(response.selectedText, response.citation);
			});

			$_copyButton.click(function() {
				var _btn = $(this);
				$("textarea#selected_text").select();
				document.execCommand('copy');
				_btn.text("Copied to Clipboard");

				chrome.extension.sendMessage({
					from: "popup",
					action: "copy",
					data: $("textarea#selected_text").val()
				});
				
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