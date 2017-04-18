var Options = (function() {
	var _dataTable = null,
		drawTable = function() {
			var _data = JSON.parse(localStorage._saved_data || "[]");

			_dataTable.clear();

			for (var i = 0; i < _data.length; i ++) {
				var row = [i + 1];
				row.push(_data[i].title);
				row.push("<div class='col-xs-12'><textarea data-id='" + i + "' class='form-control citation'>" + _data[i].citation + "</textarea></div>");
				row.push(_data[i].copied_at);
				row.push("<div class=''>" +
					"<button class='action-copy btn btn-default col-xs-6' data-id='" + i + "'>Copy</button>" +
					"<button class='action-delete btn btn-danger col-xs-6' data-id='" + i + "'>Delete</button>" +
				"</div>");

				_dataTable.row.add(row).draw();
			}
		},

		changeData = function(index, citation) {
			var _data = JSON.parse(localStorage._saved_data || "[]");
			_data[index].citation = citation;
			localStorage._saved_data = JSON.stringify(_data);
		},

		init = function() {
			_dataTable = $('#data-table').DataTable();
			$("#data-table tbody").on("change", "textarea.citation", function() {
				var index = parseInt($(this).attr('data-id')),
					citation = $(this).val();
				changeData(index, citation);
			});
			drawTable();
		};

	return {
		init: init
	}
})();

(function(window, jQuery) {
	console.log("Options page is working.");
	Options.init();
})(window, $);