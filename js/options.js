var Options = (function() {
	var _dataTable = null,
		init = function() {
			_dataTable = $('#data-table').DataTable();
		};

	return {
		init: init
	}
})();

(function(window, jQuery) {
	console.log("Options page is working.");
	Options.init();
})(window, $);