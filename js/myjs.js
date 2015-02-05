var comm = new Icecomm('NPxgHL3vfw3Lq7wchKeWZaYm056GAZo8rZjFKXcynTZNzVHhi');
comm.connect('custom room', {audio: true});

var peers = [];

var render = function(){
	console.log("peers", peers);
	var row1 = [];
	var row2 = [];
	if(peers.length > 0){
		row1 = [peers[0], peers[1]];
		if(peers.length > 2){
			row2 = [peers[2], peers[3]];
		}
		console.log(row1, row2);
	}
	var table = document.getElementById('table');
	while (table.firstChild) {
	    table.removeChild(table.firstChild);
	}
	var tr = document.createElement('tr');
	for(var i = 0; i < row1.length; i++){
		if(row1[i]){
			var td = document.createElement('td');
			td.appendChild(row1[i].el);
			tr.appendChild(td);		
			table.appendChild(tr);
		}
	}
	var tr = document.createElement('tr');
	for(var i = 0; i < row2.length; i++){
		if(row2[i]){
			var td = document.createElement('td');
			td.appendChild(row2[i].el);
			tr.appendChild(td);
			table.appendChild(tr);		
		}
	}
	table.appendChild(tr);	
};

comm.on('connected', function(options) {
	console.log(options);
	if(peers.length < 4){
		peers.push({ id: options.callerID, el: options.video });
		render();
	}
	
});

comm.on('local', function(options) {
  	localVideo.src = options.stream;
});

comm.on('disconnect', function(options) {
	console.log(options);
	for(var i = 0; i < peers.length; i++){
		if(peers[i].id === options.callerID){
			peers.splice(i, 1);
			break;
		}		
	}
	render();
});
