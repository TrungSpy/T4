angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };


    var socket = io('http://47.89.50.63:3000/');
    alert('Hello world');
    socket.on('connection', function(socket) {
        alert('a user connected');
        socket.on('disconnect', function() {
            console.log('user disconnected');
        });
    });
    socket.emit('hello', 'world');
    socket.on('hello', function(msg) {
        console.log(msg);
        alert(msg);
    });
});