var Popup = (function() {
	var copyClickHandler = function() {
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
			var $list = $("table.list tbody");
			$list.children().remove();

			for (var i = 0; i < data.length; i ++) {
				var $item = $("<tr/>").addClass("item row"),
					$citation = $("<textarea/>").addClass("form-control citation").text(data[i].citation),
					$copyBtn = $("<button/>").addClass("btn btn-info form-control copy").attr('data-title', data[i].title).text("Copy");

				$item.append(
					$("<td/>").append($citation),
					$("<td/>").append($copyBtn)
				);

				$list.append($item);

				$copyBtn.click(copyClickHandler);
			}
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
			})
		};

	return {
		init: init
	};
})();

(function(window, jQuery) {
	Popup.init();
})(window, $);