var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
    return query_string;
}();

var comm = new Icecomm('OEPs1Gvg8qHtrE8q3OniMGdYUxqScxZ5gXbE7lHr4guAugJk');
var roomName;
if(QueryString.room){
    roomName = QueryString.room.replace('/','');
}else{
    var roomName = prompt("You are the host! Please enter a room name:");
    document.location.search = "?room=" + roomName;
}


comm.connect(roomName, {audio: true});

var z  = 10;
comm.on('connected', function(peer) {

    var c = document.getElementById('container');
    var el = peer.getVideo();
    var div = document.createElement('div');
    div.appendChild(el);
    div.setAttribute("id", peer.callerID);
    div.className = "resizeDiv draggable";
    div.onmousedown = function(){
    	z += 1;
    	this.style.zIndex = z;
    };
    var draggie = new Draggabilly(div, {
      containment: '#container'
    });
    c.appendChild(div);
});

comm.on('local', function(options) {
    console.log("roomName", roomName);
  	localVideo.src = options.stream;
});

comm.on('disconnect', function(options) {
    var el = document.getElementById(options.callerID);
    el.parentNode.removeChild(el);
});

var feed = document.getElementById("feed");
comm.on('data', function(options){
	var isScrolledToBottom = feed.scrollHeight - feed.clientHeight <= feed.scrollTop + 1;
	var p = document.createElement('p');
    var name = options.data.name ? options.data.name : options.callerID.replace("-","");
	p.innerHTML = "<b class=\"peerMessage\">" + name + "</b><br>" + Autolinker.link(options.data.msg) + "<hr>";
	feed.appendChild(p);
	if(isScrolledToBottom) feed.scrollTop = feed.scrollHeight - feed.clientHeight;
});

$('textarea').on('keydown', function(e) {
    if (e.which == 13) {
        e.preventDefault();
        if(comm.getLocalID() && e.currentTarget.value.length > 0){
	        comm.send({ name: $('#name').val(), msg: e.currentTarget.value });
			var isScrolledToBottom = feed.scrollHeight - feed.clientHeight <= feed.scrollTop + 1;
			var p = document.createElement('p');
			p.innerHTML = "<b>Me</b><br>" + Autolinker.link(e.currentTarget.value) + "<hr>";
			feed.appendChild(p);
	        if(isScrolledToBottom)
	        	feed.scrollTop = feed.scrollHeight - feed.clientHeight;
	        e.currentTarget.value = "";
    	}
    }
});
