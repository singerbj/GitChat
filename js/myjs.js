var comm = new Icecomm('NPxgHL3vfw3Lq7wchKeWZaYm056GAZo8rZjFKXcynTZNzVHhi');

comm.connect('custom room', {audio: true});

comm.on('connected', function(options) {
  console.log(options);
  var row = document.getElementById('row');
  var td = document.createElement('td');
  td.appendChild(options.video);
  row.appendChild(td);
});

comm.on('local', function(options) {
  localVideo.src = options.stream;
});

comm.on('disconnect', function(options) {
  document.getElementById(options.callerID).remove();
});
