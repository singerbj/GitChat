var QueryString = function() {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();


var GitChat = angular.module('GitChat', []);

GitChat.controller('ChatController', ["$scope", function($scope) {
    var self = this;
    self.peers = [];
    self.messages = [];

    var comm = new Icecomm('OEPs1Gvg8qHtrE8q3OniMGdYUxqScxZ5gXbE7lHr4guAugJk');
    var roomName;
    if (QueryString.room) {
        roomName = QueryString.room.replace('/', '');
    } else {
        roomName = prompt("No room specified to join! Please enter a new room name:");
        document.location.search = "?room=" + roomName;
    }

    comm.connect(roomName, {
        audio: true
    });

    comm.on('connected', function(peer) {
        console.log(peer, peer.getVideo());
        self.peers.push(peer);
        $scope.$apply();
    });

    comm.on('local', function(options) {
        localVideo.src = options.stream;
    });

    comm.on('disconnect', function(peer) {

        for (var i = 0; i < self.peers.length; i++) {
            if (self.peers[i].callerID === peer.callerID) {
                self.peers.splice(i, 1);
                break;
            }
        }
        $scope.$apply();
    });

    comm.on('data', function(options) {
        self.scrollFeed(function(){
            if (options.data.msg) {
                self.messages.push(options.data);
                $scope.$apply();
            }
        });
    });

    self.sendMessage = function() {
        self.scrollFeed(function(){
            if (self.message.length > 0) {
                var msg = {
                    name: self.name,
                    msg: self.message
                };
                comm.send(msg);
                msg.name = "Me";
                self.messages.push(msg);
                self.message = "";
            }
        });
    };


    self.scrollFeed = function(callback){
        $scope.$evalAsync(function() {
            var feed = $('#feed');
            // var isScrolledToBottom = feed[0].scrollHeight - feed[0].clientHeight <= feed[0].scrollTop + 1;
            // console.log(isScrolledToBottom);
            callback();
            // if(isScrolledToBottom) feed[0].scrollTop = feed[0].scrollHeight - feed[0].clientHeight;
            setTimeout(function(){
                feed[0].scrollTop = feed[0].scrollHeight - feed[0].clientHeight;
            }, 100);
        });
    };
}]);

GitChat.filter('trustUrl', function($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
});

GitChat.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});
