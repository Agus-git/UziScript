var UziDebugger = (function () {
	
	var stackFrameActive = 0;
	
	function init() {
		Uzi.onDebuggerUpdate(function () {
			stackFrameActive = 0;
			update();
		});
		$("#continueButton").on("click", debuggerContinue);
		$("#overButton").on("click", debuggerOver);
		$("#intoButton").on("click", debuggerInto);
		$("#outButton").on("click", debuggerOut);
		$("#nextButton").on("click", debuggerNext);
		disableButtons();
	}
	
	function errorHandler (err) {
		console.log(err);
	}
	
	function disableButtons() {
		$("#buttons button").attr("disabled", "disabled");
	}
	
	function nop() {}
	
	function enableButtons() {
		$("#buttons button").attr("disabled", null);
	}

	function debuggerContinue() {
		disableButtons();
		ajax.request({ 
			type: 'POST', 
			url: Uzi.baseUrl + "/uzi/debugger/actions/continue",
			data: {},
			success: nop,
			error: errorHandler
		}, 0);
	}	

	function debuggerOver() {
		disableButtons();
		ajax.request({ 
			type: 'POST', 
			url: Uzi.baseUrl + "/uzi/debugger/actions/over",
			data: {},
			success: nop,
			error: errorHandler
		}, 0);
	}

	function debuggerInto() {
		disableButtons();
		ajax.request({ 
			type: 'POST', 
			url: Uzi.baseUrl + "/uzi/debugger/actions/into",
			data: {},
			success: nop,
			error: errorHandler
		}, 0);
	}

	function debuggerOut() {
		disableButtons();
		ajax.request({ 
			type: 'POST', 
			url: Uzi.baseUrl + "/uzi/debugger/actions/out",
			data: {},
			success: nop,
			error: errorHandler
		}, 0);
	}

	function debuggerNext() {
		disableButtons();
		ajax.request({ 
			type: 'POST', 
			url: Uzi.baseUrl + "/uzi/debugger/actions/next",
			data: {},
			success: nop,
			error: errorHandler
		}, 0);
	}
	
	function update() {
		if (Uzi.debugger.stackFrames.length == 0) return;
		enableButtons();
		updateStackFrames(Uzi.debugger.stackFrames);
		updateStack(Uzi.debugger.stackFrames[stackFrameActive]);
		updateLocals(Uzi.debugger.stackFrames[stackFrameActive]);
	}
	
	function updateLocals(stackFrame) {
		var container = $("#locals");
		container.text("");
		stackFrame.locals.forEach(function (each) {
			container.append($("<p>").text(each.name + ": " + each.value));
		});
	}

	function updateStack(stackFrame) {
		let container = $("#stack tbody");
		container.text("");
		stackFrame.annotatedStack.forEach(function (each) {
			let data = each.split("\t");
			let tr = $("<tr>")
				.append($("<th>")
					.attr("scope", "row")
					.text(data[0].replace(")", "")))
				.append($("<td>")
					.text(data[1]))
				.append($("<td>")
					.text(data[2]));
			container.append(tr);
		});
	}
	
	function updateStackFrames(stackFrames) {
		let container = $("#stackFrames");
		container.text("");
		for (let i = 0; i < stackFrames.length; i++) {
			//<a class="list-group-item list-group-item-action active">
			let sf = stackFrames[i];
			let li = $("<button>")
				.addClass("list-group-item")
				.addClass("list-group-item-action")
				.text(getScriptName(sf));
			if (i == stackFrameActive) {
				li.addClass("active");
			}
			li.on("click", function () { 
				stackFrameActive = i;
				update();
			});
			container.append(li);
		}
	}
	
	function getScriptName(sf) {
		var name = sf.scriptName;
		name += "(";
		sf.arguments.forEach(function (arg, index) {
			if (index > 0) { name += ", "; }
			name += arg.name;
			name += ": ";
			name += arg.value;
		});
		name += ")";
		return name;
	}
	
	return {
		init: init,
	};
})();

