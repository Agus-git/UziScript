var UziMonitor = (function () {
	
	var monitors = [];
	
	function init() {		
		$("#addGraphButton").on("click", function () {
			addMonitor();
		});

		Uzi.onMonitorUpdate(function () {
			monitors.forEach(function (monitor) {
				var colors = palette('rainbow', Uzi.pins.length);
				var max = 0;
				var pins = Uzi.pins.filter(function (pin) {
					return monitor.pins.indexOf(pin.number) !== -1;
				});
				var data = { 
					datasets: pins.map(function (pin) {
						var i = Uzi.pins.findIndex(function (each) { 
							return each.number == pin.number; 
						});
						var color = "#" + colors[i];
						return {
							label: "Pin " + pin.number,
							fill: false,
							borderColor: color,
							backgroundColor: color,
							//pointBorderWidth: 1,
							pointRadius: 0,
							data: pin.history.map(function (each) {
								timestamp = each.timestamp;
								if (timestamp > max) {
									max = timestamp;
								}
								return {
									x: timestamp,
									y: each.value
								};
							})
						}
					})
				};
				var options = {
					maintainAspectRatio: false,
					showTooltips: false,
					animation: {
						duration: 0
					},
					scales: {
						xAxes: [{
							display: false,
							type: 'linear',
							position: 'bottom',
							ticks: {
								min: max - 10000,
								max: max
							}
						}]
					},
					elements: {
						line: {
							tension: 0,
						}
					}
				};
				monitor.chart.data = data;
				monitor.chart.options = options;
				monitor.chart.update();
			});
		});
	}

	function addMonitor() {		
		choosePins(function (selection) {
			console.log(selection);
			for (var i = 0; i < selection.length; i++) {
				Uzi.activatePinReport(selection[i]);
			}
			buildLineChartFor(selection);
		});	
	}
	
	function buildLineChartFor(pins) {
		var editor = $("#editor");
		var monitor = $("<div>").addClass("monitor");
		var canvas = $("<canvas>");
		monitor.draggable({
			containment: "parent",
			scroll: true,
			snap: true
		});
		monitor.resizable({
			minHeight: 150,
			minWidth: 200,
			handles: "n, e, s, w, ne, se, sw, nw"
		});
		
		// HACK(Richo): JQuery UI seems to add the "position:relative"
		monitor.attr("style", null);
		
		monitor.append(canvas);
		editor.append(monitor);
		
		var chart = createChartOn(canvas.get(0));
		monitors.push({
			container: monitor,
			pins: pins,
			chart: chart,
		});
	}

	function choosePins(callback) {
		$("#monitorSelectionModal #acceptButton").on("click", function () {
			var selected = [];
			$("#monitorSelectionModal input:checked").each(function () { 
				selected.push(parseInt(this.value));
			});
			callback(selected);
			$("#monitorSelectionModal").modal('hide');
		});
		$("#monitorSelectionModal").on("hide.bs.modal", function () {
			$("#monitorSelectionModal #acceptButton").off("click");
			$("#monitorSelectionModal").off("hide.bs.modal");
		});
		$("#monitorSelectionModal input:checkbox").each(function () { 
			this.checked = false; 
		});
		$("#monitorSelectionModal").modal({});
	}
	
	function createChartOn(canvas) {		
		var ctx = canvas.getContext('2d');
		var data = {};
		var options = {};
		return new Chart(ctx, {
			type: 'line',
			data: data,
			options: options
		});
	}

	return {
		init: init,
		monitors: monitors
	};
})();

