angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state, T4IO) {
    var socket = T4IO.getGlobalIO();
    socket.on('rooms', function(rooms) {
        console.log(rooms);
        $state.go('tab.chats', {
            "rooms": rooms
        });
    });
    $scope.ask = function(keywords) {
        console.log(keywords);
        socket.emit('topic', keywords);
    }
})

.controller('ChatsCtrl', function($scope, Chats, $stateParams, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    if ($stateParams && $stateParams.rooms) {
        console.log($stateParams.rooms);
    }
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };

    $scope.goChatroom = function(chatid) {
        $state.go('helloworld', {
            "rooms": null
        });
    }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

.controller('ChatroomCtrl', function($scope, $timeout, $ionicScrollDelegate, T4IO, $ionicHistory) {

        $scope.data = {};
        $scope.myId = '12345';
        $scope.messages = [];

        $scope.goBack = function() {
            $ionicHistory.goBack();
        }
        var socket = T4IO.getGlobalIO();

        socket.on('hello', function(msg) {
            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
            $scope.messages.push({
                userId: '54321', //other ID
                text: msg,
                time: d
            });
            $scope.$apply();
            $ionicScrollDelegate.scrollBottom(true);
        });

        $scope.hideTime = true;

        var alternate,
            isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

        $scope.sendMessage = function() {
            alternate = !alternate;

            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

            $scope.messages.push({
                userId: $scope.myId,
                text: $scope.data.message,
                time: d
            });
            socket.emit('hello', $scope.data.message);

            delete $scope.data.message;
            $ionicScrollDelegate.scrollBottom(true);

        };


        $scope.inputUp = function() {
            if (isIOS) $scope.data.keyboardHeight = 216;
            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        };

        $scope.inputDown = function() {
            if (isIOS) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        $scope.closeKeyboard = function() {
            // cordova.plugins.Keyboard.close();
        };

    })
    .factory('T4IO', function() {
        var t4io = null;
        if (!t4io) {
            t4io = io('http://47.89.50.63:3000/');
            t4io.on('connection', function(socket) {
                alert('a user connected');
                socket.on('disconnect', function() {
                    console.log('user disconnected');
                });
            });
        }
        var getGlobalIO = function() {
            if (!t4io) {
                t4io = io('http://47.89.50.63:3000/');
                socket.on('connection', function(socket) {
                    alert('a user connected');
                    socket.on('disconnect', function() {
                        console.log('user disconnected');
                    });
                });
            }
            return t4io;
        }
        return {
            getGlobalIO: getGlobalIO
        }
    })
    .directive('input', function($timeout) {
        return {
            restrict: 'E',
            scope: {
                'returnClose': '=',
                'onReturn': '&',
                'onFocus': '&',
                'onBlur': '&'
            },
            link: function(scope, element, attr) {
                element.bind('focus', function(e) {
                    if (scope.onFocus) {
                        $timeout(function() {
                            scope.onFocus();
                        });
                    }
                });
                element.bind('blur', function(e) {
                    if (scope.onBlur) {
                        $timeout(function() {
                            scope.onBlur();
                        });
                    }
                });
                element.bind('keydown', function(e) {
                    if (e.which == 13) {
                        if (scope.returnClose) element[0].blur();
                        if (scope.onReturn) {
                            $timeout(function() {
                                scope.onReturn();
                            });
                        }
                    }
                });
            }
        }
    });