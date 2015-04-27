
var comm = new Icecomm('OEPs1Gvg8qHtrE8q3OniMGdYUxqScxZ5gXbE7lHr4guAugJk');
comm.connect('customroom123', {audio: true});

var z  = 10;
comm.on('connected', function(options) {
    console.log(options);
    var c = document.getElementById('container');
    var el = options.video;
    var div = document.createElement('div');
    div.appendChild(el);
    div.setAttribute("id", options.callerID);
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
	p.innerHTML = "<b>" + options.callerID.replace("-","") + "</b><br>" + options.data + "<hr>";
	feed.appendChild(p);
	if(isScrolledToBottom) feed.scrollTop = feed.scrollHeight - feed.clientHeight;
});

$('textarea').on('keydown', function(e) {
    if (e.which == 13) {
        e.preventDefault();
        if(comm.getLocalID() && e.currentTarget.value.length > 0){        
	        comm.send(e.currentTarget.value);
			var isScrolledToBottom = feed.scrollHeight - feed.clientHeight <= feed.scrollTop + 1;
			var p = document.createElement('p');
			p.innerHTML = "<b>Me</b><br>" + e.currentTarget.value + "<hr>";
			feed.appendChild(p);
	        if(isScrolledToBottom) 
	        	feed.scrollTop = feed.scrollHeight - feed.clientHeight;
	        e.currentTarget.value = "";
    	}
    }
});
