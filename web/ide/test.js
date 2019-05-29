$(document).ready(function () {
  var config = {
      settings: {
        showPopoutIcon: false,
        showMaximiseIcon: false,
        showCloseIcon: false,
      },
      content: [{
          type: 'row',
          content:[{
              type: 'component',
              componentName: 'testComponent',
              componentState: { label: 'A', id: '#connection-panel' },
              title: 'Connection',
              width: 20,
          },{
              type: 'column',
              content:[{
                  type: 'component',
                  componentName: 'testComponent',
                  componentState: { label: 'B', id: '#test2' },
              },{
                  type: 'component',
                  componentName: 'testComponent',
                  componentState: { label: 'C', id: '#test3' },
                  title: 'prueba',
              }]
          }]
      }]
  };

  var layout = new GoldenLayout(config, "#container");

  layout.registerComponent('testComponent', function(container, state) {
      let $el = $(state.id);
      container.getElement().append($el);
  });

  function updateSize() {
    let w = window.innerWidth;
    let h = window.innerHeight - $("#top-bar").height();
    if (layout.width != w || layout.height != h) {
      layout.updateSize(w, h);
    }
  };

  window.onresize = updateSize;
  layout.on('stateChanged', updateSize);
  layout.init();
  updateSize();

  let selectedPort = "automatic";
  $("#port-dropdown").change(function(){
    var value = $(this).val();
    if (value == "other") {
      let selection = prompt("Port name:", selectedPort);
      if (selection != null) {
        selectedPort = selection;
      }
      if ($("#port-dropdown option[value='" + selectedPort + "']").length <= 0) {
        $("<option>")
          .text(selectedPort)
          .attr("value", selectedPort)
          .insertBefore("#port-dropdown-divider");
      }
    } else {
      selectedPort = value;
    }
    $(this).val(selectedPort);
  });


  $("#connect-button").on("click", function () {
    $(this).hide();
    $("#disconnect-button").show();
  });
  $("#disconnect-button").on("click", function () {
    $(this).hide();
    $("#connect-button").show();
  });
});
