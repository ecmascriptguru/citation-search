var Popup = (function() {
	var copyClickHandler = function() {
			var $item = $(this).parents("li.item"),
				$citation = $item.find("textarea.citation");

			$citation.select();
			$("li.item button.copied").removeClass("copied").text("Copy");
			document.execCommand('copy');
			$(this).addClass("copied").text("Copied");
		},
		displayData = function(data) {
			var $list = $("ul.list");
			$list.children().remove();

			for (var i = 0; i < data.length; i ++) {
				var $item = $("<li/>").addClass("item row"),
					$citation = $("<textarea/>").addClass("form-control citation").text(data[i]),
					$copyBtn = $("<button/>").addClass("btn btn-info form-control copy").text("Copy");

				$item.append(
					$("<div/>").addClass("col-xs-9").append($citation),
					$("<div/>").addClass("col-xs-3").append($copyBtn)
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