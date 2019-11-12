﻿let IDE = (function () {

  let layout, defaultLayoutConfig;
  let codeEditor;
  let selectedPort = "automatic";
  let autorunInterval, autorunNextTime;
  let lastProgram;
  let lastFileName;

  let IDE = {
    init: function () {
      // NOTE(Richo): The following tasks need to be done in order:
      loadDefaultLayoutConfig()
        .then(initializeDefaultLayout)
        .then(initializeBlocksPanel)
        .then(initializeBlocklyMotorsModal)
        .then(initializeBlocklySonarsModal)
        .then(initializeBlocklyVariablesModal)
        .then(initializeAutorun)
        .then(initializeTopBar)
        .then(initializeInspectorPanel)
        .then(initializeCodePanel)
        .then(initializeOutputPanel)
        .then(initializeBrokenLayoutErrorModal)
        .then(initializeServerNotFoundErrorModal)
        .then(initializeOptionsModal)
        .then(initializeInternationalization);
    },
  };

  function loadDefaultLayoutConfig() {
    return ajax.GET("default-layout.json")
      .then(function (json) { defaultLayoutConfig = JSON.parse(json); });
  }

  function initializeDefaultLayout() {
    initializeLayout(defaultLayoutConfig);
  }

  function initializeLayout(config) {
    if (layout) { layout.destroy(); }
    layout = new GoldenLayout(config, "#layout-container");
    layout.registerComponent('DOM', function(container, state) {
      let $el = $(state.id);
      container.getElement().append($el);
      container.on('destroy', function () {
        $("#hidden-panels").append($el);
      });
    });

    function updateSize() {
      let w = window.innerWidth;
      let h = window.innerHeight - $("#top-bar").outerHeight();
      if (layout.width != w || layout.height != h) {
        layout.updateSize(w, h);
      }
    };

    window.onresize = updateSize;
    layout.on('stateChanged', updateSize);
    layout.on('stateChanged', resizeBlockly);
    layout.on('stateChanged', saveToLocalStorage);
    layout.on('stateChanged', checkBrokenLayout);
    layout.on('stateChanged', function () {
      // HACK(Richo): The following allows me to translate panel titles
      $(".lm_title").each(function () { $(this).attr("lang", "en"); });
      i18n.updateUI();
    });
    layout.init();
    updateSize();
    resizeBlockly();
    checkBrokenLayout();
  }

  function initializeBlocksPanel() {
    return UziBlock.init()
      .then(function () {
          UziBlock.on("change", function () {
            saveToLocalStorage();
            scheduleAutorun(false);
          });
      })
      .then(restoreFromLocalStorage);
  }

  function initializeTopBar() {
    $("#new-button").on("click", newProject);
    $("#open-button").on("click", openProject);
    $("#save-button").on("click", saveProject);
    $("#port-dropdown").change(choosePort);
    $("#connect-button").on("click", connect);
    $("#disconnect-button").on("click", disconnect);
    $("#verify-button").on("click", verify);
    $("#run-button").on("click", run);
    $("#install-button").on("click", install);
		$("#interactive-checkbox").on("change", toggleInteractive);
    $("#options-button").on("click", openOptionsDialog);
    Uzi.on("update", updateTopBar);
    Uzi.on("update", updateConnection);
  }

  function initializeInspectorPanel() {
    $("#pin-choose-button").on("click", openInspectorPinDialog);
    $("#global-choose-button").on("click", openInspectorGlobalDialog);
    Uzi.on("update", updateInspectorPanel);
  }

  function initializeBlocklyMotorsModal() {
    function getFormData() {
      let data = $("#blockly-motors-modal-container").serializeJSON();
      if (data.motors == undefined) return [];
      return Object.keys(data.motors).map(function (k) { return data.motors[k]; });
    }

    function getUsedMotors() {
      let program = Uzi.state.program.current;
      if (program == null) return new Set();
      // HACK(Richo): We are actually returning all the aliases, not just motors
      return new Set(program.ast.imports.map(imp => imp.alias));
    }

    function getDefaultMotor() {
      let data = getFormData();
      let motorNames = new Set(data.map(function (m) { return m.name; }));
      let motor = { name: "motor", enable: "D10", fwd: "D9", bwd: "D8" };
      let i = 1;
      while (motorNames.has(motor.name)) {
        motor.name = "motor" + i;
        i++;
      }
      return motor;
    }

    function appendMotorRow(i, motor, usedMotors) {

      function createTextInput(motorName, controlName) {
        let input = $("<input>")
          .attr("type", "text")
          .addClass("form-control")
          .addClass("text-center")
          .attr("name", controlName);
        input.get(0).value = motorName;
        return input;
      }
      function createPinDropdown(motorPin, motorName) {
        let select = $("<select>")
          .addClass("form-control")
          .attr("name", motorName);
        Uzi.state.pins.available.forEach(function (pin) {
          select.append($("<option>").text(pin.name));
        });
        select.get(0).value = motorPin;
        return select;
      }
      function createRemoveButton(row) {
        var btn = $("<button>")
          .addClass("btn")
          .addClass("btn-sm")
          .attr("type", "button")
          .append($("<i>")
            .addClass("fas")
            .addClass("fa-minus"));

        if (usedMotors.has(motor.name)) {
          btn
            //.attr("disabled", "true")
            .addClass("btn-outline-secondary")
            .attr("data-toggle", "tooltip")
            .attr("data-placement", "left")
            .attr("title", "This motor is being used by the program!")
            .on("click", function () {
              btn.tooltip("toggle");
            });
        } else {
          btn
            .addClass("btn-outline-danger")
            .on("click", function () { row.remove(); });
        }
        return btn;
      }
      let tr = $("<tr>")
        .append($("<input>").attr("type", "hidden").attr("name", "motors[" + i + "][index]").attr("value", i))
        .append($("<td>").append(createTextInput(motor.name, "motors[" + i + "][name]")))
        .append($("<td>").append(createPinDropdown(motor.enable, "motors[" + i + "][enable]")))
        .append($("<td>").append(createPinDropdown(motor.fwd, "motors[" + i + "][fwd]")))
        .append($("<td>").append(createPinDropdown(motor.bwd, "motors[" + i + "][bwd]")))
      tr.append($("<td>").append(createRemoveButton(tr)));
      $("#blockly-motors-modal-container-tbody").append(tr);
    }

    $("#add-motor-row-button").on("click", function () {
      let data = getFormData();
      let nextIndex = data.length == 0 ? 0: 1 + Math.max.apply(null, data.map(function (m) { return m.index; }));
      appendMotorRow(nextIndex, getDefaultMotor(), getUsedMotors());
    });

    UziBlock.getWorkspace().registerButtonCallback("configureDCMotors", function () {
      // Build modal UI
      $("#blockly-motors-modal-container-tbody").html("");
      let allMotors = UziBlock.getMotors();
      let usedMotors = getUsedMotors();
      if (allMotors.length == 0) {
        appendMotorRow(0, getDefaultMotor(), usedMotors);
      } else {
        allMotors.forEach(function (motor, i) {
          appendMotorRow(i, motor, usedMotors);
        });
      }
      $("#blockly-motors-modal").modal("show");
    });

    $("#blockly-motors-modal").on("hide.bs.modal", function () {
      let data = getFormData();
      UziBlock.setMotors(data);
      UziBlock.refreshToolbox();
      saveToLocalStorage();
    });

    $("#blockly-motors-modal-container").on("submit", function (e) {
      e.preventDefault();
      $("#blockly-motors-modal").modal("hide");
    });
  }

  function initializeBlocklySonarsModal() {
    function getFormData() {
      let data = $("#blockly-sonars-modal-container").serializeJSON();
      if (data.sonars == undefined) return [];
      return Object.keys(data.sonars).map(function (k) { return data.sonars[k]; });
    }

    function getUsedSonars() {
      let program = Uzi.state.program.current;
      if (program == null) return new Set();
      // HACK(Richo): We are actually returning all the aliases, not just sonars
      return new Set(program.ast.imports.map(imp => imp.alias));
    }

    function getDefaultSonar() {
      let data = getFormData();
      let sonarNames = new Set(data.map(function (m) { return m.name; }));
      let sonar = { name: "sonar", trig: "D11", echo: "D12", maxDist: "200" };
      let i = 1;
      while (sonarNames.has(sonar.name)) {
        sonar.name = "sonar" + i;
        i++;
      }
      return sonar;
    }

    function appendSonarRow(i, sonar, usedSonars) {

      function createTextInput(controlValue, controlName) {
        let input = $("<input>")
          .attr("type", "text")
          .addClass("form-control")
          .addClass("text-center")
          .attr("name", controlName);
        input.get(0).value = controlValue;
        return input;
      }
      function createPinDropdown(sonarPin, sonarName) {
        let select = $("<select>")
          .addClass("form-control")
          .attr("name", sonarName);
        Uzi.state.pins.available.forEach(function (pin) {
          select.append($("<option>").text(pin.name));
        });
        select.get(0).value = sonarPin;
        return select;
      }
      function createRemoveButton(row) {
        var btn = $("<button>")
          .addClass("btn")
          .addClass("btn-sm")
          .attr("type", "button")
          .append($("<i>")
            .addClass("fas")
            .addClass("fa-minus"));

        if (usedSonars.has(sonar.name)) {
          btn
            //.attr("disabled", "true")
            .addClass("btn-outline-secondary")
            .attr("data-toggle", "tooltip")
            .attr("data-placement", "left")
            .attr("title", "This sonar is being used by the program!")
            .on("click", function () {
              btn.tooltip("toggle");
            });
        } else {
          btn
            .addClass("btn-outline-danger")
            .on("click", function () { row.remove(); });
        }
        return btn;
      }
      let tr = $("<tr>")
        .append($("<input>").attr("type", "hidden").attr("name", "sonars[" + i + "][index]").attr("value", i))
        .append($("<td>").append(createTextInput(sonar.name, "sonars[" + i + "][name]")))
        .append($("<td>").append(createPinDropdown(sonar.trig, "sonars[" + i + "][trig]")))
        .append($("<td>").append(createPinDropdown(sonar.echo, "sonars[" + i + "][echo]")))
        .append($("<td>").append(createTextInput(sonar.maxDist, "sonars[" + i + "][maxDist]")))
      tr.append($("<td>").append(createRemoveButton(tr)));
      $("#blockly-sonars-modal-container-tbody").append(tr);
    }

    $("#add-sonar-row-button").on("click", function () {
      let data = getFormData();
      let nextIndex = data.length == 0 ? 0: 1 + Math.max.apply(null, data.map(function (m) { return m.index; }));
      appendSonarRow(nextIndex, getDefaultSonar(), getUsedSonars());
    });

    UziBlock.getWorkspace().registerButtonCallback("configureSonars", function () {
      // Build modal UI
      $("#blockly-sonars-modal-container-tbody").html("");
      let allSonars = UziBlock.getSonars();
      let usedSonars = getUsedSonars();
      if (allSonars.length == 0) {
        appendSonarRow(0, getDefaultSonar(), usedSonars);
      } else {
        allSonars.forEach(function (sonar, i) {
          appendSonarRow(i, sonar, usedSonars);
        });
      }
      $("#blockly-sonars-modal").modal("show");
    });

    $("#blockly-sonars-modal").on("hide.bs.modal", function () {
      let data = getFormData();
      UziBlock.setSonars(data);
      UziBlock.refreshToolbox();
      saveToLocalStorage();
    });

    $("#blockly-sonars-modal-container").on("submit", function (e) {
      e.preventDefault();
      $("#blockly-sonars-modal").modal("hide");
    });
  }

  function initializeBlocklyVariablesModal() {
    function getFormData() {
      let data = $("#blockly-variables-modal-container").serializeJSON();
      if (data.variables == undefined) return [];
      return Object.keys(data.variables).map(function (k) { return data.variables[k]; });
    }

    function getDefaultVariable() {
      let data = getFormData();
      let variableNames = new Set(data.map(function (m) { return m.name; }));
      let variable = {name: "variable"};
      let i = 1;
      while (variableNames.has(variable.name)) {
        variable.name = "variable" + i;
        i++;
      }
      return variable;
    }

    function appendVariableRow(i, variable, usedVariables) {

      function createTextInput(controlValue, controlName) {
        let input = $("<input>")
          .attr("type", "text")
          .addClass("form-control")
          .addClass("text-center")
          .attr("name", controlName);
        input.get(0).value = controlValue;
        return input;
      }
      function createRemoveButton(row) {
        var btn = $("<button>")
          .addClass("btn")
          .addClass("btn-sm")
          .attr("type", "button")
          .append($("<i>")
            .addClass("fas")
            .addClass("fa-minus"));

        if (usedVariables.has(variable.name)) {
          btn
            //.attr("disabled", "true")
            .addClass("btn-outline-secondary")
            .attr("data-toggle", "tooltip")
            .attr("data-placement", "left")
            .attr("title", "This variable is being used by the program!")
            .on("click", function () {
              btn.tooltip("toggle");
            });
        } else {
          btn
            .addClass("btn-outline-danger")
            .on("click", function () { row.remove(); });
        }
        return btn;
      }
      let tr = $("<tr>")
        .append($("<input>").attr("type", "hidden").attr("name", "variables[" + i + "][index]").attr("value", i))
        .append($("<td>").append(createTextInput(variable.name, "variables[" + i + "][name]")))
      tr.append($("<td>").append(createRemoveButton(tr)));
      $("#blockly-variables-modal-container-tbody").append(tr);
    }

    $("#add-variable-row-button").on("click", function () {
      let data = getFormData();
      let nextIndex = data.length == 0 ? 0: 1 + Math.max.apply(null, data.map(function (m) { return m.index; }));
      appendVariableRow(nextIndex, getDefaultVariable(), UziBlock.getUsedVariables());
    });

    UziBlock.getWorkspace().registerButtonCallback("configureVariables", function () {
      // Build modal UI
      $("#blockly-variables-modal-container-tbody").html("");
      let allVariables = UziBlock.getVariables();
      let usedVariables = UziBlock.getUsedVariables();
      if (allVariables.length == 0) {
        appendVariableRow(0, getDefaultVariable(), usedVariables);
      } else {
        allVariables.forEach(function (variable, i) {
          appendVariableRow(i, variable, usedVariables);
        });
      }
      $("#blockly-variables-modal").modal("show");
    });

    $("#blockly-variables-modal").on("hide.bs.modal", function () {
      let data = $("#blockly-variables-modal-container").serializeJSON();
      let temp = [];
      for (let i in data.variables) {
        temp.push(data.variables[i]);
      }
      // TODO(Richo): Check program and rename/disable variable blocks accordingly
      UziBlock.setVariables(temp);
      UziBlock.refreshToolbox();
      saveToLocalStorage();
    });

    $("#blockly-variables-modal-container").on("submit", function (e) {
      e.preventDefault();
      $("#blockly-variables-modal").modal("hide");
    });
  }

  function initializeCodePanel() {
		codeEditor = ace.edit("code-editor");
		codeEditor.setTheme("ace/theme/ambiance");
		codeEditor.getSession().setMode("ace/mode/uzi");
    codeEditor.setReadOnly(true); // TODO(Richo): Only for now...
    Uzi.on("update", function () {
      let src = Uzi.state.program.current.src;
      if (src == undefined) return;
      if (codeEditor.getValue() !== src) {
        codeEditor.setValue(src, 1);
      }
    });
  }

  function initializeOutputPanel() {
    Uzi.on("update", function () {
      Uzi.state.output.forEach(function (entry) {
        appendToOutput(entry.text, entry.type);
      });
    });
  }

  function initializeAutorun() {
    setInterval(autorun, 150);
  }

  function initializeInternationalization() {
    i18n.init(TRANSLATIONS);
    i18n.currentLocale("es");
    $("#spinner-container").hide();
  }

  function initializeBrokenLayoutErrorModal() {
    $("#fix-broken-layout-button").on("click", function () {
      initializeDefaultLayout();
      $("#broken-layout-modal").modal("hide");
    });
  }

  function initializeServerNotFoundErrorModal() {
    Uzi.on("server-disconnect", function () {
      $("#server-not-found-modal").modal('show');
    });
    setInterval(function () {
      if (Uzi.serverAvailable) {
        $("#server-not-found-modal").modal('hide');
      }
    }, 1000);
  }

  function initializeOptionsModal() {
    $("#restore-layout-button").on("click", initializeDefaultLayout);

    $('input[name="language-radios"]:radio').change(function () {
      i18n.currentLocale(this.value);
    });
    i18n.on("change", function () {
      let locale = i18n.currentLocale();
      $('input[name="language-radios"]:radio').each(function () {
        let val = $(this).val();
        if (locale.startsWith(val)) {
          $(this).prop("checked", true);
        }
      });
      console.log(locale);
    });
  }

  function checkBrokenLayout() {
    if (layout.config.content.length > 0) return;

    setTimeout(function () {
      if (layout.config.content.length > 0) return;
      $("#broken-layout-modal").modal("show");
    }, 1000);
  }

  function appendToOutput(text, type) {
    let css = {
      info: "text-white",
      success: "text-success",
      error: "text-danger",
      warning: "text-warning"
    };

    let entry = $("<div>")
      .addClass("small")
      .addClass(css[type]);
    if (text) { entry.text(text); }
    else { entry.html("&nbsp;"); }

    $("#output-console").append(entry);

    // Scroll to bottom
    let panel = $("#output-panel").get(0);
    panel.scrollTop = panel.scrollHeight - panel.clientHeight;
  }

  function resizeBlockly() {
    UziBlock.resizeWorkspace();
  }

	function restoreFromLocalStorage() {
    try {
      let ui = {
        settings: JSON.parse(localStorage["uzi.settings"] || "null"),
        layout: JSON.parse(localStorage["uzi.layout"] || "null"),
        blockly: JSON.parse(localStorage["uzi.blockly"] || "null"),
      };
      setUIState(ui);
    } catch (err) {
      console.log(err);
    }
	}

  function saveToLocalStorage() {
    if (UziBlock.getWorkspace() == undefined || layout == undefined) return;

    let ui = getUIState();
    localStorage["uzi.settings"] = JSON.stringify(ui.settings);
    localStorage["uzi.layout"] = JSON.stringify(ui.layout);
    localStorage["uzi.blockly"] = JSON.stringify(ui.blockly);
  }

  function getUIState() {
    return {
      settings: {
        interactive: $("#interactive-checkbox").get(0).checked,
      },
      layout: layout.toConfig(),
      blockly: UziBlock.getDataForStorage(),
    };
  }

  function setUIState(ui) {
    try {
      if (ui.settings) {
        $("#interactive-checkbox").get(0).checked = ui.settings.interactive;
      }

      if (ui.layout) {
        initializeLayout(ui.layout);
      }

      if (ui.blockly) {
        UziBlock.setDataFromStorage(ui.blockly);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function newProject() {
		if (confirm("You will lose all your unsaved changes. Are you sure?")) {
			UziBlock.getWorkspace().clear();
		}
  }

  function openProject() {
    let input = $("#open-file-input").get(0);
    input.onchange = function () {
      let file = input.files[0];
      input.value = null;
      if (file === undefined) return;

      let reader = new FileReader();
      reader.onload = function(e) {
        try {
          let json = e.target.result;
          let ui = JSON.parse(json);
          setUIState(ui);
        } catch (err) {
          console.log(err);
          appendToOutput("Error attempting to read the project file", "error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function saveProject() {
    lastFileName = prompt("File name:", lastFileName || "program.phb");
    if (lastFileName === null) return;
    if (!lastFileName.endsWith(".phb")) {
      lastFileName += ".phb";
    }
    try {
      let ui = getUIState();
      let json = JSON.stringify(ui);
      var blob = new Blob([json], {type: "text/plain;charset=utf-8"});
      saveAs(blob, lastFileName);
    } catch (err) {
      console.log(err);
      appendToOutput("Error attempting to write the project file", "error");
    }
  }

  function choosePort() {
    let value = $("#port-dropdown").val();
    if (value == "other") {
      let defaultOption = selectedPort == "automatic" ? "" : selectedPort;
      value = prompt("Port name:", defaultOption);
      if (!value) { value = selectedPort; }
    }
    setSelectedPort(value);
  }

  function setSelectedPort(val) {
    selectedPort = val;
    if ($("#port-dropdown option[value='" + selectedPort + "']").length <= 0) {
      $("<option>")
        .text(selectedPort)
        .attr("value", selectedPort)
        .insertBefore("#port-dropdown-divider");
    }
    $("#port-dropdown").val(selectedPort);
  }

  function connect() {
    $("#connect-button").attr("disabled", "disabled");
    Uzi.connect(selectedPort);
  }

  function disconnect() {
    $("#disconnect-button").attr("disabled", "disabled");
    Uzi.disconnect();
  }

  function verify() {
    Uzi.compile(getGeneratedCodeAsJSON(), "json").then(success).catch(error);
  }

  function run() {
		Uzi.run(getGeneratedCodeAsJSON(), "json").then(success).catch(error);
  }

  function install() {
    Uzi.install(getGeneratedCodeAsJSON(), "json");
  }

  function toggleInteractive() {
    scheduleAutorun($("#interactive-checkbox").get(0).checked);
    saveToLocalStorage();
  }

  function openOptionsDialog() {
    $("#options-modal").modal("show");
  }

  function openInspectorPinDialog() {
    buildPinInspectorDialog();
    $("#inspector-pin-modal").modal("show");
  }

  function openInspectorGlobalDialog() {
    buildGlobalInspectorDialog();
    $("#inspector-global-modal").modal("show");
  }

  function updateConnection (newState, previousState) {
    if (previousState == null
        || (!previousState.isConnected && newState.isConnected)) {
      scheduleAutorun(true);
    }
  }

	function scheduleAutorun(forced) {
		var currentTime = +new Date();
		autorunNextTime = currentTime + 150;
    if (forced) { lastProgram = null; }
	}

  function success() {
    $(document.body).css("border", "4px solid black");
  }

  function error() {
    $(document.body).css("border", "4px solid red");
  }

	function autorun() {
    if (Uzi.state == undefined) return;
		if (autorunNextTime === undefined) return;

		let currentTime = +new Date();
		if (currentTime < autorunNextTime) return;
    autorunNextTime = undefined;

		let currentProgram = getGeneratedCodeAsJSON();
		if (currentProgram === lastProgram) return;
    lastProgram = currentProgram;

    let interactiveEnabled = $("#interactive-checkbox").get(0).checked;
    if (Uzi.state.isConnected && interactiveEnabled) {
      Uzi.run(currentProgram, "json", true).then(success).catch(error);
    } else {
      Uzi.compile(currentProgram, "json", true).then(success).catch(error);
    }
	}

  function getGeneratedCodeAsJSON() {
    var code = UziBlock.getGeneratedCode();
    return JSON.stringify(code);
  }

  function updateTopBar() {
    if (Uzi.state.isConnected) {
      $("#connect-button").hide();
      $("#disconnect-button").show();
      $("#disconnect-button").attr("disabled", null);
      $("#port-dropdown").attr("disabled", "disabled");
      $("#run-button").attr("disabled", null);
      $("#install-button").attr("disabled", null);
      setSelectedPort(Uzi.state.portName);
    } else {
      $("#disconnect-button").hide();
      $("#connect-button").show();
      $("#connect-button").attr("disabled", null);
      $("#port-dropdown").attr("disabled", null);
      $("#run-button").attr("disabled", "disabled");
      $("#install-button").attr("disabled", "disabled");
    }
  }

  function updateInspectorPanel() {
    updatePinsPanel();
    updateGlobalsPanel();
    updateTasksPanel();
  }

  function updatePinsPanel() {
    updateValuesPanel(Uzi.state.pins, $("#pins-table tbody"), $("#no-pins-label"), "pin");
  }

  function updateGlobalsPanel() {
    updateValuesPanel(Uzi.state.globals, $("#globals-table tbody"), $("#no-globals-label"), "global");
  }

  function updateValuesPanel(values, $container, $emptyLabel, itemPrefix) {
    let reporting = new Set();
    values.available.forEach(function (val) {
      if (val.reporting) { reporting.add(val.name); }
    });

    if (reporting.size == 0) {
      $emptyLabel.show();
      $container.html("");
      return;
    } else {
      $emptyLabel.hide();
    }

    function getElementId(val) { return itemPrefix + "-" + val.name; }

    // NOTE(Richo): The value could have ".", which bothers JQuery but works with document.getElementById
    function getElement(val) { return $(document.getElementById(getElementId(val))); }

    function initializePanel() {
      $container.html("");
      values.available.forEach(function (val) {
        if (val.reporting) {
          let $row = $("<tr>")
            .append($("<td>")
              .addClass("pl-4")
              .html('<i class="fas fa-eye"></i>'))
            .append($("<td>")
              .text(val.name))
            .append($("<td>")
              .addClass("text-right")
              .addClass("pr-4")
              .addClass("text-muted")
              .attr("id", getElementId(val))
              .text("?"));
          $container.append($row);
        }
      });
    };

    if (values.available
        .filter(function (val) { return val.reporting; })
        .some(function (val) {
          let $item = getElement(val);
          return $item.get(0) == undefined;
        })) {
      initializePanel();
    }

    values.elements.forEach(function (val) {
      if (reporting.has(val.name)) {
        let $item = getElement(val);
        if ($item.get(0) == undefined) { initializePanel(); }

        let old = $item.data("old-value");
        let cur = val.value;
        if (cur != null && cur != old && Uzi.state.isConnected) {
          $item.data("old-value", cur);
          $item.data("last-update", +new Date());
          $item.removeClass("text-muted");
        } else {
          let lastUpdate = $item.data("last-update") || 0;
          let now = +new Date();
          if (now - lastUpdate > 2500) {
            $item.addClass("text-muted");
          }
        }

        if (cur != null) {
          if (cur == Infinity) {
            $item.text("∞");
          } else if (cur == -Infinity) {
            $item.text("-∞");
          } else if (isNaN(cur)) {
            $item.text("NaN");
          } else {
            $item.text(cur.toFixed(2));
          }
        } else {
          $item.text("?");
        }
      }
    });

    values.available.forEach(function (val) {
      if (!reporting.has(val.name)) {
        let $item = getElement(val);
        if ($item != undefined) { $item.parent().remove(); }
      }
    });
  }

  function updateTasksPanel() {
    // TODO(Richo): Update in place, don't clear and recreate.
    $("#tasks-table tbody").html("");
    if (!Uzi.state.isConnected) return;

    for (let i = 0; i < Uzi.state.tasks.length; i++) {
      let task = Uzi.state.tasks[i];
      let css = "text-muted";
      let html = "";
      if (task.isError) {
        css = "text-warning";
        html = '<i class="fas fa-skull-crossbones mr-2"></i>error';
      } else if (task.isRunning) {
        css = "text-success";
        html = '<i class="fas fa-running mr-2"></i>running';
      } else {
        css = "text-danger";
        html = '<i class="fas fa-hand-paper mr-2"></i>stopped';
      }
      $("#tasks-table tbody")
        .append($("<tr>")
          .append($("<td>")
            .addClass("pl-4")
            .text(task.scriptName))
          .append($("<td>")
            .addClass(css)
            .html(html)));
    }
  }

  function buildPinInspectorDialog() {
    let container = $("#inspector-pin-modal-container");
    container.html("");

    let ncols = 6;
    let row;

    function buildInput (pin, index) {
      if (index % ncols == 0) {
        row = $("<div>").addClass("row");
        container.append(row);
      }
      let id = pin.name + "-checkbox";
      let input = $("<input>")
        .attr("type", "checkbox")
        .attr("id", id)
        .attr("name", "pins-checkbox")
        .attr("value", pin.name)
        .addClass("custom-control-input");
      input.get(0).checked = pin.reporting;
      input.on("change", function () {
        let reportEnabled = this.checked;
        Uzi.setPinReport([pin.name], [reportEnabled]);
      });

      row.append($("<div>")
        .addClass("col-" + (12 / ncols))
        .append($("<div>")
          .addClass("custom-control")
          .addClass("custom-checkbox")
          .addClass("custom-control-inline")
          .append(input)
          .append($("<label>")
            .addClass("custom-control-label")
            .attr("for", id)
            .text(pin.name))));
    }

    // Digital pins
    container.append($("<h6>").text("Digital:"));
    Uzi.state.pins.available
      .filter(function (pin) { return pin.name.startsWith("D"); })
      .forEach(buildInput);

    // Analog pins
    container.append($("<h6>").addClass("mt-4").text("Analog:"));
    Uzi.state.pins.available
      .filter(function (pin) { return pin.name.startsWith("A"); })
      .forEach(buildInput);
  }

  function buildGlobalInspectorDialog() {
    let container = $("#inspector-global-modal-container");
    container.html("");

    let ncols = 6;
    let row;

    function buildInput (global, index) {
      if (index % ncols == 0) {
        row = $("<div>").addClass("row");
        container.append(row);
      }
      let id = "global-" + global.name + "-checkbox";
      let input = $("<input>")
        .attr("type", "checkbox")
        .attr("id", id)
        .attr("name", "globals-checkbox")
        .attr("value", global.name)
        .addClass("custom-control-input");
      input.get(0).checked = global.reporting;
      input.on("change", function () {
        let reportEnabled = this.checked;
        Uzi.setGlobalReport([global.name], [reportEnabled]);
      });

      row.append($("<div>")
        .addClass("col-" + (12 / ncols))
        .append($("<div>")
          .addClass("custom-control")
          .addClass("custom-checkbox")
          .addClass("custom-control-inline")
          .append(input)
          .append($("<label>")
            .addClass("custom-control-label")
            .attr("for", id)
            .text(global.name))));
    }

    container.append($("<h6>").text("Global:"));
    let globals = Uzi.state.globals.available;
    if (globals.length == 0) {
      container.append($("<i>").text("* No globals found *"));
    } else {
      Uzi.state.globals.available.forEach(buildInput);
    }
  }

  return IDE;
})();
