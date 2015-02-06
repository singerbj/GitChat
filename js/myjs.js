
var comm = new Icecomm('NPxgHL3vfw3Lq7wchKeWZaYm056GAZo8rZjFKXcynTZNzVHhi');
comm.connect('custom room', {audio: true});

comm.on('connected', function(options) {
    console.log(options);
    var c = document.getElementById('container');
    var el = options.video;
    var div = document.createElement('div');
    div.appendChild(el);
    div.setAttribute("id", options.callerID);
    div.className = "resizeDiv draggable";
    var draggie = new Draggabilly(div, {
      containment: '#container'
    });
    c.appendChild(div);
});

comm.on('local', function(options) {
  	localVideo.src = options.stream;
});

comm.on('disconnect', function(options) {
    var el = document.getElementById(options.callerID);
    el.parentNode.removeChild(el);
});
