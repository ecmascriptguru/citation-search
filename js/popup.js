﻿var Popup = (function() {
	var copyClickHandler = function() {
			var $item = $(this).parents("li.item"),
				$citation = $item.find("textarea.citation");

			$citation.select();
			$("li.item button.copied").removeClass("copied").text("Copy");
			document.execCommand('copy');
			chrome.extension.sendMessage({
				from: "popup",
				action: "copy",
				title: $(this).attr('data-title'),
				data: $citation.text()
			}, function(response) {
				$(this).addClass("copied").text("Copied");
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
			chrome.extension.sendMessage({
				from: "popup",
				action: "get_data"
			}, function(response) {
				displayData(response.data);
			});
		};

	return {
		init: init
	};
})();

(function(window, jQuery) {
	Popup.init();
})(window, $);