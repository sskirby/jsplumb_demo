jQuery(function($) {
  $( ".resizable" ).resizable({
    handles: 'se',
    grid: [10, 10],
    resize: function(event, ui) {
      jsPlumb.repaint(event.target.id);
    }
  });
});

jsPlumb.ready(function() {
  console.log(jsPlumb.Defaults);
  jsPlumb.Defaults.Container = $("#drawing-area");
  jsPlumb.Defaults.Anchor = "Continuous";
  jsPlumb.Defaults.PaintStyle = { lineWidth: 1, strokeStyle: "#666" };
  jsPlumb.Defaults.Connector = "Straight";
  jsPlumb.Defaults.ConnectionOverlays = [["PlainArrow", {location: 1.0, width: 10, length: 20}]];
  jsPlumb.Defaults.Endpoint = "Rectangle";
  jsPlumb.Defaults.EndpointStyle = { width:10, height:10, fillStyle:'#666' };
  jsPlumb.Defaults.EndpointHoverStyle = { fillStyle:'red' };

  // enable draggin of elements (seems to just delegate to jQuery UI)
  jsPlumb.draggable($(".draggable"), { handle: "span", containment: "parent", grid: [10, 10] });

  // add existing connections
  jsPlumb.connect({
    source: "tenant-1", 
    target: "tenant-2",
    overlays: [
      ["Label", { label: "Standard Label", location: 0.5, cssClass: "connector-label" }]
    ]
  });

  // enable drag and drop connections
  var targetOptions = { 
    isTarget:true, 
    maxConnections:50
  };
  var sourceOptions = { isSource: true };
  $(".element").each(function(index) {
    jsPlumb.makeTarget($(this), targetOptions);
    jsPlumb.makeSource($(this).find('.connector-source'), { parent: $(this) }, sourceOptions);
  });

  // bind events
  jsPlumb.bind("beforeDrop", function(args) {
    // this is needed to prevent odd connections from appearing when the source is the same as the dest
    return args.sourceId !== args.targetId; 
  });

  var labelClickHandler = function(labelOverlay, originalEvent) {
    if(confirm("Do you want to remove the connection?")) {
      jsPlumb.detach(labelOverlay.component, { fireEvent: true });
    }
  };

  var index = 1;
  jsPlumb.bind("jsPlumbConnection", function(args) {
    args.connection.addOverlay(["Label", 
      { label: "New connection"+index, location: 0.5, cssClass: "connector-label", events: { click: labelClickHandler } }]);
    index+=1;
  });

  jsPlumb.bind("jsPlumbConnectionDetached", function(args) {
    console.log(args);
    console.log("connection removed or moved");
  });
});
