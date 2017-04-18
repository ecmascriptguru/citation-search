var Options = (function() {
	var _dataTable = null,
		drawTable = function() {
			var _data = JSON.parse(localStorage._saved_data || "[]");

			_dataTable.clear();

			for (var i = 0; i < _data.length; i ++) {
				var row = [i + 1];
				row.push(_data[i].title);
				row.push("<div class='col-xs-12'><textarea class='form-control'>" + _data[i].citation + "</textarea></div>");
				row.push(_data[i].copied_at);
				row.push("<div class=''>" +
					"<button class='action-copy btn btn-default col-xs-6' data-id='" + i + "'>Copy</button>" +
					"<button class='action-delete btn btn-danger col-xs-6' data-id='" + i + "'>Delete</button>" +
				"</div>");

				_dataTable.row.add(row).draw();
			}
		},
		init = function() {
			_dataTable = $('#data-table').DataTable();
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