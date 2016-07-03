angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state, T4IO, $ionicPopup) {
    var socket = T4IO.getGlobalIO();
    socket.on('rooms', function(rooms) {
        console.log(rooms);
        $state.go('tab.chats', {
            "rooms": JSON.parse(rooms)
        });
    });
    var showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: '',
            template: 'Please enter the question you want to ask.'
        });

        alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };
    $scope.ask = function(keywords) {
        console.log(keywords);
        if (keywords && keywords.trim() != "") {
            socket.emit('topic', keywords);
        } else {
            showAlert();
        }
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
        $scope.chats = $stateParams.rooms;
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

.controller('ChatroomCtrl', function($scope, $timeout, $ionicScrollDelegate, T4IO, $ionicHistory, $stateParams, $ionicPopup) {

        $scope.data = {};
        $scope.myId = '12345';
        $scope.messages = [];

        function makename() {
            var text = "";
            var possible = "abcdefghijklmnopqrstuvwxyz";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
        var myname = makename();

        $scope.goBack = function() {
            $ionicHistory.goBack();
        }
        var socket = T4IO.getGlobalIO();

        if ($stateParams && $stateParams.room_name) {
            console.log($stateParams.room_name);
            socket.emit('enter_room', $stateParams.room_name);
            socket.on('enter_room_finished', function(msg) {
                console.log(msg);
            });
        }

        socket.on('hello', function(msg) {
          var get_message = JSON.parse(msg);
            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
            $scope.messages.push({
                userId: '54321', //other ID
                text: get_message.message,
                time: d,
                name: get_message.name
            });
            $scope.$apply();
            $ionicScrollDelegate.scrollBottom(true);
        });

        $scope.hideTime = true;

        var alternate,
            isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

        var showAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: '',
                template: 'Please enter message.'
            });

            alertPopup.then(function(res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

        $scope.sendMessage = function() {
            if ($scope.data.message && $scope.data.message.trim() != "") {
                alternate = !alternate;

                var d = new Date();
                d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

                $scope.messages.push({
                    userId: $scope.myId,
                    text: $scope.data.message,
                    time: d,
                    name: myname
                });
                var post_message = JSON.stringify({
                    message: $scope.data.message,
                    name: myname
                })
                socket.emit('hello', post_message);

                delete $scope.data.message;
                $ionicScrollDelegate.scrollBottom(true);
            } else {
                showAlert();
            }

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